from pydantic import BaseModel, Field, validator, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from app.models.package import PackageStatus, PackagePriority

class AddressSchema(BaseModel):
    street: str = Field(..., min_length=1, max_length=255)
    city: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=1, max_length=100)
    zip_code: str = Field(..., min_length=1, max_length=20)
    country: str = Field(..., min_length=1, max_length=100)
    coordinates: Optional[Dict[str, float]] = None
    
    @validator('street', 'city', 'state', 'zip_code', 'country')
    def validate_address_fields(cls, v):
        # Basic validation - in production, add proper sanitization
        if not v or len(v.strip()) == 0:
            raise ValueError('Address field cannot be empty')
        return v.strip()
    
    @validator('coordinates')
    def validate_coordinates(cls, v):
        if v and isinstance(v, dict):
            lat = v.get('lat')
            lng = v.get('lng')
            if lat is not None and (lat < -90 or lat > 90):
                raise ValueError('Latitude must be between -90 and 90')
            if lng is not None and (lng < -180 or lng > 180):
                raise ValueError('Longitude must be between -180 and 180')
        return v

class PackageDimensions(BaseModel):
    length: float = Field(..., gt=0, le=1000)  # Max 1000 cm
    width: float = Field(..., gt=0, le=1000)
    height: float = Field(..., gt=0, le=1000)
    unit: str = Field(default="cm", regex="^(cm|in|m|ft)$")

class PackageBase(BaseModel):
    tracking_number: str = Field(..., min_length=3, max_length=50)
    sender_name: str = Field(..., min_length=1, max_length=255)
    sender_company: Optional[str] = Field(None, max_length=255)
    sender_address: AddressSchema
    sender_phone: Optional[str] = Field(None, max_length=20)
    sender_email: Optional[EmailStr] = Field(None, max_length=255)
    
    receiver_name: str = Field(..., min_length=1, max_length=255)
    receiver_company: Optional[str] = Field(None, max_length=255)
    receiver_address: AddressSchema
    receiver_phone: Optional[str] = Field(None, max_length=20)
    receiver_email: Optional[EmailStr] = Field(None, max_length=255)
    
    origin: str = Field(..., min_length=1, max_length=255)
    destination: str = Field(..., min_length=1, max_length=255)
    priority: PackagePriority = PackagePriority.MEDIUM
    
    weight: float = Field(..., gt=0, le=10000)  # Max 10000 kg
    weight_unit: str = Field(default="kg", regex="^(kg|lb|g|oz)$")
    value: float = Field(..., gt=0, le=1000000)  # Max $1M
    value_currency: str = Field(default="USD", regex="^(USD|EUR|GBP|CAD|AUD)$")
    dimensions: Optional[PackageDimensions] = None
    
    expected_delivery: Optional[datetime] = None
    special_instructions: Optional[str] = Field(None, max_length=1000)
    insurance_required: bool = False
    signature_required: bool = False
    fragile: bool = False
    hazardous: bool = False
    
    @validator('tracking_number')
    def validate_tracking_number(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Tracking number cannot be empty')
        return v.strip()
    
    @validator('sender_name', 'receiver_name', 'origin', 'destination')
    def validate_required_string_fields(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Field cannot be empty')
        return v.strip()
    
    @validator('weight')
    def validate_weight(cls, v):
        if v <= 0:
            raise ValueError('Weight must be greater than 0')
        if v > 10000:
            raise ValueError('Weight cannot exceed 10000 kg')
        return v
    
    @validator('value')
    def validate_value(cls, v):
        if v <= 0:
            raise ValueError('Value must be greater than 0')
        if v > 1000000:
            raise ValueError('Value cannot exceed $1,000,000')
        return v

class PackageCreate(PackageBase):
    pass

class PackageUpdate(BaseModel):
    status: Optional[PackageStatus] = None
    priority: Optional[PackagePriority] = None
    last_scan_location: Optional[str] = None
    last_scan_time: Optional[datetime] = None
    expected_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    ai_confidence: Optional[float] = Field(None, ge=0, le=100)
    anomaly_type: Optional[str] = None
    investigation_status: Optional[str] = None
    ai_analysis: Optional[Dict[str, Any]] = None
    special_instructions: Optional[str] = None

class PackageResponse(BaseModel):
    id: UUID
    tracking_number: str
    sender_name: str
    sender_company: Optional[str] = None
    sender_address: Optional[Dict[str, Any]] = None
    sender_phone: Optional[str] = None
    sender_email: Optional[str] = None
    receiver_name: str
    receiver_company: Optional[str] = None
    receiver_address: Optional[Dict[str, Any]] = None
    receiver_phone: Optional[str] = None
    receiver_email: Optional[str] = None
    origin: str
    destination: str
    status: PackageStatus
    priority: PackagePriority
    weight: float
    weight_unit: str = "kg"
    value: float
    value_currency: str = "USD"
    expected_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    last_scan_location: Optional[str] = None
    last_scan_time: Optional[datetime] = None
    ai_confidence: Optional[float] = None
    anomaly_type: Optional[str] = None
    investigation_status: Optional[str] = None
    ai_analysis: Optional[Dict[str, Any]] = None
    special_instructions: Optional[str] = None
    insurance_required: bool = False
    signature_required: bool = False
    fragile: bool = False
    hazardous: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class PackageListResponse(BaseModel):
    packages: List[PackageResponse]
    total: int
    page: int
    size: int
    pages: int

class PackageStats(BaseModel):
    total_packages: int
    in_transit: int
    delivered: int
    delayed: int
    lost: int
    investigating: int
    by_priority: Dict[str, int]
    by_status: Dict[str, int]

class PackageSearchParams(BaseModel):
    search: Optional[str] = None
    status: Optional[PackageStatus] = None
    priority: Optional[PackagePriority] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    page: int = 1
    size: int = 20
    sort_by: str = "created_at"
    sort_order: str = "desc"

class BulkUpdateRequest(BaseModel):
    package_ids: List[UUID]
    update_data: PackageUpdate
