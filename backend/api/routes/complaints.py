from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import List, Optional
from schemas.complaint import ComplaintCreate, ComplaintAIResponse
from services.gemini_service import gemini_service
from repositories.firestore_repo import firestore_repo
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
import uuid

security = HTTPBearer(auto_error=False)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    if not credentials:
        return "anonymous"
    try:
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token.get("uid", "anonymous")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.post("/")
async def create_complaint(
    description: str = Form(...),
    location: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    user_id: str = Depends(get_current_user)
):
    """
    Creates a civic complaint. If an image is uploaded, it evaluates it with Gemini.
    Stores structured AI analysis in Firestore.
    """
    image_bytes = None
    mime_type = "image/jpeg"
    
    if image:
        image_bytes = await image.read()
        mime_type = image.content_type

    # 1. Extract Geotags from Image EXIF if present
    gps_data = None
    if image_bytes:
        gps_data = get_exif_gps(image_bytes)
        if gps_data:
            print(f"📍 GPS Extracted: {gps_data}")

    # 2. Process with Gemini to get structured insight
    try:
        # Pass the input description & image
        ai_analysis: ComplaintAIResponse = gemini_service.process_complaint(
            text_input=description,
            image_bytes=image_bytes,
            mime_type=mime_type
        )
    except Exception as e:
        # Fallback if Gemini fails or is not setup
        raise HTTPException(status_code=500, detail=f"AI Processing failed: {str(e)}")

    # 3. Build model for Firestore
    complaint_doc = {
        "description": description,
        "location": f"{gps_data['latitude']}, {gps_data['longitude']}" if gps_data else (ai_analysis.location_extracted or location or "Location pending"),
        "category": ai_analysis.category,
        "severity": ai_analysis.severity,
        "ai_summary": ai_analysis.description_summary,
        "verified": ai_analysis.verified,
        "user_id": user_id,
        "image_url": "tbd_google_cloud_storage_url" if image else None,
        "latitude": gps_data['latitude'] if gps_data else ai_analysis.latitude,
        "longitude": gps_data['longitude'] if gps_data else ai_analysis.longitude
    }

    # 3. Store in Repository
    result = firestore_repo.create_complaint(complaint_doc)
    return result

@router.get("/")
async def list_complaints(user_id: Optional[str] = None):
    """
    Returns lists of complaints.
    """
    return firestore_repo.list_complaints(user_id=user_id)

@router.get("/{complaint_id}")
async def get_complaint(complaint_id: str):
    """
    Retrieve details of a single complaint.
    """
    result = firestore_repo.get_complaint(complaint_id)
    if not result:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return result
