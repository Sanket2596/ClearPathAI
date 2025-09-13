import asyncio
from typing import Optional, Dict, Any
from datetime import datetime
import logging

from app.websocket.connection_manager import connection_manager
from app.schemas.websocket import (
    WebSocketMessage, 
    WebSocketMessageType,
    PackageUpdateData,
    AnomalyData,
    RecoverySuggestionData,
    DashboardMetricsData,
    AgentActivityData,
    NotificationData,
    MapUpdateData,
    SystemHealthData
)
from app.services.agent_service import AgentService

logger = logging.getLogger(__name__)

class WebSocketEventBroadcaster:
    """Handles broadcasting of various events through WebSocket connections"""
    # Publisher of the events/ messages for our pubsub system
    
    def __init__(self):
        self.connection_manager = connection_manager
    
    async def broadcast_package_update(
        self, 
        package_id: str, 
        tracking_number: str, 
        status: str,
        location: Optional[str] = None,
        estimated_delivery: Optional[datetime] = None,
        last_scan_time: Optional[datetime] = None,
        carrier: Optional[str] = None
    ):
        """Broadcast package status update"""
        try:
            package_data = PackageUpdateData(
                package_id=package_id,
                tracking_number=tracking_number,
                status=status,
                location=location,
                estimated_delivery=estimated_delivery,
                last_scan_time=last_scan_time,
                carrier=carrier
            )
            
            message = WebSocketMessage(
                type=WebSocketMessageType.PACKAGE_UPDATE,
                data=package_data.model_dump(),
                timestamp=datetime.utcnow()
            )
            
            await self.connection_manager.broadcast_message(
                message, 
                subscription_type="package_updates"
            )
            
            logger.info(f"Broadcasted package update for {package_id}: {status}")
            
        except Exception as e:
            logger.error(f"Error broadcasting package update: {e}")
    
    async def broadcast_anomaly_detected(
        self,
        package_id: str,
        anomaly_type: str,
        severity: str,
        description: str,
        recommended_action: Optional[str] = None,
        confidence_score: Optional[float] = None
    ):
        """Broadcast anomaly detection alert"""
        try:
            anomaly_data = AnomalyData(
                package_id=package_id,
                anomaly_type=anomaly_type,
                severity=severity,
                description=description,
                recommended_action=recommended_action,
                confidence_score=confidence_score,
                detected_at=datetime.utcnow()
            )
            
            message = WebSocketMessage(
                type=WebSocketMessageType.ANOMALY_DETECTED,
                data=anomaly_data.model_dump(),
                timestamp=datetime.utcnow()
            )
            
            await self.connection_manager.broadcast_message(
                message,
                subscription_type="anomalies"
            )
            
            logger.info(f"Broadcasted anomaly alert for {package_id}: {anomaly_type}")
            
        except Exception as e:
            logger.error(f"Error broadcasting anomaly alert: {e}")
    
    async def broadcast_recovery_suggestion(
        self,
        package_id: str,
        issue: str,
        ai_suggestion: Dict[str, Any],
        confidence: float,
        alternatives: Optional[list] = None
    ):
        """Broadcast AI recovery suggestion"""
        try:
            recovery_data = RecoverySuggestionData(
                package_id=package_id,
                issue=issue,
                ai_suggestion=ai_suggestion,
                confidence=confidence,
                alternatives=alternatives
            )
            
            message = WebSocketMessage(
                type=WebSocketMessageType.RECOVERY_SUGGESTION,
                data=recovery_data.model_dump(),
                timestamp=datetime.utcnow()
            )
            
            await self.connection_manager.broadcast_message(
                message,
                subscription_type="recovery_suggestions"
            )
            
            logger.info(f"Broadcasted recovery suggestion for {package_id}")
            
        except Exception as e:
            logger.error(f"Error broadcasting recovery suggestion: {e}")
    
    async def broadcast_dashboard_metrics(
        self,
        total_packages: int,
        in_transit: int,
        delivered: int,
        delayed: int,
        anomalies: int,
        recovery_rate: float,
        avg_delivery_time: Optional[float] = None
    ):
        """Broadcast dashboard metrics update"""
        try:
            metrics_data = DashboardMetricsData(
                total_packages=total_packages,
                in_transit=in_transit,
                delivered=delivered,
                delayed=delayed,
                anomalies=anomalies,
                recovery_rate=recovery_rate,
                avg_delivery_time=avg_delivery_time
            )
            
            message = WebSocketMessage(
                type=WebSocketMessageType.DASHBOARD_METRICS,
                data=metrics_data.model_dump(),
                timestamp=datetime.utcnow()
            )
            
            await self.connection_manager.broadcast_message(
                message,
                subscription_type="dashboard_metrics"
            )
            
            logger.info("Broadcasted dashboard metrics update")
            
        except Exception as e:
            logger.error(f"Error broadcasting dashboard metrics: {e}")
    
    async def broadcast_agent_activity(
        self,
        agent_id: str,
        action: str,
        package_id: Optional[str] = None,
        location: Optional[str] = None,
        status: str = "active",
        performance_metrics: Optional[Dict[str, Any]] = None
    ):
        """Broadcast agent activity update"""
        try:
            activity_data = AgentActivityData(
                agent_id=agent_id,
                action=action,
                package_id=package_id,
                location=location,
                status=status,
                performance_metrics=performance_metrics
            )
            
            message = WebSocketMessage(
                type=WebSocketMessageType.AGENT_ACTIVITY,
                data=activity_data.model_dump(),
                timestamp=datetime.utcnow()
            )
            
            await self.connection_manager.broadcast_message(
                message,
                subscription_type="agent_activity"
            )
            
            logger.info(f"Broadcasted agent activity: {agent_id} - {action}")
            
        except Exception as e:
            logger.error(f"Error broadcasting agent activity: {e}")
    
    async def broadcast_notification(
        self,
        notification_id: str,
        title: str,
        message: str,
        priority: str = "normal",
        category: str = "general",
        user_id: Optional[str] = None
    ):
        """Broadcast notification"""
        try:
            notification_data = NotificationData(
                id=notification_id,
                title=title,
                message=message,
                priority=priority,
                category=category,
                user_id=user_id
            )
            
            ws_message = WebSocketMessage(
                type=WebSocketMessageType.NOTIFICATION,
                data=notification_data.model_dump(),
                timestamp=datetime.utcnow()
            )
            
            if user_id:
                # Send to specific user
                await self.connection_manager.broadcast_to_user(user_id, ws_message)
            else:
                # Broadcast to all
                await self.connection_manager.broadcast_message(
                    ws_message,
                    subscription_type="notifications"
                )
            
            logger.info(f"Broadcasted notification: {title}")
            
        except Exception as e:
            logger.error(f"Error broadcasting notification: {e}")
    
    async def broadcast_map_update(
        self,
        package_id: str,
        coordinates: Dict[str, float],
        status: str,
        route: Optional[list] = None,
        speed: Optional[float] = None,
        heading: Optional[float] = None
    ):
        """Broadcast map location update"""
        try:
            map_data = MapUpdateData(
                package_id=package_id,
                coordinates=coordinates,
                status=status,
                route=route,
                speed=speed,
                heading=heading
            )
            
            message = WebSocketMessage(
                type=WebSocketMessageType.MAP_UPDATE,
                data=map_data.model_dump(),
                timestamp=datetime.utcnow()
            )
            
            await self.connection_manager.broadcast_message(
                message,
                subscription_type="map_updates"
            )
            
            logger.info(f"Broadcasted map update for {package_id}")
            
        except Exception as e:
            logger.error(f"Error broadcasting map update: {e}")
    
    async def broadcast_system_health(
        self,
        component: str,
        status: str,
        performance: Dict[str, Any]
    ):
        """Broadcast system health update"""
        try:
            health_data = SystemHealthData(
                component=component,
                status=status,
                performance=performance,
                last_check=datetime.utcnow()
            )
            
            message = WebSocketMessage(
                type=WebSocketMessageType.SYSTEM_HEALTH,
                data=health_data.model_dump(),
                timestamp=datetime.utcnow()
            )
            
            await self.connection_manager.broadcast_message(
                message,
                subscription_type="system_health"
            )
            
            logger.info(f"Broadcasted system health for {component}: {status}")
            
        except Exception as e:
            logger.error(f"Error broadcasting system health: {e}")
    
    async def broadcast_agent_investigation_started(
        self,
        package_id: str,
        investigation_type: str,
        agent_id: str = "investigator_agent"
    ):
        """Broadcast that an AI agent has started an investigation"""
        try:
            activity_data = AgentActivityData(
                agent_id=agent_id,
                action="investigation_started",
                package_id=package_id,
                status="active",
                performance_metrics={
                    "investigation_type": investigation_type,
                    "started_at": datetime.utcnow().isoformat()
                }
            )
            
            message = WebSocketMessage(
                type=WebSocketMessageType.AGENT_ACTIVITY,
                data=activity_data.model_dump(),
                timestamp=datetime.utcnow()
            )
            
            await self.connection_manager.broadcast_message(
                message,
                subscription_type="agent_activity"
            )
            
            logger.info(f"Broadcasted agent investigation started for {package_id}")
            
        except Exception as e:
            logger.error(f"Error broadcasting agent investigation started: {e}")
    
    async def broadcast_agent_investigation_completed(
        self,
        package_id: str,
        investigation_id: str,
        findings: list,
        recommendations: list,
        confidence_score: float,
        agent_id: str = "investigator_agent"
    ):
        """Broadcast that an AI agent has completed an investigation"""
        try:
            activity_data = AgentActivityData(
                agent_id=agent_id,
                action="investigation_completed",
                package_id=package_id,
                status="completed",
                performance_metrics={
                    "investigation_id": investigation_id,
                    "findings_count": len(findings),
                    "recommendations_count": len(recommendations),
                    "confidence_score": confidence_score,
                    "completed_at": datetime.utcnow().isoformat()
                }
            )
            
            message = WebSocketMessage(
                type=WebSocketMessageType.AGENT_ACTIVITY,
                data=activity_data.model_dump(),
                timestamp=datetime.utcnow()
            )
            
            await self.connection_manager.broadcast_message(
                message,
                subscription_type="agent_activity"
            )
            
            # Also broadcast as recovery suggestion
            await self.broadcast_recovery_suggestion(
                package_id=package_id,
                issue=f"AI Investigation Complete",
                ai_suggestion={
                    "investigation_id": investigation_id,
                    "findings": findings,
                    "recommendations": recommendations,
                    "confidence": confidence_score,
                    "agent_id": agent_id
                },
                confidence=confidence_score
            )
            
            logger.info(f"Broadcasted agent investigation completed for {package_id}")
            
        except Exception as e:
            logger.error(f"Error broadcasting agent investigation completed: {e}")

# Global event broadcaster instance
event_broadcaster = WebSocketEventBroadcaster()
