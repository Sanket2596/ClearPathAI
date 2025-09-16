"""
AI Service Client for inter-service communication
"""

import httpx
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class AIServiceClient:
    """Client for communicating with AI Agent Service"""
    
    def __init__(self):
        self.base_url = "http://ai-agent-service:8002"
        self.timeout = 30.0
    
    async def investigate_anomaly(self, package_id: str, anomaly_data: Dict[str, Any]) -> Dict[str, Any]:
        """Investigate a package anomaly using AI agent"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/agents/investigate/anomaly/{package_id}",
                    json=anomaly_data,
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error calling AI service: {e}")
            raise Exception(f"AI service unavailable: {str(e)}")
        except Exception as e:
            logger.error(f"Error calling AI service: {e}")
            raise Exception(f"Failed to investigate anomaly: {str(e)}")
    
    async def investigate_delay(self, package_id: str, delay_data: Dict[str, Any]) -> Dict[str, Any]:
        """Investigate a package delay using AI agent"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/agents/investigate/delay/{package_id}",
                    json=delay_data,
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error calling AI service: {e}")
            raise Exception(f"AI service unavailable: {str(e)}")
        except Exception as e:
            logger.error(f"Error calling AI service: {e}")
            raise Exception(f"Failed to investigate delay: {str(e)}")
    
    async def optimize_route(self, package_id: str, route_data: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize package route using AI agent"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/agents/optimize/route/{package_id}",
                    json=route_data,
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error calling AI service: {e}")
            raise Exception(f"AI service unavailable: {str(e)}")
        except Exception as e:
            logger.error(f"Error calling AI service: {e}")
            raise Exception(f"Failed to optimize route: {str(e)}")
    
    async def get_investigation_status(self, package_id: str) -> Optional[Dict[str, Any]]:
        """Get investigation status for a package"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/api/v1/agents/investigations/{package_id}",
                    timeout=self.timeout
                )
                if response.status_code == 404:
                    return None
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error calling AI service: {e}")
            return None
        except Exception as e:
            logger.error(f"Error calling AI service: {e}")
            return None

# Global AI service client instance
ai_service_client = AIServiceClient()
