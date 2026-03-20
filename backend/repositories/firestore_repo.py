import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from typing import List, Optional
from datetime import datetime
import uuid
import os
from core.config import settings

# Initialize Firebase Admin SDK
db = None
try:
    if settings.GOOGLE_APPLICATION_CREDENTIALS and os.path.exists(settings.GOOGLE_APPLICATION_CREDENTIALS):
        cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()
    db = firestore.client()
except Exception as e:
    print(f"\n⚠️ WARNING: Firebase Admin not connected ({e}). Running in MEMORY mode for quick testing.\n")

class FirestoreRepository:
    def __init__(self, collection_name: str = "complaints"):
        if db:
            self.collection = db.collection(collection_name)
        else:
            self.collection = None
        self._mock_data = []  # Fallback for in-memory dry runs

    def create_complaint(self, complaint_data: dict) -> dict:
        doc_id = str(uuid.uuid4())
        complaint_data["id"] = doc_id
        complaint_data["created_at"] = datetime.utcnow()
        complaint_data["status"] = complaint_data.get("status", "pending")
        
        if self.collection:
            self.collection.document(doc_id).set(complaint_data)
        else:
            self._mock_data.append(complaint_data)
        return complaint_data

    def get_complaint(self, doc_id: str) -> Optional[dict]:
        if self.collection:
            doc = self.collection.document(doc_id).get()
            if doc.exists:
                return doc.to_dict()
        else:
            for item in self._mock_data:
                if item["id"] == doc_id:
                    return item
        return None

    def list_complaints(self, user_id: Optional[str] = None, limit: int = 50) -> List[dict]:
        if self.collection:
            query = self.collection
            if user_id:
                query = query.where(filter=FieldFilter("user_id", "==", user_id))
            docs = query.order_by("created_at", direction=firestore.Query.DESCENDING).limit(limit).stream()
            return [doc.to_dict() for doc in docs]
        else:
            # Sort mock data by created_at desc
            return sorted(self._mock_data, key=lambda x: x["created_at"], reverse=True)[:limit]

firestore_repo = FirestoreRepository()
