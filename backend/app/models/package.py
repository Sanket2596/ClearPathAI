from sqlalchemy import Column, String, DateTime, Float, Integer, Text, Boolean, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.database import Base
import os

class PackageStatus(str, enum.Enum):
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    DELAYED = "delayed"
    LOST = "lost"
    INVESTIGATING = "investigating"

class PackagePriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Package(Base):
    __tablename__ = "packages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tracking_number = Column(String(50), unique=True, nullable=False, index=True)
    
    # Sender Information
    sender_name = Column(String(255), nullable=False)
    sender_company = Column(String(255))
    sender_address = Column(Text, nullable=False)  # JSON as text for SQLite
    sender_phone = Column(String(20))
    sender_email = Column(String(255))
    
    # Receiver Information
    receiver_name = Column(String(255), nullable=False)
    receiver_company = Column(String(255))
    receiver_address = Column(Text, nullable=False)  # JSON as text for SQLite
    receiver_phone = Column(String(20))
    receiver_email = Column(String(255))
    
    # Package Details
    origin = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    status = Column(Enum(PackageStatus), default=PackageStatus.IN_TRANSIT, nullable=False)
    priority = Column(Enum(PackagePriority), default=PackagePriority.MEDIUM, nullable=False)
    
    # Physical Properties
    weight = Column(Float, nullable=False)  # in kg
    weight_unit = Column(String(10), default="kg")
    value = Column(Float, nullable=False)  # in USD
    value_currency = Column(String(3), default="USD")
    dimensions = Column(Text)  # JSON as text for SQLite
    
    # Tracking Information
    last_scan_location = Column(String(255))
    last_scan_time = Column(DateTime(timezone=True))
    expected_delivery = Column(DateTime(timezone=True))
    actual_delivery = Column(DateTime(timezone=True))
    
    # AI Analysis
    ai_confidence = Column(Float, default=0.0)
    anomaly_type = Column(String(100))
    investigation_status = Column(String(100))
    ai_analysis = Column(Text)  # JSON as text for SQLite
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String(36))
    updated_by = Column(String(36))
    
    # Additional Fields
    special_instructions = Column(Text)
    insurance_required = Column(Boolean, default=False)
    signature_required = Column(Boolean, default=False)
    fragile = Column(Boolean, default=False)
    hazardous = Column(Boolean, default=False)
    
    # Relationships
    tracking_events = relationship("TrackingEvent", back_populates="package", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Package(tracking_number='{self.tracking_number}', status='{self.status}')>"
