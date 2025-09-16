from sqlalchemy import Column, String, DateTime, Text, Float, Enum, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.database import Base

class ScanType(str, enum.Enum):
    DEPARTURE = "departure"
    ARRIVAL = "arrival"
    IN_TRANSIT = "in_transit"
    DELIVERY = "delivery"
    EXCEPTION = "exception"
    PICKUP = "pickup"
    CUSTOMS = "customs"

class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    package_id = Column(String(36), ForeignKey("packages.id"), nullable=False)
    
    # Event Details
    event_type = Column(String(50), nullable=False)
    scan_type = Column(Enum(ScanType), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    
    # Location Information
    location = Column(String(255), nullable=False)
    location_coordinates = Column(Text)  # JSON as text for SQLite
    facility_name = Column(String(255))
    facility_type = Column(String(50))  # warehouse, hub, sorting_center, etc.
    
    # Event Description
    description = Column(Text, nullable=False)
    status = Column(String(50), nullable=False)
    
    # AI Analysis
    ai_analysis = Column(Text)
    ai_confidence = Column(Float)
    anomaly_detected = Column(Boolean, default=False)
    anomaly_type = Column(String(100))
    
    # Additional Data
    scan_data = Column(Text)  # JSON as text for SQLite
    operator_id = Column(String(50))
    device_id = Column(String(50))
    weather_conditions = Column(Text)  # JSON as text for SQLite
    traffic_conditions = Column(Text)  # JSON as text for SQLite
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    package = relationship("Package", back_populates="tracking_events")
    
    def __repr__(self):
        return f"<TrackingEvent(package_id='{self.package_id}', event_type='{self.event_type}')>"
