"""
Authentication dependencies for FastAPI
"""
from typing import Optional, Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .clerk_auth import clerk_auth
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)

class CurrentUser:
    def __init__(self, user_id: str, email: str, first_name: str = None, last_name: str = None, **kwargs):
        self.user_id = user_id
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.full_name = f"{first_name} {last_name}".strip() if first_name or last_name else email
        self.metadata = kwargs

async def get_current_user_optional(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(security)]
) -> Optional[CurrentUser]:
    """Get current user from JWT token (optional - returns None if no token)"""
    if not credentials:
        return None
    
    try:
        payload = await clerk_auth.verify_token(credentials.credentials)
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id or not email:
            return None
            
        return CurrentUser(
            user_id=user_id,
            email=email,
            first_name=payload.get("given_name"),
            last_name=payload.get("family_name"),
            **payload
        )
    except HTTPException:
        return None
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        return None

async def get_current_user(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(security)]
) -> CurrentUser:
    """Get current user from JWT token (required)"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        payload = await clerk_auth.verify_token(credentials.credentials)
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return CurrentUser(
            user_id=user_id,
            email=email,
            first_name=payload.get("given_name"),
            last_name=payload.get("family_name"),
            **payload
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication verification failed"
        )

async def get_active_user(
    current_user: Annotated[CurrentUser, Depends(get_current_user)]
) -> CurrentUser:
    """Require active user"""
    # In a real implementation, you would check user status in database
    return current_user
