from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ComplaintBase(BaseModel):
    description: str
    location: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintAIResponse(BaseModel):
    category: str = Field(..., description="Category of the civic issue (e.g., road_damage, sanitation, lighting, water)")
    severity: str = Field(..., description="Severity level: low, medium, high")
    description_summary: str = Field(..., description="A concise summary of the issue extracted from the input")
    verified: bool = Field(..., description="Whether the desk issue looks highly accurate based on content")

class Complaint(ComplaintBase):
    id: str
    user_id: str
    category: str
    severity: str
    image_url: Optional[str] = None
    status: str = "pending"  # pending, in_progress, resolved
    created_at: datetime

    class Config:
        from_attributes = True
