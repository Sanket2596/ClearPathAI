from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Header
from fastapi.security import HTTPBearer
import json
import logging
from typing import Optional
from datetime import datetime

from app.websocket.connection_manager import connection_manager
from app.websocket.event_broadcaster import event_broadcaster
from app.schemas.websocket import WebSocketMessage, WebSocketMessageType

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ws", tags=["websocket"])

# Security scheme for WebSocket authentication (optional)
security = HTTPBearer(auto_error=False)

async def get_current_user_id(token: Optional[str] = Depends(security)) -> Optional[str]:
    """Extract user ID from token (implement your auth logic here)"""
    # This is a placeholder - implement your actual authentication logic
    # For now, we'll just return None (anonymous connections)
    return None

@router.websocket("/connect")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: Optional[str] = Depends(get_current_user_id)
):
    """Main WebSocket endpoint for real-time communication"""
    connection_id = await connection_manager.connect(websocket, user_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            
            try:
                message_data = json.loads(data)
                await connection_manager.handle_client_message(connection_id, message_data)
            except json.JSONDecodeError:
                # Send error message for invalid JSON
                await connection_manager.send_personal_message(
                    connection_id,
                    WebSocketMessage(
                        type=WebSocketMessageType.ERROR,
                        data={"error": "Invalid JSON format"},
                        timestamp=datetime.utcnow()
                    )
                )
            except Exception as e:
                logger.error(f"Error processing client message: {e}")
                await connection_manager.send_personal_message(
                    connection_id,
                    WebSocketMessage(
                        type=WebSocketMessageType.ERROR,
                        data={"error": "Message processing failed"},
                        timestamp=datetime.utcnow()
                    )
                )
                
    except WebSocketDisconnect:
        await connection_manager.disconnect(connection_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await connection_manager.disconnect(connection_id)

@router.websocket("/packages")
async def packages_websocket(
    websocket: WebSocket,
    user_id: Optional[str] = Depends(get_current_user_id)
):
    """WebSocket endpoint specifically for package updates"""
    connection_id = await connection_manager.connect(websocket, user_id)
    
    # Auto-subscribe to package updates
    await connection_manager.subscribe(connection_id, "package_updates")
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            await connection_manager.handle_client_message(connection_id, message_data)
            
    except WebSocketDisconnect:
        await connection_manager.disconnect(connection_id)
    except Exception as e:
        logger.error(f"Packages WebSocket error: {e}")
        await connection_manager.disconnect(connection_id)

@router.websocket("/dashboard")
async def dashboard_websocket(
    websocket: WebSocket,
    user_id: Optional[str] = Depends(get_current_user_id)
):
    """WebSocket endpoint for dashboard metrics and analytics"""
    connection_id = await connection_manager.connect(websocket, user_id)
    
    # Auto-subscribe to dashboard metrics
    await connection_manager.subscribe(connection_id, "dashboard_metrics")
    await connection_manager.subscribe(connection_id, "notifications")
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            await connection_manager.handle_client_message(connection_id, message_data)
            
    except WebSocketDisconnect:
        await connection_manager.disconnect(connection_id)
    except Exception as e:
        logger.error(f"Dashboard WebSocket error: {e}")
        await connection_manager.disconnect(connection_id)

@router.websocket("/map")
async def map_websocket(
    websocket: WebSocket,
    user_id: Optional[str] = Depends(get_current_user_id)
):
    """WebSocket endpoint for map updates and location tracking"""
    connection_id = await connection_manager.connect(websocket, user_id)
    
    # Auto-subscribe to map updates
    await connection_manager.subscribe(connection_id, "map_updates")
    await connection_manager.subscribe(connection_id, "package_updates")
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            await connection_manager.handle_client_message(connection_id, message_data)
            
    except WebSocketDisconnect:
        await connection_manager.disconnect(connection_id)
    except Exception as e:
        logger.error(f"Map WebSocket error: {e}")
        await connection_manager.disconnect(connection_id)

@router.websocket("/agents")
async def agents_websocket(
    websocket: WebSocket,
    user_id: Optional[str] = Depends(get_current_user_id)
):
    """WebSocket endpoint for agent monitoring and control"""
    connection_id = await connection_manager.connect(websocket, user_id)
    
    # Auto-subscribe to agent activity
    await connection_manager.subscribe(connection_id, "agent_activity")
    await connection_manager.subscribe(connection_id, "system_health")
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            await connection_manager.handle_client_message(connection_id, message_data)
            
    except WebSocketDisconnect:
        await connection_manager.disconnect(connection_id)
    except Exception as e:
        logger.error(f"Agents WebSocket error: {e}")
        await connection_manager.disconnect(connection_id)

# REST endpoints for WebSocket management
@router.get("/status")
async def get_websocket_status():
    """Get WebSocket connection status and statistics"""
    return {
        "active_connections": connection_manager.get_connection_count(),
        "subscriptions": {
            subscription_type: connection_manager.get_subscription_count(subscription_type)
            for subscription_type in connection_manager.subscriptions.keys()
        },
        "status": "operational"
    }

@router.get("/connections")
async def get_connections():
    """Get information about active connections (admin only)"""
    connections = []
    for connection_id, info in connection_manager.connection_info.items():
        connections.append({
            "connection_id": connection_id,
            "user_id": info.user_id,
            "connected_at": info.connected_at,
            "last_activity": info.last_activity,
            "subscriptions": info.subscriptions
        })
    
    return {
        "connections": connections,
        "total": len(connections)
    }
