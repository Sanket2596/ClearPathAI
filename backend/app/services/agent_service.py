"""
Agent Service for managing AI agents and their operations
"""

import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.agents.investigator_agent import (
    InvestigatorAgent, 
    InvestigationResult, 
    InvestigationType,
    get_investigator_agent
)
from app.websocket.event_broadcaster import event_broadcaster
from app.models.package import Package, PackageStatus
from app.models.tracking_event import TrackingEvent

class AgentService:
    """Service for managing AI agents"""
    
    def __init__(self, db: Session):
        self.db = db
        self.investigator_agent = get_investigator_agent(db)
        self.active_investigations: Dict[str, InvestigationResult] = {}
    
    async def process_anomaly(self, package_id: str, anomaly_data: Dict[str, Any]) -> InvestigationResult:
        """Process a package anomaly using the investigator agent"""
        
        try:
            # Check if package exists
            package = self.db.query(Package).filter(Package.id == package_id).first()
            if not package:
                raise ValueError(f"Package {package_id} not found")
            
            # Broadcast that investigation has started
            await event_broadcaster.broadcast_notification(
                notification_id=f"investigation_start_{package_id}",
                title="Investigation Started",
                message=f"AI Investigator is analyzing package {package.tracking_number}",
                priority="normal",
                category="investigation"
            )
            
            # Start investigation
            investigation_result = await self.investigator_agent.investigate_anomaly(
                package_id=package_id,
                anomaly_data=anomaly_data
            )
            
            # Store investigation result
            self.active_investigations[package_id] = investigation_result
            
            # Log investigation
            self._log_investigation(investigation_result)
            
            return investigation_result
            
        except Exception as e:
            print(f"Error processing anomaly for package {package_id}: {str(e)}")
            
            # Create error result
            error_result = InvestigationResult(
                investigation_id=f"error_{package_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                package_id=package_id,
                investigation_type=InvestigationType.ANOMALY_ANALYSIS,
                findings=[f"Investigation failed: {str(e)}"],
                recommendations=["Manual investigation required"],
                confidence_score=0.0,
                priority="high",
                estimated_resolution_time="Unknown",
                next_actions=["Escalate to human investigator"],
                created_at=datetime.utcnow()
            )
            
            return error_result
    
    async def process_delay(self, package_id: str, delay_data: Dict[str, Any]) -> InvestigationResult:
        """Process a package delay using the investigator agent"""
        
        # Convert delay to anomaly format for investigation
        anomaly_data = {
            "anomaly_type": "delayed_delivery",
            "severity": delay_data.get("severity", "medium"),
            "description": f"Package delayed: {delay_data.get('reason', 'Unknown reason')}",
            "current_status": delay_data.get("current_status", "delayed"),
            "delay_duration": delay_data.get("delay_duration", "Unknown"),
            "affected_route": delay_data.get("affected_route", "Unknown")
        }
        
        return await self.process_anomaly(package_id, anomaly_data)
    
    async def process_route_optimization(self, package_id: str, route_data: Dict[str, Any]) -> InvestigationResult:
        """Process route optimization using the investigator agent"""
        
        # Convert route data to investigation format
        anomaly_data = {
            "anomaly_type": "route_optimization",
            "severity": "low",
            "description": f"Route optimization analysis for package {package_id}",
            "current_status": route_data.get("current_status", "in_transit"),
            "current_route": route_data.get("current_route", "Unknown"),
            "alternative_routes": route_data.get("alternative_routes", []),
            "optimization_goals": route_data.get("goals", ["reduce_delivery_time", "minimize_cost"])
        }
        
        return await self.process_anomaly(package_id, anomaly_data)
    
    async def process_predictive_analysis(self, package_id: str, prediction_data: Dict[str, Any]) -> InvestigationResult:
        """Process predictive analysis using the investigator agent"""
        
        # Convert prediction data to investigation format
        anomaly_data = {
            "anomaly_type": "predictive_analysis",
            "severity": prediction_data.get("risk_level", "low"),
            "description": f"Predictive analysis for package {package_id}",
            "current_status": prediction_data.get("current_status", "in_transit"),
            "predicted_issues": prediction_data.get("predicted_issues", []),
            "risk_factors": prediction_data.get("risk_factors", []),
            "confidence": prediction_data.get("confidence", 0.5)
        }
        
        return await self.process_anomaly(package_id, anomaly_data)
    
    def get_investigation_status(self, package_id: str) -> Optional[InvestigationResult]:
        """Get investigation status for a package"""
        return self.active_investigations.get(package_id)
    
    def get_all_investigations(self) -> List[InvestigationResult]:
        """Get all active investigations"""
        return list(self.active_investigations.values())
    
    def get_investigations_by_priority(self, priority: str) -> List[InvestigationResult]:
        """Get investigations by priority level"""
        return [
            inv for inv in self.active_investigations.values()
            if inv.priority == priority
        ]
    
    def get_investigations_by_type(self, investigation_type: InvestigationType) -> List[InvestigationResult]:
        """Get investigations by type"""
        return [
            inv for inv in self.active_investigations.values()
            if inv.investigation_type == investigation_type
        ]
    
    def _log_investigation(self, investigation_result: InvestigationResult):
        """Log investigation result"""
        print(f"""
Investigation Complete:
- ID: {investigation_result.investigation_id}
- Package: {investigation_result.package_id}
- Type: {investigation_result.investigation_type.value}
- Priority: {investigation_result.priority}
- Confidence: {investigation_result.confidence_score}
- Findings: {len(investigation_result.findings)} items
- Recommendations: {len(investigation_result.recommendations)} items
- Resolution Time: {investigation_result.estimated_resolution_time}
""")
    
    async def cleanup_old_investigations(self, hours: int = 24):
        """Clean up investigations older than specified hours"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        to_remove = []
        for package_id, investigation in self.active_investigations.items():
            if investigation.created_at < cutoff_time:
                to_remove.append(package_id)
        
        for package_id in to_remove:
            del self.active_investigations[package_id]
        
        print(f"Cleaned up {len(to_remove)} old investigations")
    
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
        average_confidence = sum(inv.confidence_score for inv in investigations) / total_investigations
        
        # Priority distribution
        priority_distribution = {}
        for inv in investigations:
            priority_distribution[inv.priority] = priority_distribution.get(inv.priority, 0) + 1
        
        # Type distribution
        type_distribution = {}
        for inv in investigations:
            type_name = inv.investigation_type.value
            type_distribution[type_name] = type_distribution.get(type_name, 0) + 1
        
        return {
            "total_investigations": total_investigations,
            "average_confidence": round(average_confidence, 2),
            "priority_distribution": priority_distribution,
            "type_distribution": type_distribution,
            "active_investigations": len([inv for inv in investigations if inv.created_at > datetime.utcnow() - timedelta(hours=1)])
        }
