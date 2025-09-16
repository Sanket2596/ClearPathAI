from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Use MongoDB for AI service (investigation results, agent logs)
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/ai_service")

# For now, we'll use PostgreSQL for compatibility
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ai_agent.db")

# Create database engine (PostgreSQL or SQLite)
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )
    print("✅ Using SQLite database for AI Agent Service")
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=False
    )
    print("✅ Using PostgreSQL database for AI Agent Service")

# Test connection
try:
    with engine.connect() as conn:
        from sqlalchemy import text
        conn.execute(text("SELECT 1"))
    print("✅ AI Agent Service database connection successful")
except Exception as e:
    print(f"❌ AI Agent Service database connection failed: {e}")
    raise e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
