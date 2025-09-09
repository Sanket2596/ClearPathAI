from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from app.models.package import PackageStatus, PackagePriority

class AddressSchema(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str
    country: str
    coordinates: Optional[Dict[str, float]] = None

class PackageDimensions(BaseModel):
    length: float
    width: float
    height: float
    unit: str = "cm"

class PackageBase(BaseModel):
    tracking_number: str = Field(..., min_length=3, max_length=50)
    sender_name: str = Field(..., min_length=1, max_length=255)
    sender_company: Optional[str] = Field(None, max_length=255)
    sender_address: AddressSchema
    sender_phone: Optional[str] = Field(None, max_length=20)
    sender_email: Optional[str] = Field(None, max_length=255)
    
    receiver_name: str = Field(..., min_length=1, max_length=255)
    receiver_company: Optional[str] = Field(None, max_length=255)
    receiver_address: AddressSchema
    receiver_phone: Optional[str] = Field(None, max_length=20)
    receiver_email: Optional[str] = Field(None, max_length=255)
    
    origin: str = Field(..., min_length=1, max_length=255)
    destination: str = Field(..., min_length=1, max_length=255)
    priority: PackagePriority = PackagePriority.MEDIUM
    
    weight: float = Field(..., gt=0)
    weight_unit: str = "kg"
    value: float = Field(..., gt=0)
    value_currency: str = "USD"
    dimensions: Optional[PackageDimensions] = None
    
    expected_delivery: Optional[datetime] = None
    special_instructions: Optional[str] = None
    insurance_required: bool = False
    signature_required: bool = False
    fragile: bool = False
    hazardous: bool = False

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
    
    # Computed fields for frontend compatibility
    @property
    def lastScan(self) -> str:
        if self.last_scan_time:
            now = datetime.now(self.last_scan_time.tzinfo)
            diff = now - self.last_scan_time
            if diff.days > 0:
                return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
            elif diff.seconds > 3600:
                hours = diff.seconds // 3600
                return f"{hours} hour{'s' if hours > 1 else ''} ago"
            elif diff.seconds > 60:
                minutes = diff.seconds // 60
                return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
            else:
                return "Just now"
        return "No scans"
    
    @property
    def weight_display(self) -> str:
        return f"{self.weight} {self.weight_unit}"
    
    @property
    def value_display(self) -> str:
        return f"${self.value:,.2f} {self.value_currency}"
    
    @property
    def createdAt(self) -> str:
        return self.created_at.strftime("%Y-%m-%d %H:%M")
    
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
    page: int = 1
    size: int = 20
    sort_by: str = "created_at"
    sort_order: str = "desc"
