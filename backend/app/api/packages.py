from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import datetime
import io

from app.database import get_db
from app.schemas.package import (
    PackageCreate, PackageUpdate, PackageResponse, PackageListResponse,
    PackageSearchParams, PackageStats
)
from app.schemas.tracking_event import TrackingEventCreate, TrackingEventResponse
from app.services.package_service import PackageService

router = APIRouter(prefix="/packages", tags=["packages"])

@router.post("/", response_model=PackageResponse)
async def create_package(
    package_data: PackageCreate,
    db: Session = Depends(get_db)
):
    """Create a new package"""
    service = PackageService(db)
    
    # Check if tracking number already exists
    existing = service.get_package_by_tracking(package_data.tracking_number)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Package with this tracking number already exists"
        )
    
    package = service.create_package(package_data)
    return package

@router.get("/", response_model=PackageListResponse)
async def get_packages(
    search: Optional[str] = Query(None, description="Search term"),
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    origin: Optional[str] = Query(None, description="Filter by origin"),
    destination: Optional[str] = Query(None, description="Filter by destination"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order"),
    db: Session = Depends(get_db)
):
    """Get packages with filtering and pagination"""
    service = PackageService(db)
    
    params = PackageSearchParams(
        search=search,
        status=status,
        priority=priority,
        origin=origin,
        destination=destination,
        page=page,
        size=size,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    result = service.get_packages(params)
    return PackageListResponse(**result)

@router.get("/stats", response_model=PackageStats)
async def get_package_stats(db: Session = Depends(get_db)):
    """Get package statistics"""
    service = PackageService(db)
    return service.get_package_stats()

@router.get("/{package_id}", response_model=PackageResponse)
async def get_package(
    package_id: UUID,
    db: Session = Depends(get_db)
):
    """Get package by ID"""
    service = PackageService(db)
    package = service.get_package(package_id)
    
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    return package

@router.get("/tracking/{tracking_number}", response_model=PackageResponse)
async def get_package_by_tracking(
    tracking_number: str,
    db: Session = Depends(get_db)
):
    """Get package by tracking number"""
    service = PackageService(db)
    package = service.get_package_by_tracking(tracking_number)
    
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    return package

@router.put("/{package_id}", response_model=PackageResponse)
async def update_package(
    package_id: UUID,
    update_data: PackageUpdate,
    db: Session = Depends(get_db)
):
    """Update package"""
    service = PackageService(db)
    package = service.update_package(package_id, update_data)
    
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    return package

@router.delete("/{package_id}")
async def delete_package(
    package_id: UUID,
    db: Session = Depends(get_db)
):
    """Delete package"""
    service = PackageService(db)
    success = service.delete_package(package_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Package not found")
    
    return {"message": "Package deleted successfully"}

@router.post("/{package_id}/tracking", response_model=TrackingEventResponse)
async def add_tracking_event(
    package_id: str,
    event_data: TrackingEventCreate,
    db: Session = Depends(get_db)
):
    """Add tracking event to package"""
    service = PackageService(db)
    
    # Verify package exists
    package = service.get_package(package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    event = service.add_tracking_event(package_id, event_data)
    return event

@router.get("/{package_id}/tracking", response_model=List[TrackingEventResponse])
async def get_package_tracking_events(
    package_id: str,
    db: Session = Depends(get_db)
):
    """Get all tracking events for a package"""
    service = PackageService(db)
    
    # Verify package exists
    package = service.get_package(package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    events = service.get_package_tracking_events(package_id)
    return events

@router.get("/export/csv")
async def export_packages_csv(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    origin: Optional[str] = Query(None),
    destination: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Export packages to CSV"""
    service = PackageService(db)
    
    params = PackageSearchParams(
        search=search,
        status=status,
        priority=priority,
        origin=origin,
        destination=destination,
        page=1,
        size=10000  # Large number to get all results
    )
    
    csv_content = service.export_packages_csv(params)
    
    return StreamingResponse(
        io.StringIO(csv_content),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=packages_export.csv"}
    )

@router.get("/export/json")
async def export_packages_json(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    origin: Optional[str] = Query(None),
    destination: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Export packages to JSON"""
    service = PackageService(db)
    
    params = PackageSearchParams(
        search=search,
        status=status,
        priority=priority,
        origin=origin,
        destination=destination,
        page=1,
        size=10000
    )
    
    result = service.get_packages(params)
    packages = [PackageResponse.from_orm(pkg) for pkg in result["packages"]]
    
    return {
        "packages": packages,
        "exported_at": datetime.utcnow().isoformat(),
        "total": result["total"]
    }

@router.post("/refresh")
async def refresh_packages(db: Session = Depends(get_db)):
    """Refresh packages data (simulate real-time update)"""
    service = PackageService(db)
    
    # This could trigger a background task to update package statuses
    # For now, just return current stats
    stats = service.get_package_stats()
    
    return {
        "message": "Packages refreshed successfully",
        "stats": stats,
        "refreshed_at": datetime.utcnow().isoformat()
    } 
