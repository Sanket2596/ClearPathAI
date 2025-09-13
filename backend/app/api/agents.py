"""
API endpoints for AI agents
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.services.agent_service import AgentService
from app.agents.investigator_agent import InvestigationType, InvestigationResult
from app.websocket.event_broadcaster import event_broadcaster

router = APIRouter(prefix="/agents", tags=["agents"])

# Pydantic models for API
class AnomalyData(BaseModel):
    anomaly_type: str
    severity: str
    description: str
    current_status: Optional[str] = None
    location: Optional[str] = None
    timestamp: Optional[datetime] = None

class DelayData(BaseModel):
    reason: str
    severity: str
    current_status: str
    delay_duration: str
    affected_route: Optional[str] = None

class RouteOptimizationData(BaseModel):
    current_route: str
    alternative_routes: List[str]
    goals: List[str]
    current_status: str

class PredictiveAnalysisData(BaseModel):
    risk_level: str
    predicted_issues: List[str]
    risk_factors: List[str]
    confidence: float
    current_status: str

class InvestigationResponse(BaseModel):
    investigation_id: str
    package_id: str
    investigation_type: str
    findings: List[str]
    recommendations: List[str]
    confidence_score: float
    priority: str
    estimated_resolution_time: Optional[str]
    next_actions: List[str]
    created_at: datetime

@router.post("/investigate/anomaly/{package_id}")
async def investigate_anomaly(
    package_id: str,
    anomaly_data: AnomalyData,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Investigate a package anomaly using AI agent"""
    try:
        agent_service = AgentService(db)
        
        # Convert Pydantic model to dict
        anomaly_dict = anomaly_data.dict()
        
        # Process investigation in background
        investigation_result = await agent_service.process_anomaly(package_id, anomaly_dict)
        
        return InvestigationResponse(
            investigation_id=investigation_result.investigation_id,
            package_id=investigation_result.package_id,
            investigation_type=investigation_result.investigation_type.value,
            findings=investigation_result.findings,
            recommendations=investigation_result.recommendations,
            confidence_score=investigation_result.confidence_score,
            priority=investigation_result.priority,
            estimated_resolution_time=investigation_result.estimated_resolution_time,
            next_actions=investigation_result.next_actions,
            created_at=investigation_result.created_at
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Investigation failed: {str(e)}")

@router.post("/investigate/delay/{package_id}")
async def investigate_delay(
    package_id: str,
    delay_data: DelayData,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Investigate a package delay using AI agent"""
    try:
        agent_service = AgentService(db)
        
        # Convert Pydantic model to dict
        delay_dict = delay_data.dict()
        
        # Process delay investigation
        investigation_result = await agent_service.process_delay(package_id, delay_dict)
        
        return InvestigationResponse(
            investigation_id=investigation_result.investigation_id,
            package_id=investigation_result.package_id,
            investigation_type=investigation_result.investigation_type.value,
            findings=investigation_result.findings,
            recommendations=investigation_result.recommendations,
            confidence_score=investigation_result.confidence_score,
            priority=investigation_result.priority,
            estimated_resolution_time=investigation_result.estimated_resolution_time,
            next_actions=investigation_result.next_actions,
            created_at=investigation_result.created_at
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delay investigation failed: {str(e)}")

@router.post("/optimize/route/{package_id}")
async def optimize_route(
    package_id: str,
    route_data: RouteOptimizationData,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Optimize package route using AI agent"""
    try:
        agent_service = AgentService(db)
        
        # Convert Pydantic model to dict
        route_dict = route_data.dict()
        
        # Process route optimization
        investigation_result = await agent_service.process_route_optimization(package_id, route_dict)
        
        return InvestigationResponse(
            investigation_id=investigation_result.investigation_id,
            package_id=investigation_result.package_id,
            investigation_type=investigation_result.investigation_type.value,
            findings=investigation_result.findings,
            recommendations=investigation_result.recommendations,
            confidence_score=investigation_result.confidence_score,
            priority=investigation_result.priority,
            estimated_resolution_time=investigation_result.estimated_resolution_time,
            next_actions=investigation_result.next_actions,
            created_at=investigation_result.created_at
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route optimization failed: {str(e)}")

@router.post("/analyze/predictive/{package_id}")
async def analyze_predictive(
    package_id: str,
    prediction_data: PredictiveAnalysisData,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Perform predictive analysis using AI agent"""
    try:
        agent_service = AgentService(db)
        
        # Convert Pydantic model to dict
        prediction_dict = prediction_data.dict()
        
        # Process predictive analysis
        investigation_result = await agent_service.process_predictive_analysis(package_id, prediction_dict)
        
        return InvestigationResponse(
            investigation_id=investigation_result.investigation_id,
            package_id=investigation_result.package_id,
            investigation_type=investigation_result.investigation_type.value,
            findings=investigation_result.findings,
            recommendations=investigation_result.recommendations,
            confidence_score=investigation_result.confidence_score,
            priority=investigation_result.priority,
            estimated_resolution_time=investigation_result.estimated_resolution_time,
            next_actions=investigation_result.next_actions,
            created_at=investigation_result.created_at
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Predictive analysis failed: {str(e)}")

@router.get("/investigations/{package_id}")
async def get_investigation_status(
    package_id: str,
    db: Session = Depends(get_db)
):
    """Get investigation status for a package"""
    try:
        agent_service = AgentService(db)
        investigation = agent_service.get_investigation_status(package_id)
        
        if not investigation:
            raise HTTPException(status_code=404, detail="No investigation found for this package")
        
        return InvestigationResponse(
            investigation_id=investigation.investigation_id,
            package_id=investigation.package_id,
            investigation_type=investigation.investigation_type.value,
            findings=investigation.findings,
            recommendations=investigation.recommendations,
            confidence_score=investigation.confidence_score,
            priority=investigation.priority,
            estimated_resolution_time=investigation.estimated_resolution_time,
            next_actions=investigation.next_actions,
            created_at=investigation.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get investigation status: {str(e)}")

@router.get("/investigations")
async def get_all_investigations(
    priority: Optional[str] = None,
    investigation_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all investigations with optional filtering"""
    try:
        agent_service = AgentService(db)
        
        if priority:
            investigations = agent_service.get_investigations_by_priority(priority)
        elif investigation_type:
            try:
                inv_type = InvestigationType(investigation_type)
                investigations = agent_service.get_investigations_by_type(inv_type)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid investigation type")
        else:
            investigations = agent_service.get_all_investigations()
        
        return [
            InvestigationResponse(
                investigation_id=inv.investigation_id,
                package_id=inv.package_id,
                investigation_type=inv.investigation_type.value,
                findings=inv.findings,
                recommendations=inv.recommendations,
                confidence_score=inv.confidence_score,
                priority=inv.priority,
                estimated_resolution_time=inv.estimated_resolution_time,
                next_actions=inv.next_actions,
                created_at=inv.created_at
            )
            for inv in investigations
        ]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get investigations: {str(e)}")

@router.get("/analytics")
async def get_agent_analytics(db: Session = Depends(get_db)):
    """Get agent performance analytics"""
    try:
        agent_service = AgentService(db)
        analytics = await agent_service.get_agent_analytics()
        return analytics
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}")

@router.post("/cleanup")
async def cleanup_old_investigations(
    hours: int = 24,
    db: Session = Depends(get_db)
):
    """Clean up old investigations"""
    try:
        agent_service = AgentService(db)
        await agent_service.cleanup_old_investigations(hours)
        return {"message": f"Cleaned up investigations older than {hours} hours"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")

@router.get("/health")
async def agent_health_check(db: Session = Depends(get_db)):
    """Health check for agent service"""
    try:
        agent_service = AgentService(db)
        analytics = await agent_service.get_agent_analytics()
        
        return {
            "status": "healthy",
            "active_investigations": analytics.get("active_investigations", 0),
            "total_investigations": analytics.get("total_investigations", 0),
            "average_confidence": analytics.get("average_confidence", 0.0)
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }
