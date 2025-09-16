from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum
from uuid import UUID

class WebSocketMessageType(str, Enum):
    """Types of WebSocket messages"""
    PACKAGE_UPDATE = "package_update"
    ANOMALY_DETECTED = "anomaly_detected"
    RECOVERY_SUGGESTION = "recovery_suggestion"
    DASHBOARD_METRICS = "dashboard_metrics"
    AGENT_ACTIVITY = "agent_activity"
    NOTIFICATION = "notification"
    MAP_UPDATE = "map_update"
    SYSTEM_HEALTH = "system_health"
    PING = "ping"
    PONG = "pong"
    ERROR = "error"
    SUCCESS = "success"

class WebSocketMessage(BaseModel):
    """Base WebSocket message structure"""
    type: WebSocketMessageType
    data: Dict[str, Any]
    timestamp: datetime
    message_id: Optional[str] = None

class PackageUpdateData(BaseModel):
    """Package update message data"""
    package_id: str
    tracking_number: str
    status: str
    location: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    last_scan_time: Optional[datetime] = None
    carrier: Optional[str] = None

class AnomalyData(BaseModel):
    """Anomaly detection message data"""
    package_id: str
    anomaly_type: str
    severity: str
    description: str
    recommended_action: Optional[str] = None
    confidence_score: Optional[float] = None
    detected_at: datetime

class RecoverySuggestionData(BaseModel):
    """Recovery suggestion message data"""
    package_id: str
    issue: str
    ai_suggestion: Dict[str, Any]
    confidence: float
    alternatives: Optional[List[Dict[str, Any]]] = None

class DashboardMetricsData(BaseModel):
    """Dashboard metrics message data"""
    total_packages: int
    in_transit: int
    delivered: int
    delayed: int
    anomalies: int
    recovery_rate: float
    avg_delivery_time: Optional[float] = None

class AgentActivityData(BaseModel):
    """Agent activity message data"""
    agent_id: str
    action: str
    package_id: Optional[str] = None
    location: Optional[str] = None
    status: str
    performance_metrics: Optional[Dict[str, Any]] = None

class NotificationData(BaseModel):
    """Notification message data"""
    id: str
    title: str
    message: str
    priority: str
    category: str
    read: bool = False
    user_id: Optional[str] = None

class MapUpdateData(BaseModel):
    """Map update message data"""
    package_id: str
    coordinates: Dict[str, float]  # {"lat": 41.8781, "lng": -87.6298}
    status: str
    route: Optional[List[Dict[str, float]]] = None
    speed: Optional[float] = None
    heading: Optional[float] = None

class SystemHealthData(BaseModel):
    """System health message data"""
    component: str
    status: str
    performance: Dict[str, Any]
    last_check: datetime

class WebSocketConnectionInfo(BaseModel):
    """WebSocket connection information"""
    connection_id: str
    user_id: Optional[str] = None
    connected_at: datetime
    last_activity: datetime
    subscriptions: List[str] = []  # What the client is subscribed to

class WebSocketError(BaseModel):
    """WebSocket error message"""
    error_code: str
    error_message: str
    details: Optional[Dict[str, Any]] = None
