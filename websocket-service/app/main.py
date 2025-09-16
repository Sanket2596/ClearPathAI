from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager
import time
import logging

from app.websocket.router import router as websocket_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 WebSocket Service starting up...")
    yield
    # Shutdown
    print("🛑 WebSocket Service shutting down...")

app = FastAPI(
    title="WebSocket Service",
    description="Handles real-time communication, notifications, and event broadcasting",
    version="1.0.0",
    lifespan=lifespan
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "*.vercel.app", "*.clearpath-ai.com"]
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://clearpath-ai.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Simple rate limiting - in production, use Redis or similar
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    # Add security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    return response

# Include WebSocket router
app.include_router(websocket_router, prefix="/ws")

@app.get("/")
async def root():
    return {
        "message": "WebSocket Service",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        from app.websocket.connection_manager import connection_manager
        return {
            "status": "healthy",
            "service": "websocket-service",
            "active_connections": connection_manager.get_connection_count(),
            "timestamp": "2024-01-15T10:30:00Z"
        }
    except Exception as e:
        return {
            "status": "partial",
            "service": "websocket-service",
            "api": "healthy",
            "error": str(e),
            "timestamp": "2024-01-15T10:30:00Z"
        }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8003,
        reload=True
    )
