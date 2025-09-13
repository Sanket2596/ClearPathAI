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
    PackageSearchParams, PackageStats, BulkUpdateRequest
)
from app.schemas.tracking_event import TrackingEventCreate, TrackingEventResponse
from app.services.package_service import PackageService
from app.auth.dependencies import get_current_user, get_current_user_optional, get_active_user
from app.models.user import User
from app.utils.validation import InputValidator

router = APIRouter(prefix="/packages", tags=["packages"])

@router.post("/", response_model=PackageResponse)
async def create_package(
    package_data: PackageCreate,
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Create a new package (requires authentication)"""
    service = PackageService(db)
    
    # Validate and sanitize input data
    sanitized_data = InputValidator.validate_and_sanitize_package_data(package_data.dict())
    
    # Check if tracking number already exists
    existing = service.get_package_by_tracking(sanitized_data['tracking_number'])
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Package with this tracking number already exists"
        )
    
    # Create package with sanitized data
    package = service.create_package(PackageCreate(**sanitized_data))
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
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Get packages with filtering and pagination (requires authentication)"""
    service = PackageService(db)
    
    # Validate and sanitize search parameters
    search_params = {
        'search': search,
        'status': status,
        'priority': priority,
        'origin': origin,
        'destination': destination,
        'page': page,
        'size': size,
        'sort_by': sort_by,
        'sort_order': sort_order
    }
    
    sanitized_params = InputValidator.validate_search_params(search_params)
    
    params = PackageSearchParams(**sanitized_params)
    
    result = service.get_packages(params)
    return PackageListResponse(**result)

@router.get("/stats", response_model=PackageStats)
async def get_package_stats(
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Get package statistics (requires authentication)"""
    service = PackageService(db)
    return service.get_package_stats()

@router.get("/{package_id}", response_model=PackageResponse)
async def get_package(
    package_id: UUID,
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Get package by ID (requires authentication)"""
    service = PackageService(db)
    package = service.get_package(package_id)
    
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    return package

@router.get("/tracking/{tracking_number}", response_model=PackageResponse)
async def get_package_by_tracking(
    tracking_number: str,
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Get package by tracking number (requires authentication)"""
    service = PackageService(db)
    
    # Sanitize tracking number
    sanitized_tracking = InputValidator.validate_and_sanitize_package_data({
        'tracking_number': tracking_number
    })['tracking_number']
    
    package = service.get_package_by_tracking(sanitized_tracking)
    
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    return package

@router.put("/{package_id}", response_model=PackageResponse)
async def update_package(
    package_id: UUID,
    update_data: PackageUpdate,
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Update package (requires authentication)"""
    service = PackageService(db)
    
    # Validate and sanitize update data
    sanitized_data = InputValidator.validate_and_sanitize_package_data(update_data.dict())
    
    package = service.update_package(package_id, PackageUpdate(**sanitized_data))
    
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    return package

@router.delete("/{package_id}")
async def delete_package(
    package_id: UUID,
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Delete package (requires authentication)"""
    service = PackageService(db)
    success = service.delete_package(package_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Package not found")
    
    return {"message": "Package deleted successfully"}

@router.put("/bulk-update")
async def bulk_update_packages(
    bulk_request: BulkUpdateRequest,
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Bulk update multiple packages (requires authentication)"""
    service = PackageService(db)
    
    # Validate and sanitize update data
    sanitized_data = InputValidator.validate_and_sanitize_package_data(bulk_request.update_data.dict())
    
    result = service.bulk_update_packages(
        bulk_request.package_ids, 
        PackageUpdate(**sanitized_data)
    )
    
    return {
        "message": f"Bulk update completed. {result['updated_count']} packages updated successfully.",
        "updated_count": result["updated_count"],
        "failed_count": result["failed_count"],
        "failed_package_ids": result["failed_package_ids"],
        "updated_packages": result["updated_packages"]
    }

@router.post("/{package_id}/tracking-events", response_model=TrackingEventResponse)
async def add_tracking_event(
    package_id: str,
    event_data: TrackingEventCreate,
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Add tracking event to package (requires authentication)"""
    service = PackageService(db)
    
    # Verify package exists
    package = service.get_package(package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    event = service.add_tracking_event(package_id, event_data)
    return event

@router.get("/{package_id}/tracking-events", response_model=List[TrackingEventResponse])
async def get_package_tracking_events(
    package_id: str,
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Get all tracking events for a package (requires authentication)"""
    service = PackageService(db)
    
    # Verify package exists
    package = service.get_package(package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    events = service.get_package_tracking_events(package_id)
    return events

@router.get("/export")
async def export_packages(
    format: str = Query("json", description="Export format (csv or json)"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    origin: Optional[str] = Query(None),
    destination: Optional[str] = Query(None),
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Export packages in specified format with date range (requires authentication)"""
    service = PackageService(db)
    
    # Validate and sanitize search parameters
    search_params = {
        'search': search,
        'status': status,
        'priority': priority,
        'origin': origin,
        'destination': destination,
        'start_date': start_date,
        'end_date': end_date,
        'page': 1,
        'size': 10000
    }
    
    sanitized_params = InputValidator.validate_search_params(search_params)
    params = PackageSearchParams(**sanitized_params)
    
    if format.lower() == "csv":
        csv_content = service.export_packages_csv(params)
        return StreamingResponse(
            io.StringIO(csv_content),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=packages_export_{datetime.utcnow().strftime('%Y%m%d')}.csv"}
        )
    else:
        result = service.get_packages_with_date_range(params)
        packages = result["packages"]
        
        return {
            "packages": packages,
            "exported_at": datetime.utcnow().isoformat(),
            "total": result["total"],
            "filters": {
                "start_date": start_date,
                "end_date": end_date,
                "search": search,
                "status": status,
                "priority": priority,
                "origin": origin,
                "destination": destination
            }
        }

@router.get("/export/csv")
async def export_packages_csv(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    origin: Optional[str] = Query(None),
    destination: Optional[str] = Query(None),
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Export packages to CSV (requires authentication)"""
    service = PackageService(db)
    
    # Validate and sanitize search parameters
    search_params = {
        'search': search,
        'status': status,
        'priority': priority,
        'origin': origin,
        'destination': destination,
        'page': 1,
        'size': 10000
    }
    
    sanitized_params = InputValidator.validate_search_params(search_params)
    
    params = PackageSearchParams(**sanitized_params)
    
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
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Export packages to JSON (requires authentication)"""
    service = PackageService(db)
    
    # Validate and sanitize search parameters
    search_params = {
        'search': search,
        'status': status,
        'priority': priority,
        'origin': origin,
        'destination': destination,
        'page': 1,
        'size': 10000
    }
    
    sanitized_params = InputValidator.validate_search_params(search_params)
    
    params = PackageSearchParams(**sanitized_params)
    
    result = service.get_packages(params)
    packages = [PackageResponse.from_orm(pkg) for pkg in result["packages"]]
    
    return {
        "packages": packages,
        "exported_at": datetime.utcnow().isoformat(),
        "total": result["total"]
    }

@router.post("/refresh")
async def refresh_packages(
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    """Refresh packages data (simulate real-time update) (requires authentication)"""
    service = PackageService(db)
    
    # This could trigger a background task to update package statuses
    # For now, just return current stats
    stats = service.get_package_stats()
    
    return {
        "message": "Packages refreshed successfully",
        "stats": stats,
        "refreshed_at": datetime.utcnow().isoformat()
    } 
