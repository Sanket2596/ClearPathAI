import json
import asyncio
from typing import Dict, List, Set, Optional
from fastapi import WebSocket
from datetime import datetime
import uuid
import logging

from app.schemas.websocket import (
    WebSocketMessage, 
    WebSocketMessageType, 
    WebSocketConnectionInfo,
    WebSocketError
)

logger = logging.getLogger(__name__)

class WebSocketConnectionManager:
    """Manages WebSocket connections and message broadcasting"""
    
    def __init__(self):
        # Active connections: {connection_id: WebSocket}
        self.active_connections: Dict[str, WebSocket] = {}
        # Connection info: {connection_id: WebSocketConnectionInfo}
        self.connection_info: Dict[str, WebSocketConnectionInfo] = {}
        # Subscriptions: {subscription_type: Set[connection_ids]}
        self.subscriptions: Dict[str, Set[str]] = {}
        # User connections: {user_id: Set[connection_ids]}
        self.user_connections: Dict[str, Set[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: Optional[str] = None) -> str:
        """Accept a new WebSocket connection"""
        await websocket.accept()
        
        connection_id = str(uuid.uuid4())
        self.active_connections[connection_id] = websocket
        
        connection_info = WebSocketConnectionInfo(
            connection_id=connection_id,
            user_id=user_id,
            connected_at=datetime.utcnow(),
            last_activity=datetime.utcnow()
        )
        self.connection_info[connection_id] = connection_info
        
        # Track user connections
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = set()
            self.user_connections[user_id].add(connection_id)
        
        logger.info(f"WebSocket connected: {connection_id} (user: {user_id})")
        
        # Send welcome message
        await self.send_personal_message(
            connection_id,
            WebSocketMessage(
                type=WebSocketMessageType.SUCCESS,
                data={"message": "Connected to ClearPath AI WebSocket", "connection_id": connection_id},
                timestamp=datetime.utcnow()
            )
        )
        
        return connection_id
    
    async def disconnect(self, connection_id: str):
        """Disconnect a WebSocket connection"""
        if connection_id in self.active_connections:
            websocket = self.active_connections[connection_id]
            await websocket.close()
            
            # Remove from all tracking
            del self.active_connections[connection_id]
            
            if connection_id in self.connection_info:
                connection_info = self.connection_info[connection_id]
                user_id = connection_info.user_id
                
                # Remove from user connections
                if user_id and user_id in self.user_connections:
                    self.user_connections[user_id].discard(connection_id)
                    if not self.user_connections[user_id]:
                        del self.user_connections[user_id]
                
                # Remove from subscriptions
                for subscription_type in connection_info.subscriptions:
                    if subscription_type in self.subscriptions:
                        self.subscriptions[subscription_type].discard(connection_id)
                
                del self.connection_info[connection_id]
            
            logger.info(f"WebSocket disconnected: {connection_id}")
    
    async def send_personal_message(self, connection_id: str, message: WebSocketMessage):
        """Send a message to a specific connection"""
        if connection_id in self.active_connections:
            try:
                websocket = self.active_connections[connection_id]
                await websocket.send_text(message.model_dump_json())
                
                # Update last activity
                if connection_id in self.connection_info:
                    self.connection_info[connection_id].last_activity = datetime.utcnow()
                    
            except Exception as e:
                logger.error(f"Error sending message to {connection_id}: {e}")
                await self.disconnect(connection_id)
    
    async def broadcast_message(self, message: WebSocketMessage, subscription_type: Optional[str] = None):
        """Broadcast a message to all connections or specific subscription"""
        target_connections = set()
        
        if subscription_type and subscription_type in self.subscriptions:
            target_connections = self.subscriptions[subscription_type].copy()
        else:
            target_connections = set(self.active_connections.keys())
        
        # Send to all target connections
        tasks = []
        for connection_id in target_connections:
            if connection_id in self.active_connections:
                tasks.append(self.send_personal_message(connection_id, message))
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
    
    async def broadcast_to_user(self, user_id: str, message: WebSocketMessage):
        """Broadcast a message to all connections of a specific user"""
        if user_id in self.user_connections:
            tasks = []
            for connection_id in self.user_connections[user_id]:
                if connection_id in self.active_connections:
                    tasks.append(self.send_personal_message(connection_id, message))
            
            if tasks:
                await asyncio.gather(*tasks, return_exceptions=True)
    
    async def subscribe(self, connection_id: str, subscription_type: str):
        """Subscribe a connection to a specific message type"""
        if connection_id in self.connection_info:
            self.connection_info[connection_id].subscriptions.append(subscription_type)
            
            if subscription_type not in self.subscriptions:
                self.subscriptions[subscription_type] = set()
            self.subscriptions[subscription_type].add(connection_id)
            
            logger.info(f"Connection {connection_id} subscribed to {subscription_type}")
    
    async def unsubscribe(self, connection_id: str, subscription_type: str):
        """Unsubscribe a connection from a specific message type"""
        if connection_id in self.connection_info:
            self.connection_info[connection_id].subscriptions.remove(subscription_type)
            
            if subscription_type in self.subscriptions:
                self.subscriptions[subscription_type].discard(connection_id)
            
            logger.info(f"Connection {connection_id} unsubscribed from {subscription_type}")
    
    async def handle_client_message(self, connection_id: str, message_data: dict):
        """Handle incoming messages from clients"""
        try:
            message_type = message_data.get("type")
            data = message_data.get("data", {})
            
            if message_type == "subscribe":
                subscription_type = data.get("subscription_type")
                if subscription_type:
                    await self.subscribe(connection_id, subscription_type)
                    
            elif message_type == "unsubscribe":
                subscription_type = data.get("subscription_type")
                if subscription_type:
                    await self.unsubscribe(connection_id, subscription_type)
                    
            elif message_type == "ping":
                # Respond to ping with pong
                await self.send_personal_message(
                    connection_id,
                    WebSocketMessage(
                        type=WebSocketMessageType.PONG,
                        data={"timestamp": datetime.utcnow().isoformat()},
                        timestamp=datetime.utcnow()
                    )
                )
                
            elif message_type == "get_connection_info":
                # Send connection info back to client
                if connection_id in self.connection_info:
                    connection_info = self.connection_info[connection_id]
                    await self.send_personal_message(
                        connection_id,
                        WebSocketMessage(
                            type=WebSocketMessageType.SUCCESS,
                            data=connection_info.model_dump(),
                            timestamp=datetime.utcnow()
                        )
                    )
            
            # Update last activity
            if connection_id in self.connection_info:
                self.connection_info[connection_id].last_activity = datetime.utcnow()
                
        except Exception as e:
            logger.error(f"Error handling client message: {e}")
            await self.send_personal_message(
                connection_id,
                WebSocketMessage(
                    type=WebSocketMessageType.ERROR,
                    data=WebSocketError(
                        error_code="MESSAGE_HANDLING_ERROR",
                        error_message=str(e)
                    ).model_dump(),
                    timestamp=datetime.utcnow()
                )
            )
    
    def get_connection_count(self) -> int:
        """Get the number of active connections"""
        return len(self.active_connections)
    
    def get_connection_info(self, connection_id: str) -> Optional[WebSocketConnectionInfo]:
        """Get connection information"""
        return self.connection_info.get(connection_id)
    
    def get_subscription_count(self, subscription_type: str) -> int:
        """Get the number of subscribers for a subscription type"""
        return len(self.subscriptions.get(subscription_type, set()))

# Global connection manager instance
connection_manager = WebSocketConnectionManager()
