"""
Clerk JWT Authentication for FastAPI Backend
"""
import os
import httpx
import json
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from jose import jwt, JWTError
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

class ClerkJWTAuth:
    def __init__(self):
        self.clerk_secret_key = os.getenv("CLERK_SECRET_KEY")
        self.clerk_publishable_key = os.getenv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "").replace("pk_", "")
        self.clerk_jwks_url = f"https://api.clerk.com/v1/jwks"
        self._jwks_cache = None
        self._jwks_cache_time = None
        
        if not self.clerk_secret_key:
            logger.warning("CLERK_SECRET_KEY not found in environment variables")
    
    async def get_jwks(self) -> Dict[str, Any]:
        """Get JWKS (JSON Web Key Set) from Clerk"""
        # Cache JWKS for 1 hour
        if (self._jwks_cache and self._jwks_cache_time and 
            (datetime.now(timezone.utc) - self._jwks_cache_time).seconds < 3600):
            return self._jwks_cache
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.clerk_jwks_url,
                    headers={"Authorization": f"Bearer {self.clerk_secret_key}"}
                )
                response.raise_for_status()
                
                self._jwks_cache = response.json()
                self._jwks_cache_time = datetime.now(timezone.utc)
                return self._jwks_cache
                
        except Exception as e:
            logger.error(f"Failed to fetch JWKS from Clerk: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication service unavailable"
            )
    
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify Clerk JWT token"""
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No authentication token provided",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith("Bearer "):
                token = token[7:]
            
            # Get JWKS for token verification
            jwks = await self.get_jwks()
            
            # Decode token header to get key ID
            unverified_header = jwt.get_unverified_header(token)
            key_id = unverified_header.get("kid")
            
            if not key_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token format",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            # Find the correct key
            signing_key = None
            for key in jwks.get("keys", []):
                if key.get("kid") == key_id:
                    signing_key = key
                    break
            
            if not signing_key:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token key",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            # Verify and decode token
            payload = jwt.decode(
                token,
                signing_key,
                algorithms=["RS256"],
                audience=self.clerk_publishable_key,
                options={"verify_signature": True, "verify_aud": False}  # Clerk uses different audience format
            )
            
            # Validate token expiration
            exp = payload.get("exp")
            if exp and datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(timezone.utc):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has expired",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            return payload
            
        except JWTError as e:
            logger.error(f"JWT verification failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception as e:
            logger.error(f"Token verification error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication verification failed"
            )
    
    async def get_user_info(self, user_id: str) -> Dict[str, Any]:
        """Get user information from Clerk"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://api.clerk.com/v1/users/{user_id}",
                    headers={"Authorization": f"Bearer {self.clerk_secret_key}"}
                )
                response.raise_for_status()
                return response.json()
                
        except Exception as e:
            logger.error(f"Failed to fetch user info from Clerk: {e}")
            return {}

# Global auth instance
clerk_auth = ClerkJWTAuth()
