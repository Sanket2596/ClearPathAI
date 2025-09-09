from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from app.models.tracking_event import ScanType

class TrackingEventBase(BaseModel):
    event_type: str = Field(..., min_length=1, max_length=50)
    scan_type: ScanType
    timestamp: datetime
    location: str = Field(..., min_length=1, max_length=255)
    location_coordinates: Optional[Dict[str, float]] = None
    facility_name: Optional[str] = Field(None, max_length=255)
    facility_type: Optional[str] = Field(None, max_length=50)
    description: str = Field(..., min_length=1)
    status: str = Field(..., min_length=1, max_length=50)
    ai_analysis: Optional[str] = None
    ai_confidence: Optional[float] = Field(None, ge=0, le=100)
    anomaly_detected: bool = False
    anomaly_type: Optional[str] = Field(None, max_length=100)
    scan_data: Optional[Dict[str, Any]] = None
    operator_id: Optional[str] = Field(None, max_length=50)
    device_id: Optional[str] = Field(None, max_length=50)
    weather_conditions: Optional[Dict[str, Any]] = None
    traffic_conditions: Optional[Dict[str, Any]] = None

class TrackingEventCreate(TrackingEventBase):
    package_id: UUID

class TrackingEventResponse(TrackingEventBase):
    id: UUID
    package_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class TrackingEventListResponse(BaseModel):
    events: List[TrackingEventResponse]
    total: int
    page: int
    size: int
    pages: int
