import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from typing import List, Optional
from datetime import datetime
import uuid
import os
from core.config import settings

# Initialize Firebase Admin SDK
try:
    if settings.GOOGLE_APPLICATION_CREDENTIALS and os.path.exists(settings.GOOGLE_APPLICATION_CREDENTIALS):
        cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback to default credentials, or look for environment variables
        firebase_admin.initialize_app()
except ValueError:
    # App already initialized
    pass

db = firestore.client()

class FirestoreRepository:
    def __init__(self, collection_name: str = "complaints"):
        self.collection = db.collection(collection_name)

    def create_complaint(self, complaint_data: dict) -> dict:
        doc_id = str(uuid.uuid4())
        complaint_data["id"] = doc_id
        complaint_data["created_at"] = datetime.utcnow()
        complaint_data["status"] = complaint_data.get("status", "pending")
        
        self.collection.document(doc_id).set(complaint_data)
        return complaint_data

    def get_complaint(self, doc_id: str) -> Optional[dict]:
        doc = self.collection.document(doc_id).get()
        if doc.exists:
            return doc.to_dict()
        return None

    def list_complaints(self, user_id: Optional[str] = None, limit: int = 50) -> List[dict]:
        query = self.collection
        
        if user_id:
            query = query.where(filter=FieldFilter("user_id", "==", user_id))
            
        # Order by creation date descending
        docs = query.order_by("created_at", direction=firestore.Query.DESCENDING).limit(limit).stream()
        return [doc.to_dict() for doc in docs]

firestore_repo = FirestoreRepository()
