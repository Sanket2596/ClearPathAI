from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import uvicorn
from contextlib import asynccontextmanager
import time
import logging

from app.database import engine, get_db
from app.api.agents import router as agents_router
from app.api.mcp import router as mcp_router
from app.auth.dependencies import get_current_user, get_current_user_optional, get_active_user
from app.mcp.server import initialize_mcp_server

# Create tables
try:
    # Only create AI-specific tables here
    print("✅ AI Agent Service database tables created successfully!")
except Exception as e:
    print(f"❌ AI Agent Service database setup failed: {e}")
    print("   Please check your database connection")
    raise e

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 AI Agent Service starting up...")
    
    # Initialize MCP Server
    try:
        mcp_server = initialize_mcp_server()
        print("✅ MCP Server initialized successfully!")
        print(f"   Available tools: {len(mcp_server.tool_registry.tools)}")
    except Exception as e:
        print(f"❌ MCP Server initialization failed: {e}")
        print("   Service will continue without MCP functionality")
    
    yield
    
    # Shutdown
    print("🛑 AI Agent Service shutting down...")

app = FastAPI(
    title="AI Agent Service",
    description="Handles AI-powered package analysis, investigation, and recommendations",
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

# Include routers
app.include_router(agents_router, prefix="/api/v1/agents")
app.include_router(mcp_router, prefix="/api/v1/mcp")

@app.get("/")
async def root():
    return {
        "message": "AI Agent Service",
        "version": "1.0.0",
        "status": "operational",
        "features": ["ai-agents", "mcp-tools", "package-investigation"]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        from app.database import SessionLocal
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return {
            "status": "healthy",
            "service": "ai-agent-service",
            "database": "connected",
            "timestamp": "2024-01-15T10:30:00Z"
        }
    except Exception as e:
        return {
            "status": "partial",
            "service": "ai-agent-service",
            "database": "disconnected",
            "api": "healthy",
            "error": str(e),
            "timestamp": "2024-01-15T10:30:00Z"
        }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=True
    )
