#!/usr/bin/env python3
"""
Script to check tracking events in the database
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.package import Package
from app.models.tracking_event import TrackingEvent

def check_tracking_events():
    """Check tracking events in the database"""
    db = SessionLocal()
    
    try:
        # Get all packages with their IDs
        packages = db.query(Package).all()
        print(f"Total packages: {len(packages)}")
        
        for package in packages:
            print(f"Package ID: {package.id}, Tracking: {package.tracking_number}")
        
        # Get all tracking events
        events = db.query(TrackingEvent).all()
        print(f"\nTotal tracking events: {len(events)}")
        
        for event in events:
            print(f"Event ID: {event.id}, Package ID: {event.package_id}, Type: {event.event_type}")
            
    except Exception as e:
        print(f"Error checking tracking events: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_tracking_events()
