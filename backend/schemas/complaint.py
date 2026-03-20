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
    location_extracted: Optional[str] = Field(None, description="Extracted address, street, or landmark mentioned in text (if style triggers)")
    latitude: float = Field(..., description="Extracted or estimated latitude for the complaint location.")
    longitude: float = Field(..., description="Extracted or estimated longitude for the complaint location.")

class Complaint(ComplaintBase):
    id: str
    user_id: str
    category: str
    severity: str
    image_url: Optional[str] = None
    status: str = "pending"  # pending, in_progress, resolved
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
