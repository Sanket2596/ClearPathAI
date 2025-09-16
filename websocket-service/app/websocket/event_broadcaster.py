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

logger = logging.getLogger(__name__)

class WebSocketEventBroadcaster:
    """Handles broadcasting of various events through WebSocket connections"""
    
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

# Global event broadcaster instance
event_broadcaster = WebSocketEventBroadcaster()
