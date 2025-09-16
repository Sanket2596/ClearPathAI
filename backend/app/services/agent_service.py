"""
Agent Service for managing AI agents and their operations
Now uses the AI Agent Service microservice
"""

import httpx
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

class AgentService:
    """Service for managing AI agents via microservice"""
    
    def __init__(self, db: Session):
        self.db = db
        self.ai_service_url = "http://ai-agent-service:8002"
        self.timeout = 30.0
        self.active_investigations: Dict[str, Dict[str, Any]] = {}
    
    async def _call_ai_service(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Make HTTP call to AI Agent Service"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.ai_service_url}{endpoint}",
                    json=data,
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error calling AI service: {e}")
            raise Exception(f"AI service unavailable: {str(e)}")
        except Exception as e:
            logger.error(f"Error calling AI service: {e}")
            raise Exception(f"Failed to call AI service: {str(e)}")
    
    async def process_anomaly(self, package_id: str, anomaly_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a package anomaly using the AI Agent Service"""
        
        try:
            # Call AI Agent Service
            result = await self._call_ai_service(
                f"/api/v1/agents/investigate/anomaly/{package_id}",
                anomaly_data
            )
            
            # Store investigation result locally for caching
            self.active_investigations[package_id] = result
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing anomaly for package {package_id}: {str(e)}")
            
            # Return error result
            error_result = {
                "investigation_id": f"error_{package_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "package_id": package_id,
                "investigation_type": "anomaly_analysis",
                "findings": [f"Investigation failed: {str(e)}"],
                "recommendations": ["Manual investigation required"],
                "confidence_score": 0.0,
                "priority": "high",
                "estimated_resolution_time": "Unknown",
                "next_actions": ["Escalate to human investigator"],
                "created_at": datetime.utcnow().isoformat()
            }
            
            return error_result
    
    async def process_delay(self, package_id: str, delay_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a package delay using the AI Agent Service"""
        
        try:
            # Call AI Agent Service
            result = await self._call_ai_service(
                f"/api/v1/agents/investigate/delay/{package_id}",
                delay_data
            )
            
            # Store investigation result locally for caching
            self.active_investigations[package_id] = result
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing delay for package {package_id}: {str(e)}")
            
            # Return error result
            error_result = {
                "investigation_id": f"error_{package_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "package_id": package_id,
                "investigation_type": "delay_investigation",
                "findings": [f"Investigation failed: {str(e)}"],
                "recommendations": ["Manual investigation required"],
                "confidence_score": 0.0,
                "priority": "high",
                "estimated_resolution_time": "Unknown",
                "next_actions": ["Escalate to human investigator"],
                "created_at": datetime.utcnow().isoformat()
            }
            
            return error_result
    
    async def process_route_optimization(self, package_id: str, route_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process route optimization using the AI Agent Service"""
        
        try:
            # Call AI Agent Service
            result = await self._call_ai_service(
                f"/api/v1/agents/optimize/route/{package_id}",
                route_data
            )
            
            # Store investigation result locally for caching
            self.active_investigations[package_id] = result
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing route optimization for package {package_id}: {str(e)}")
            
            # Return error result
            error_result = {
                "investigation_id": f"error_{package_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "package_id": package_id,
                "investigation_type": "route_optimization",
                "findings": [f"Investigation failed: {str(e)}"],
                "recommendations": ["Manual investigation required"],
                "confidence_score": 0.0,
                "priority": "high",
                "estimated_resolution_time": "Unknown",
                "next_actions": ["Escalate to human investigator"],
                "created_at": datetime.utcnow().isoformat()
            }
            
            return error_result
    
    async def process_predictive_analysis(self, package_id: str, prediction_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process predictive analysis using the AI Agent Service"""
        
        try:
            # Call AI Agent Service
            result = await self._call_ai_service(
                f"/api/v1/agents/analyze/predictive/{package_id}",
                prediction_data
            )
            
            # Store investigation result locally for caching
            self.active_investigations[package_id] = result
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing predictive analysis for package {package_id}: {str(e)}")
            
            # Return error result
            error_result = {
                "investigation_id": f"error_{package_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "package_id": package_id,
                "investigation_type": "predictive_analysis",
                "findings": [f"Investigation failed: {str(e)}"],
                "recommendations": ["Manual investigation required"],
                "confidence_score": 0.0,
                "priority": "high",
                "estimated_resolution_time": "Unknown",
                "next_actions": ["Escalate to human investigator"],
                "created_at": datetime.utcnow().isoformat()
            }
            
            return error_result
    
    def get_investigation_status(self, package_id: str) -> Optional[Dict[str, Any]]:
        """Get investigation status for a package"""
        return self.active_investigations.get(package_id)
    
    def get_all_investigations(self) -> List[Dict[str, Any]]:
        """Get all active investigations"""
        return list(self.active_investigations.values())
    
    def get_investigations_by_priority(self, priority: str) -> List[Dict[str, Any]]:
        """Get investigations by priority level"""
        return [
            inv for inv in self.active_investigations.values()
            if inv.get("priority") == priority
        ]
    
    def get_investigations_by_type(self, investigation_type: str) -> List[Dict[str, Any]]:
        """Get investigations by type"""
        return [
            inv for inv in self.active_investigations.values()
            if inv.get("investigation_type") == investigation_type
        ]
    
    async def cleanup_old_investigations(self, hours: int = 24):
        """Clean up investigations older than specified hours"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        to_remove = []
        for package_id, investigation in self.active_investigations.items():
            if datetime.fromisoformat(investigation.get("created_at", "1970-01-01T00:00:00")) < cutoff_time:
                to_remove.append(package_id)
        
        for package_id in to_remove:
            del self.active_investigations[package_id]
        
        logger.info(f"Cleaned up {len(to_remove)} old investigations")
    
    async def get_agent_analytics(self) -> Dict[str, Any]:
        """Get analytics about agent performance"""
        investigations = list(self.active_investigations.values())
        
        if not investigations:
            return {
                "total_investigations": 0,
                "average_confidence": 0.0,
                "priority_distribution": {},
                "type_distribution": {},
                "average_resolution_time": "N/A"
            }
        
        # Calculate analytics
        total_investigations = len(investigations)
        average_confidence = sum(inv.get("confidence_score", 0) for inv in investigations) / total_investigations
        
        # Priority distribution
        priority_distribution = {}
        for inv in investigations:
            priority = inv.get("priority", "unknown")
            priority_distribution[priority] = priority_distribution.get(priority, 0) + 1
        
        # Type distribution
        type_distribution = {}
        for inv in investigations:
            inv_type = inv.get("investigation_type", "unknown")
            type_distribution[inv_type] = type_distribution.get(inv_type, 0) + 1
        
        return {
            "total_investigations": total_investigations,
            "average_confidence": round(average_confidence, 2),
            "priority_distribution": priority_distribution,
            "type_distribution": type_distribution,
            "active_investigations": len([inv for inv in investigations if datetime.fromisoformat(inv.get("created_at", "1970-01-01T00:00:00")) > datetime.utcnow() - timedelta(hours=1)])
        }