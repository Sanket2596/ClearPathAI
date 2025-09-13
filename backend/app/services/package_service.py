from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc, func
from typing import List, Optional, Dict, Any
from uuid import UUID
from app.models.package import Package, PackageStatus, PackagePriority
from app.schemas.package import PackageCreate, PackageUpdate, PackageSearchParams, PackageStats, PackageResponse
from app.schemas.tracking_event import TrackingEventCreate
from app.models.tracking_event import TrackingEvent
from app.websocket.event_broadcaster import event_broadcaster
from datetime import datetime, timedelta
import csv
import io
import json
import asyncio

class PackageService:
    def __init__(self, db: Session):
        self.db = db
    
    def _package_to_response(self, package: Package) -> PackageResponse:
        """Convert Package model to PackageResponse schema"""
        # Parse JSON strings back to dictionaries
        sender_address = None
        receiver_address = None
        
        if package.sender_address:
            try:
                sender_address = json.loads(package.sender_address) if isinstance(package.sender_address, str) else package.sender_address
            except (json.JSONDecodeError, TypeError):
                sender_address = {"street": "", "city": "", "state": "", "zip_code": "", "country": ""}
        
        if package.receiver_address:
            try:
                receiver_address = json.loads(package.receiver_address) if isinstance(package.receiver_address, str) else package.receiver_address
            except (json.JSONDecodeError, TypeError):
                receiver_address = {"street": "", "city": "", "state": "", "zip_code": "", "country": ""}
        
        # Create response object
        response_data = {
            "id": package.id,
            "tracking_number": package.tracking_number,
            "sender_name": package.sender_name,
            "sender_company": package.sender_company,
            "sender_address": sender_address,
            "sender_phone": package.sender_phone,
            "sender_email": package.sender_email,
            "receiver_name": package.receiver_name,
            "receiver_company": package.receiver_company,
            "receiver_address": receiver_address,
            "receiver_phone": package.receiver_phone,
            "receiver_email": package.receiver_email,
            "origin": package.origin,
            "destination": package.destination,
            "status": package.status,
            "priority": package.priority,
            "weight": package.weight,
            "weight_unit": package.weight_unit,
            "value": package.value,
            "value_currency": package.value_currency,
            "expected_delivery": package.expected_delivery,
            "actual_delivery": package.actual_delivery,
            "last_scan_location": package.last_scan_location,
            "last_scan_time": package.last_scan_time,
            "ai_confidence": package.ai_confidence,
            "anomaly_type": package.anomaly_type,
            "investigation_status": package.investigation_status,
            "ai_analysis": package.ai_analysis,
            "special_instructions": package.special_instructions,
            "insurance_required": package.insurance_required,
            "signature_required": package.signature_required,
            "fragile": package.fragile,
            "hazardous": package.hazardous,
            "created_at": package.created_at,
            "updated_at": package.updated_at
        }
        
        return PackageResponse(**response_data)
    
    def create_package(self, package_data: PackageCreate) -> Package:
        """Create a new package"""
        db_package = Package(**package_data.dict())
        self.db.add(db_package)
        self.db.commit()
        self.db.refresh(db_package)
        
        # Broadcast package creation via WebSocket
        asyncio.create_task(event_broadcaster.broadcast_package_update(
            package_id=str(db_package.id),
            tracking_number=db_package.tracking_number,
            status=db_package.status.value,
            location=db_package.origin,
            estimated_delivery=db_package.estimated_delivery,
            carrier=db_package.carrier
        ))
        
        return db_package
    
    def get_package(self, package_id: str) -> Optional[Package]:
        """Get package by ID"""
        return self.db.query(Package).filter(Package.id == package_id).first()
    
    def get_package_by_tracking(self, tracking_number: str) -> Optional[Package]:
        """Get package by tracking number"""
        return self.db.query(Package).filter(Package.tracking_number == tracking_number).first()
    
    def get_packages(self, params: PackageSearchParams) -> Dict[str, Any]:
        """Get packages with filtering, searching, and pagination"""
        query = self.db.query(Package)
        
        # Apply filters
        if params.search:
            search_filter = or_(
                Package.tracking_number.ilike(f"%{params.search}%"),
                Package.sender_name.ilike(f"%{params.search}%"),
                Package.receiver_name.ilike(f"%{params.search}%"),
                Package.origin.ilike(f"%{params.search}%"),
                Package.destination.ilike(f"%{params.search}%")
            )
            query = query.filter(search_filter)
        
        if params.status:
            query = query.filter(Package.status == params.status)
        
        if params.priority:
            query = query.filter(Package.priority == params.priority)
        
        if params.origin:
            query = query.filter(Package.origin.ilike(f"%{params.origin}%"))
        
        if params.destination:
            query = query.filter(Package.destination.ilike(f"%{params.destination}%"))
        
        if params.date_from:
            query = query.filter(Package.created_at >= params.date_from)
        
        if params.date_to:
            query = query.filter(Package.created_at <= params.date_to)
        
        # Apply sorting
        if params.sort_by == "created_at":
            order_func = desc if params.sort_order == "desc" else asc
            query = query.order_by(order_func(Package.created_at))
        elif params.sort_by == "tracking_number":
            order_func = desc if params.sort_order == "desc" else asc
            query = query.order_by(order_func(Package.tracking_number))
        elif params.sort_by == "status":
            query = query.order_by(Package.status)
        elif params.sort_by == "priority":
            query = query.order_by(Package.priority)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (params.page - 1) * params.size
        packages = query.offset(offset).limit(params.size).all()
        
        # Calculate pages
        pages = (total + params.size - 1) // params.size
        
        # Convert packages to response format
        package_responses = [self._package_to_response(pkg) for pkg in packages]
        
        return {
            "packages": package_responses,
            "total": total,
            "page": params.page,
            "size": params.size,
            "pages": pages
        }
    
    def update_package(self, package_id: UUID, update_data: PackageUpdate) -> Optional[Package]:
        """Update package"""
        db_package = self.get_package(package_id)
        if not db_package:
            return None
        
        # Store old status for comparison
        old_status = db_package.status.value
        
        update_dict = update_data.dict(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(db_package, field, value)
        
        db_package.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(db_package)
        
        # Broadcast package update via WebSocket if status changed
        if old_status != db_package.status.value:
            asyncio.create_task(event_broadcaster.broadcast_package_update(
                package_id=str(db_package.id),
                tracking_number=db_package.tracking_number,
                status=db_package.status.value,
                location=db_package.current_location or db_package.origin,
                estimated_delivery=db_package.estimated_delivery,
                carrier=db_package.carrier
            ))
        
        return db_package
    
    def delete_package(self, package_id: UUID) -> bool:
        """Delete package"""
        db_package = self.get_package(package_id)
        if not db_package:
            return False
        
        self.db.delete(db_package)
        self.db.commit()
        return True
    
    def get_package_stats(self) -> PackageStats:
        """Get package statistics"""
        total_packages = self.db.query(Package).count()
        
        # Status counts
        status_counts = {}
        for status in PackageStatus:
            count = self.db.query(Package).filter(Package.status == status).count()
            status_counts[status.value] = count
        
        # Priority counts
        priority_counts = {}
        for priority in PackagePriority:
            count = self.db.query(Package).filter(Package.priority == priority).count()
            priority_counts[priority.value] = count
        
        return PackageStats(
            total_packages=total_packages,
            in_transit=status_counts.get("in_transit", 0),
            delivered=status_counts.get("delivered", 0),
            delayed=status_counts.get("delayed", 0),
            lost=status_counts.get("lost", 0),
            investigating=status_counts.get("investigating", 0),
            by_priority=priority_counts,
            by_status=status_counts
        )
    
    def add_tracking_event(self, package_id: str, event_data: TrackingEventCreate) -> TrackingEvent:
        """Add tracking event to package"""
        db_event = TrackingEvent(**event_data.dict())
        self.db.add(db_event)
        
        # Update package last scan info
        package = self.get_package(package_id)
        if package:
            package.last_scan_location = event_data.location
            package.last_scan_time = event_data.timestamp
            package.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(db_event)
        return db_event
    
    def get_package_tracking_events(self, package_id: str) -> List[TrackingEvent]:
        """Get all tracking events for a package"""
        return self.db.query(TrackingEvent).filter(
            TrackingEvent.package_id == package_id
        ).order_by(TrackingEvent.timestamp.desc()).all()
    
    def export_packages_csv(self, params: PackageSearchParams) -> str:
        """Export packages to CSV"""
        result = self.get_packages(params)
        packages = result["packages"]
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            "Tracking Number", "Sender", "Receiver", "Origin", "Destination",
            "Status", "Priority", "Weight", "Value", "Last Scan", "Expected Delivery",
            "AI Confidence", "Anomaly Type", "Created At"
        ])
        
        # Write data
        for package in packages:
            writer.writerow([
                package.tracking_number,
                package.sender_name,
                package.receiver_name,
                package.origin,
                package.destination,
                package.status.value,
                package.priority.value,
                f"{package.weight} {package.weight_unit}",
                f"${package.value} {package.value_currency}",
                package.last_scan_time.strftime("%Y-%m-%d %H:%M") if package.last_scan_time else "N/A",
                package.expected_delivery.strftime("%Y-%m-%d %H:%M") if package.expected_delivery else "N/A",
                f"{package.ai_confidence}%" if package.ai_confidence else "N/A",
                package.anomaly_type or "N/A",
                package.created_at.strftime("%Y-%m-%d %H:%M")
            ])
        
        return output.getvalue()
    
    def get_recent_packages(self, limit: int = 10) -> List[Package]:
        """Get recently created packages"""
        return self.db.query(Package).order_by(
            desc(Package.created_at)
        ).limit(limit).all()
    
    def get_packages_by_status(self, status: PackageStatus) -> List[Package]:
        """Get packages by status"""
        return self.db.query(Package).filter(Package.status == status).all()
    
    def get_packages_by_priority(self, priority: PackagePriority) -> List[Package]:
        """Get packages by priority"""
        return self.db.query(Package).filter(Package.priority == priority).all()
    
    def bulk_update_packages(self, package_ids: List[UUID], update_data: PackageUpdate) -> Dict[str, Any]:
        """Bulk update multiple packages"""
        updated_packages = []
        failed_updates = []
        
        for package_id in package_ids:
            try:
                package = self.update_package(package_id, update_data)
                if package:
                    updated_packages.append(self._package_to_response(package))
                else:
                    failed_updates.append(str(package_id))
            except Exception as e:
                failed_updates.append(str(package_id))
        
        return {
            "updated_packages": updated_packages,
            "updated_count": len(updated_packages),
            "failed_count": len(failed_updates),
            "failed_package_ids": failed_updates
        }
    
    def get_packages_with_date_range(self, params: PackageSearchParams) -> Dict[str, Any]:
        """Get packages with date range filtering"""
        query = self.db.query(Package)
        
        # Apply filters
        if params.search:
            search_filter = or_(
                Package.tracking_number.ilike(f"%{params.search}%"),
                Package.sender_name.ilike(f"%{params.search}%"),
                Package.receiver_name.ilike(f"%{params.search}%"),
                Package.origin.ilike(f"%{params.search}%"),
                Package.destination.ilike(f"%{params.search}%")
            )
            query = query.filter(search_filter)
        
        if params.status:
            query = query.filter(Package.status == params.status)
        
        if params.priority:
            query = query.filter(Package.priority == params.priority)
        
        if params.origin:
            query = query.filter(Package.origin.ilike(f"%{params.origin}%"))
        
        if params.destination:
            query = query.filter(Package.destination.ilike(f"%{params.destination}%"))
        
        # Handle date filtering
        if params.start_date:
            try:
                start_date = datetime.strptime(params.start_date, "%Y-%m-%d")
                query = query.filter(Package.created_at >= start_date)
            except ValueError:
                pass
        
        if params.end_date:
            try:
                end_date = datetime.strptime(params.end_date, "%Y-%m-%d")
                query = query.filter(Package.created_at <= end_date)
            except ValueError:
                pass
        
        if params.date_from:
            query = query.filter(Package.created_at >= params.date_from)
        
        if params.date_to:
            query = query.filter(Package.created_at <= params.date_to)
        
        # Apply sorting
        if params.sort_by == "created_at":
            order_func = desc if params.sort_order == "desc" else asc
            query = query.order_by(order_func(Package.created_at))
        elif params.sort_by == "tracking_number":
            order_func = desc if params.sort_order == "desc" else asc
            query = query.order_by(order_func(Package.tracking_number))
        elif params.sort_by == "status":
            query = query.order_by(Package.status)
        elif params.sort_by == "priority":
            query = query.order_by(Package.priority)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (params.page - 1) * params.size
        packages = query.offset(offset).limit(params.size).all()
        
        # Calculate pages
        pages = (total + params.size - 1) // params.size
        
        # Convert packages to response format
        package_responses = [self._package_to_response(pkg) for pkg in packages]
        
        return {
            "packages": package_responses,
            "total": total,
            "page": params.page,
            "size": params.size,
            "pages": pages
        }