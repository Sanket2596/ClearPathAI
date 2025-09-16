from sqlalchemy import Column, String, DateTime, Boolean, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_user_id = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    username = Column(String(100), unique=True, index=True)
    phone_number = Column(String(20))
    
    # Profile information
    profile_image_url = Column(String(500))
    bio = Column(Text)
    timezone = Column(String(50), default="UTC")
    locale = Column(String(10), default="en")
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    
    # Metadata
    last_login = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Additional metadata from Clerk
    clerk_metadata = Column(JSON)
    
    def __repr__(self):
        return f"<User(email='{self.email}', clerk_id='{self.clerk_user_id}')>"
    
    @property
    def full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.first_name or self.last_name or self.email
    
    @property
    def display_name(self):
        return self.full_name or self.username or self.email
