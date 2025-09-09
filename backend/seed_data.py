#!/usr/bin/env python3
"""
Script to populate the database with sample package data
"""
import asyncio
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.package import Package, PackageStatus, PackagePriority
from app.models.tracking_event import TrackingEvent, ScanType
from app.database import Base

def create_sample_packages():
    """Create sample packages for testing with diverse risk levels"""
    db = SessionLocal()
    
    try:
        # Sample packages data with different risk levels and scenarios
        sample_packages = [
            # CRITICAL PRIORITY PACKAGES
            {
                "tracking_number": "CP-2024-001",
                "sender_name": "MedSupply Co.",
                "sender_company": "MedSupply Co.",
                "sender_address": {
                    "street": "789 Medical Blvd",
                    "city": "Philadelphia",
                    "state": "PA",
                    "zip_code": "19101",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0789",
                "sender_email": "orders@medsupply.com",
                "receiver_name": "City Hospital",
                "receiver_company": "City Hospital",
                "receiver_address": {
                    "street": "321 Health St",
                    "city": "Boston",
                    "state": "MA",
                    "zip_code": "02118",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0321",
                "receiver_email": "receiving@cityhospital.org",
                "origin": "Philadelphia, PA",
                "destination": "Boston, MA",
                "status": PackageStatus.DELIVERED,
                "priority": PackagePriority.CRITICAL,
                "weight": 0.8,
                "weight_unit": "kg",
                "value": 3400.00,
                "value_currency": "USD",
                "expected_delivery": datetime.now() - timedelta(hours=1),
                "actual_delivery": datetime.now() - timedelta(minutes=30),
                "ai_confidence": 98.0,
                "created_at": datetime.now() - timedelta(hours=4),
                "fragile": True,
                "signature_required": True,
                "insurance_required": True
            },
            {
                "tracking_number": "CP-2024-002",
                "sender_name": "Emergency Medical",
                "sender_company": "Emergency Medical",
                "sender_address": {
                    "street": "456 Emergency Way",
                    "city": "Miami",
                    "state": "FL",
                    "zip_code": "33101",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0456",
                "sender_email": "urgent@emergencymed.com",
                "receiver_name": "Regional Trauma Center",
                "receiver_company": "Regional Trauma Center",
                "receiver_address": {
                    "street": "789 Trauma Ave",
                    "city": "Atlanta",
                    "state": "GA",
                    "zip_code": "30309",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0789",
                "receiver_email": "receiving@traumacenter.org",
                "origin": "Miami, FL",
                "destination": "Atlanta, GA",
                "status": PackageStatus.IN_TRANSIT,
                "priority": PackagePriority.CRITICAL,
                "weight": 1.2,
                "weight_unit": "kg",
                "value": 8500.00,
                "value_currency": "USD",
                "expected_delivery": datetime.now() + timedelta(hours=2),
                "ai_confidence": 99.0,
                "created_at": datetime.now() - timedelta(hours=1),
                "fragile": True,
                "signature_required": True,
                "insurance_required": True,
                "hazardous": True
            },
            {
                "tracking_number": "CP-2024-003",
                "sender_name": "TechCorp Inc.",
                "sender_company": "TechCorp Inc.",
                "sender_address": {
                    "street": "123 Tech Street",
                    "city": "New York",
                    "state": "NY",
                    "zip_code": "10001",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0123",
                "sender_email": "shipping@techcorp.com",
                "receiver_name": "Global Solutions Ltd.",
                "receiver_company": "Global Solutions Ltd.",
                "receiver_address": {
                    "street": "456 Business Ave",
                    "city": "Boston",
                    "state": "MA",
                    "zip_code": "02101",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0456",
                "receiver_email": "receiving@globalsolutions.com",
                "origin": "New York, NY",
                "destination": "Boston, MA",
                "status": PackageStatus.INVESTIGATING,
                "priority": PackagePriority.CRITICAL,
                "weight": 2.5,
                "weight_unit": "kg",
                "value": 12500.00,
                "value_currency": "USD",
                "expected_delivery": datetime.now() + timedelta(days=1),
                "ai_confidence": 45.0,
                "anomaly_type": "Security Breach Detected",
                "investigation_status": "FBI Investigation",
                "created_at": datetime.now() - timedelta(hours=2),
                "fragile": True,
                "signature_required": True,
                "insurance_required": True
            },
            
            # HIGH PRIORITY PACKAGES
            {
                "tracking_number": "CP-2024-004",
                "sender_name": "Fashion Forward",
                "sender_company": "Fashion Forward",
                "sender_address": {
                    "street": "888 Style St",
                    "city": "San Francisco",
                    "state": "CA",
                    "zip_code": "94101",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0888",
                "sender_email": "orders@fashionforward.com",
                "receiver_name": "Style Boutique",
                "receiver_company": "Style Boutique",
                "receiver_address": {
                    "street": "999 Fashion Ave",
                    "city": "Los Angeles",
                    "state": "CA",
                    "zip_code": "90001",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0999",
                "receiver_email": "receiving@styleboutique.com",
                "origin": "San Francisco, CA",
                "destination": "Los Angeles, CA",
                "status": PackageStatus.INVESTIGATING,
                "priority": PackagePriority.HIGH,
                "weight": 3.1,
                "weight_unit": "kg",
                "value": 2100.00,
                "value_currency": "USD",
                "expected_delivery": datetime.now() + timedelta(hours=4),
                "anomaly_type": "Route Deviation",
                "investigation_status": "AI Agent Assigned",
                "ai_confidence": 76.0,
                "created_at": datetime.now() - timedelta(hours=3)
            },
            {
                "tracking_number": "CP-2024-005",
                "sender_name": "Electronics Plus",
                "sender_company": "Electronics Plus",
                "sender_address": {
                    "street": "555 Circuit Blvd",
                    "city": "Austin",
                    "state": "TX",
                    "zip_code": "73301",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0555",
                "sender_email": "shipping@electronicsplus.com",
                "receiver_name": "Tech Solutions Inc.",
                "receiver_company": "Tech Solutions Inc.",
                "receiver_address": {
                    "street": "777 Innovation Dr",
                    "city": "Seattle",
                    "state": "WA",
                    "zip_code": "98101",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0777",
                "receiver_email": "receiving@techsolutions.com",
                "origin": "Austin, TX",
                "destination": "Seattle, WA",
                "status": PackageStatus.IN_TRANSIT,
                "priority": PackagePriority.HIGH,
                "weight": 4.2,
                "weight_unit": "kg",
                "value": 3200.00,
                "value_currency": "USD",
                "expected_delivery": datetime.now() + timedelta(hours=6),
                "ai_confidence": 92.0,
                "created_at": datetime.now() - timedelta(hours=1),
                "fragile": True,
                "signature_required": True
            },
            {
                "tracking_number": "CP-2024-006",
                "sender_name": "Luxury Goods Co.",
                "sender_company": "Luxury Goods Co.",
                "sender_address": {
                    "street": "999 Premium Ave",
                    "city": "Beverly Hills",
                    "state": "CA",
                    "zip_code": "90210",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0999",
                "sender_email": "vip@luxurygoods.com",
                "receiver_name": "Manhattan Jewelers",
                "receiver_company": "Manhattan Jewelers",
                "receiver_address": {
                    "street": "123 Diamond St",
                    "city": "New York",
                    "state": "NY",
                    "zip_code": "10022",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0123",
                "receiver_email": "secure@manhattanjewelers.com",
                "origin": "Beverly Hills, CA",
                "destination": "New York, NY",
                "status": PackageStatus.DELAYED,
                "priority": PackagePriority.HIGH,
                "weight": 0.5,
                "weight_unit": "kg",
                "value": 15000.00,
                "value_currency": "USD",
                "expected_delivery": datetime.now() + timedelta(hours=3),
                "anomaly_type": "Security Check Required",
                "ai_confidence": 88.0,
                "created_at": datetime.now() - timedelta(hours=2),
                "fragile": True,
                "signature_required": True,
                "insurance_required": True
            },
            
            # MEDIUM PRIORITY PACKAGES
            {
                "tracking_number": "CP-2024-007",
                "sender_name": "AutoParts Direct",
                "sender_company": "AutoParts Direct",
                "sender_address": {
                    "street": "555 Auto Way",
                    "city": "Detroit",
                    "state": "MI",
                    "zip_code": "48201",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0555",
                "sender_email": "shipping@autoparts.com",
                "receiver_name": "Midwest Motors",
                "receiver_company": "Midwest Motors",
                "receiver_address": {
                    "street": "777 Motor Ave",
                    "city": "Chicago",
                    "state": "IL",
                    "zip_code": "60601",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0777",
                "receiver_email": "parts@midwestmotors.com",
                "origin": "Detroit, MI",
                "destination": "Chicago, IL",
                "status": PackageStatus.DELAYED,
                "priority": PackagePriority.MEDIUM,
                "weight": 15.2,
                "weight_unit": "kg",
                "value": 890.00,
                "value_currency": "USD",
                "expected_delivery": datetime.now() + timedelta(hours=2),
                "anomaly_type": "Weather Delay",
                "ai_confidence": 76.0,
                "created_at": datetime.now() - timedelta(hours=6)
            },
            {
                "tracking_number": "CP-2024-008",
                "sender_name": "Office Supplies Pro",
                "sender_company": "Office Supplies Pro",
                "sender_address": {
                    "street": "123 Business Park",
                    "city": "Phoenix",
                    "state": "AZ",
                    "zip_code": "85001",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0123",
                "sender_email": "orders@officesupplies.com",
                "receiver_name": "Corporate Office",
                "receiver_company": "Corporate Office",
                "receiver_address": {
                    "street": "456 Corporate Blvd",
                    "city": "Denver",
                    "state": "CO",
                    "zip_code": "80201",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0456",
                "receiver_email": "receiving@corporate.com",
                "origin": "Phoenix, AZ",
                "destination": "Denver, CO",
                "status": PackageStatus.IN_TRANSIT,
                "priority": PackagePriority.MEDIUM,
                "weight": 8.5,
                "weight_unit": "kg",
                "value": 450.00,
                "value_currency": "USD",
                "expected_delivery": datetime.now() + timedelta(days=1),
                "ai_confidence": 95.0,
                "created_at": datetime.now() - timedelta(hours=3)
            },
            {
                "tracking_number": "CP-2024-009",
                "sender_name": "Home Decor Plus",
                "sender_company": "Home Decor Plus",
                "sender_address": {
                    "street": "789 Design St",
                    "city": "Portland",
                    "state": "OR",
                    "zip_code": "97201",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0789",
                "sender_email": "shipping@homedecor.com",
                "receiver_name": "Interior Design Studio",
                "receiver_company": "Interior Design Studio",
                "receiver_address": {
                    "street": "321 Creative Ave",
                    "city": "San Diego",
                    "state": "CA",
                    "zip_code": "92101",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0321",
                "receiver_email": "receiving@interiorstudio.com",
                "origin": "Portland, OR",
                "destination": "San Diego, CA",
                "status": PackageStatus.INVESTIGATING,
                "priority": PackagePriority.MEDIUM,
                "weight": 12.3,
                "weight_unit": "kg",
                "value": 750.00,
                "value_currency": "USD",
                "expected_delivery": datetime.now() + timedelta(days=2),
                "anomaly_type": "Package Damage Detected",
                "investigation_status": "Quality Control Review",
                "ai_confidence": 82.0,
                "created_at": datetime.now() - timedelta(hours=4),
                "fragile": True
            },
            
            # LOW PRIORITY PACKAGES
            {
                "tracking_number": "CP-2024-010",
                "sender_name": "Bookstore Online",
                "sender_company": "Bookstore Online",
                "sender_address": {
                    "street": "456 Library Lane",
                    "city": "Cambridge",
                    "state": "MA",
                    "zip_code": "02138",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0456",
                "sender_email": "orders@bookstore.com",
                "receiver_name": "John Smith",
                "receiver_company": None,
                "receiver_address": {
                    "street": "789 Residential St",
                    "city": "Providence",
                    "state": "RI",
                    "zip_code": "02901",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0789",
                "receiver_email": "john.smith@email.com",
                "origin": "Cambridge, MA",
                "destination": "Providence, RI",
                "status": PackageStatus.IN_TRANSIT,
                "priority": PackagePriority.LOW,
                "weight": 0.8,
                "weight_unit": "kg",
                "value": 25.99,
                "value_currency": "USD",
                "expected_delivery": datetime.now() + timedelta(days=3),
                "ai_confidence": 98.0,
                "created_at": datetime.now() - timedelta(hours=2)
            },
            {
                "tracking_number": "CP-2024-011",
                "sender_name": "Gift Shop Express",
                "sender_company": "Gift Shop Express",
                "sender_address": {
                    "street": "123 Gift Center",
                    "city": "Orlando",
                    "state": "FL",
                    "zip_code": "32801",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0123",
                "sender_email": "orders@giftshop.com",
                "receiver_name": "Sarah Johnson",
                "receiver_company": None,
                "receiver_address": {
                    "street": "456 Home St",
                    "city": "Tampa",
                    "state": "FL",
                    "zip_code": "33601",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0456",
                "receiver_email": "sarah.johnson@email.com",
                "origin": "Orlando, FL",
                "destination": "Tampa, FL",
                "status": PackageStatus.DELIVERED,
                "priority": PackagePriority.LOW,
                "weight": 1.2,
                "weight_unit": "kg",
                "value": 45.00,
                "value_currency": "USD",
                "expected_delivery": datetime.now() - timedelta(hours=2),
                "actual_delivery": datetime.now() - timedelta(hours=1),
                "ai_confidence": 99.0,
                "created_at": datetime.now() - timedelta(days=1)
            },
            {
                "tracking_number": "CP-2024-012",
                "sender_name": "Pet Supplies Co.",
                "sender_company": "Pet Supplies Co.",
                "sender_address": {
                    "street": "789 Pet Park",
                    "city": "Nashville",
                    "state": "TN",
                    "zip_code": "37201",
                    "country": "USA"
                },
                "sender_phone": "+1-555-0789",
                "sender_email": "orders@petsupplies.com",
                "receiver_name": "Mike Wilson",
                "receiver_company": None,
                "receiver_address": {
                    "street": "321 Dog Lane",
                    "city": "Memphis",
                    "state": "TN",
                    "zip_code": "38101",
                    "country": "USA"
                },
                "receiver_phone": "+1-555-0321",
                "receiver_email": "mike.wilson@email.com",
                "origin": "Nashville, TN",
                "destination": "Memphis, TN",
                "status": PackageStatus.LOST,
                "priority": PackagePriority.LOW,
                "weight": 2.1,
                "weight_unit": "kg",
                "value": 35.50,
                "value_currency": "USD",
                "expected_delivery": datetime.now() - timedelta(days=1),
                "anomaly_type": "Package Lost in Transit",
                "investigation_status": "Search in Progress",
                "ai_confidence": 15.0,
                "created_at": datetime.now() - timedelta(days=2)
            }
        ]
        
        # Create packages
        for package_data in sample_packages:
            # Convert address dictionaries to JSON strings for SQLite
            if 'sender_address' in package_data:
                import json
                package_data['sender_address'] = json.dumps(package_data['sender_address'])
            if 'receiver_address' in package_data:
                package_data['receiver_address'] = json.dumps(package_data['receiver_address'])
            
            package = Package(**package_data)
            db.add(package)
        
        db.commit()
        print("✅ Sample packages created successfully!")
        
        # Create sample tracking events
        packages = db.query(Package).all()
        for package in packages:
            # Create tracking events for each package
            events = [
                {
                    "package_id": package.id,
                    "event_type": "Package Picked Up",
                    "scan_type": ScanType.PICKUP,
                    "timestamp": package.created_at,
                    "location": package.origin,
                    "description": f"Package picked up from {package.origin}",
                    "status": "picked_up"
                },
                {
                    "package_id": package.id,
                    "event_type": "In Transit",
                    "scan_type": ScanType.IN_TRANSIT,
                    "timestamp": package.created_at + timedelta(hours=1),
                    "location": "Sorting Facility",
                    "description": "Package processed at sorting facility",
                    "status": "in_transit"
                }
            ]
            
            if package.status == PackageStatus.DELIVERED:
                events.append({
                    "package_id": package.id,
                    "event_type": "Delivered",
                    "scan_type": ScanType.DELIVERY,
                    "timestamp": package.actual_delivery,
                    "location": package.destination,
                    "description": f"Package delivered to {package.destination}",
                    "status": "delivered"
                })
            
            for event_data in events:
                event = TrackingEvent(**event_data)
                db.add(event)
        
        db.commit()
        print("✅ Sample tracking events created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("🗄️ Database tables created!")
    
    # Create sample data
    create_sample_packages()
    print("🎉 Database seeding completed!")
