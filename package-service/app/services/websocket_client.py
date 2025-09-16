"""
WebSocket Service Client for inter-service communication
"""

import httpx
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class WebSocketServiceClient:
    """Client for communicating with WebSocket Service"""
    
    def __init__(self):
        self.base_url = "http://websocket-service:8003"
        self.timeout = 10.0
    
    async def broadcast_package_update(
        self, 
        package_id: str, 
        tracking_number: str, 
        status: str,
        location: Optional[str] = None,
        estimated_delivery: Optional[str] = None,
        carrier: Optional[str] = None
    ):
        """Broadcast package update via WebSocket"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/ws/broadcast/package-update",
                    json={
                        "package_id": package_id,
                        "tracking_number": tracking_number,
                        "status": status,
                        "location": location,
                        "estimated_delivery": estimated_delivery,
                        "carrier": carrier
                    },
                    timeout=self.timeout
                )
                response.raise_for_status()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error calling WebSocket service: {e}")
        except Exception as e:
            logger.error(f"Error calling WebSocket service: {e}")
    
    async def broadcast_notification(
        self,
        notification_id: str,
        title: str,
        message: str,
        priority: str = "normal",
        category: str = "general",
        user_id: Optional[str] = None
    ):
        """Broadcast notification via WebSocket"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/ws/broadcast/notification",
                    json={
                        "notification_id": notification_id,
                        "title": title,
                        "message": message,
                        "priority": priority,
                        "category": category,
                        "user_id": user_id
                    },
                    timeout=self.timeout
                )
                response.raise_for_status()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error calling WebSocket service: {e}")
        except Exception as e:
            logger.error(f"Error calling WebSocket service: {e}")

# Global WebSocket service client instance
websocket_service_client = WebSocketServiceClient()
