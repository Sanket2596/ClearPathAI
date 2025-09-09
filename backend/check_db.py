#!/usr/bin/env python3
"""
Script to check database contents
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.package import Package
from app.models.tracking_event import TrackingEvent

def check_database():
    """Check what's in the database"""
    db = SessionLocal()
    
    try:
        # Count packages
        package_count = db.query(Package).count()
        print(f"Total packages in database: {package_count}")
        
        # Get all packages
        packages = db.query(Package).all()
        for package in packages:
            print(f"Package: {package.tracking_number} - {package.status} - {package.priority}")
            
    except Exception as e:
        print(f"Error checking database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_database()
