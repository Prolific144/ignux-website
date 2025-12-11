# app/database.py
"""
Database Configuration and Session Management

This module handles database engine creation, session management,
and connection pooling for optimal performance in production.
"""

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from typing import Generator
import logging

from app.config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Create declarative base for models
Base = declarative_base()

# Database engine configuration
def create_db_engine() -> Engine:
    """
    Create and configure SQLAlchemy database engine.
    
    Returns:
        Configured SQLAlchemy engine with connection pooling.
        
    Notes:
        - Uses QueuePool for connection pooling in production
        - Sets appropriate timeouts and pool recycling
        - Enables SQL logging only in development
    """
    engine_kwargs = {
        "echo": settings.DEBUG,  # Log SQL queries only in debug mode
        "pool_pre_ping": True,   # Verify connections before using
        "pool_recycle": settings.DATABASE_POOL_RECYCLE,
    }
    
    if settings.DATABASE_URL.startswith("sqlite"):
        # SQLite specific configuration
        engine_kwargs.update({
            "connect_args": {"check_same_thread": False},
        })
    else:
        # Production database (PostgreSQL/MySQL) configuration
        engine_kwargs.update({
            "poolclass": QueuePool,
            "pool_size": settings.DATABASE_POOL_SIZE,
            "max_overflow": settings.DATABASE_MAX_OVERFLOW,
            "pool_timeout": 30,  # Wait 30 seconds for connection
        })
    
    try:
        engine = create_engine(
            settings.DATABASE_URL,
            **engine_kwargs
        )
        logger.info(f"Database engine created successfully for {settings.DATABASE_URL}")
        return engine
    except Exception as e:
        logger.error(f"Failed to create database engine: {e}")
        raise


# Create engine instance
engine = create_db_engine()

# Create session factory with appropriate configuration
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,  # Keep objects available after commit
    class_=Session
)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session.
    
    Yields:
        SQLAlchemy session for database operations.
        
    Usage:
        @app.get("/items/")
        def read_items(db: Session = Depends(get_db)):
            return crud.get_items(db)
            
    Notes:
        - Ensures session is properly closed after request completion
        - Handles exceptions and rolls back transactions on error
    """
    db: Session = SessionLocal()
    try:
        yield db
        db.commit()  # Commit transaction if no exceptions
    except Exception as e:
        db.rollback()  # Rollback on any exception
        logger.error(f"Database session error: {e}")
        raise
    finally:
        db.close()  # Always close session


def init_db() -> None:
    """
    Initialize database by creating all tables.
    
    This function should be called during application startup.
    In production, consider using migrations (Alembic) instead.
    
    Warnings:
        - Do NOT use in production with existing data
        - Use Alembic migrations for production schema changes
    """
    try:
        logger.info(f"Initializing database: {settings.DATABASE_URL}")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise


def close_db() -> None:
    """
    Close all database connections.
    
    Should be called during application shutdown.
    """
    try:
        engine.dispose()
        logger.info("Database connections closed successfully")
    except Exception as e:
        logger.error(f"Error closing database connections: {e}")