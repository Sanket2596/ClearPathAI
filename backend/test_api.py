#!/usr/bin/env python3
"""
Simple test script to verify the API is working
"""
import requests
import json

def test_api():
    base_url = "http://localhost:8000"
    
    print("🧪 Testing ClearPath AI Backend API...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Root endpoint: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health endpoint: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Health endpoint failed: {e}")
    
    # Test packages endpoint
    try:
        response = requests.get(f"{base_url}/api/v1/packages")
        print(f"✅ Packages endpoint: {response.status_code}")
        data = response.json()
        print(f"   Total packages: {data.get('total', 0)}")
        print(f"   Packages returned: {len(data.get('packages', []))}")
    except Exception as e:
        print(f"❌ Packages endpoint failed: {e}")
    
    # Test package stats endpoint
    try:
        response = requests.get(f"{base_url}/api/v1/packages/stats")
        print(f"✅ Package stats endpoint: {response.status_code}")
        stats = response.json()
        print(f"   Total packages: {stats.get('total_packages', 0)}")
        print(f"   In transit: {stats.get('in_transit', 0)}")
        print(f"   Delivered: {stats.get('delivered', 0)}")
    except Exception as e:
        print(f"❌ Package stats endpoint failed: {e}")
    
    print("\n🎉 API testing completed!")

if __name__ == "__main__":
    test_api()
