from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import uvicorn
from contextlib import asynccontextmanager

from app.database import engine, get_db
from app.models.package import Base
from app.api.packages import router as packages_router
from app.websocket import router as websocket_router

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
except Exception as e:
    print(f"❌ Database setup failed: {e}")
    print("   Please check your PostgreSQL connection")
    raise e

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 ClearPath AI Backend starting up...")
    yield
    # Shutdown
    print("🛑 ClearPath AI Backend shutting down...")

app = FastAPI(
    title="ClearPath AI - Package Management API",
    description="AI-powered logistics package tracking and recovery system",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(packages_router, prefix="/api/v1")
app.include_router(websocket_router)

@app.get("/")
async def root():
    return {
        "message": "ClearPath AI Package Management API",
        "version": "1.0.0",
        "status": "operational"
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
            "database": "connected",
            "timestamp": "2024-01-15T10:30:00Z"
        }
    except Exception as e:
        return {
            "status": "partial",
            "database": "disconnected",
            "api": "healthy",
            "error": str(e),
            "timestamp": "2024-01-15T10:30:00Z"
        }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
