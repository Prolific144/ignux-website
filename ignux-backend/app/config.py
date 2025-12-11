# app/config.py
"""
Application Configuration Module

This module handles all configuration settings for the IGNUX API,
including environment variables, database settings, and third-party
service configurations.

Uses Pydantic Settings for robust validation and type safety.
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator, PostgresDsn, field_validator


class Settings(BaseSettings):
    """
    Application settings class.
    
    All configuration should be defined here and loaded from environment
    variables with appropriate defaults for development.
    """
    
    # ============ API & Application Settings ============
    API_V1_STR: str = "/api/v1"
    """API version prefix for all v1 endpoints"""
    
    PROJECT_NAME: str = "IGNUX API"
    """Application name used in documentation and responses"""
    
    VERSION: str = "1.0.0"
    """API version for versioning and compatibility"""
    
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    """Current environment: development, staging, production"""
    
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    """Enable debug mode (caution: exposes details in production)"""
    
    # ============ Database Configuration ============
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ignux.db")
    """Database connection URL. Use PostgreSQL in production."""
    
    DATABASE_POOL_SIZE: int = int(os.getenv("DATABASE_POOL_SIZE", 5))
    """Database connection pool size"""
    
    DATABASE_MAX_OVERFLOW: int = int(os.getenv("DATABASE_MAX_OVERFLOW", 10))
    """Maximum number of connections that can be created beyond pool_size"""
    
    DATABASE_POOL_RECYCLE: int = int(os.getenv("DATABASE_POOL_RECYCLE", 3600))
    """Seconds after which a connection is recycled"""
    
    # ============ Email Configuration ============
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    """SMTP server for email notifications"""
    
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    """SMTP server port"""
    
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    """SMTP authentication username"""
    
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    """SMTP authentication password"""
    
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@ignux.com")
    """Default sender email address"""
    
    EMAIL_ADMIN: str = os.getenv("EMAIL_ADMIN", "admin@ignux.com")
    """Administrator email for notifications"""
    
    # ============ Security Settings ============
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    """Secret key for JWT tokens and cryptographic operations"""
    
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 8)
    )
    """JWT token expiration time in minutes (8 days default)"""
    
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    """Algorithm used for JWT token signing"""
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    """Allowed CORS origins for development"""
    
    # ============ Rate Limiting ============
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", 60))
    """Requests per minute per IP for rate limiting"""
    
    # ============ File Upload Configuration ============
    MAX_UPLOAD_SIZE: int = int(os.getenv("MAX_UPLOAD_SIZE", 10 * 1024 * 1024))
    """Maximum file upload size in bytes (default: 10MB)"""
    
    ALLOWED_FILE_TYPES: List[str] = ["jpg", "jpeg", "png", "pdf", "doc", "docx"]
    """Allowed file types for uploads"""
    
    # ============ Company Information ============
    COMPANY_NAME: str = os.getenv("COMPANY_NAME", "IGNUX")
    """Official company name"""
    
    BRAND_NAME: str = os.getenv("BRAND_NAME", "IGNUX Fireworks & Stage FX")
    """Brand/trading name"""
    
    COMPANY_EMAIL: str = os.getenv("COMPANY_EMAIL", "konstantentertainment@gmail.com")
    """Primary company contact email"""
    
    COMPANY_PHONE: str = os.getenv("COMPANY_PHONE", "+254750077424")
    """Primary company phone number"""
    
    COMPANY_ADDRESS: str = os.getenv("COMPANY_ADDRESS", "Nairobi, Kenya")
    """Company physical address"""
    
    # ============ Third-Party Services ============
    WHATSAPP_PHONE: str = os.getenv("WHATSAPP_PHONE", "+254750077424")
    """WhatsApp business phone number"""
    
    GOOGLE_MAPS_API_KEY: Optional[str] = os.getenv("GOOGLE_MAPS_API_KEY")
    """Google Maps API key for location services"""
    
    # ============ Monitoring & Logging ============
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    """Logging level: DEBUG, INFO, WARNING, ERROR, CRITICAL"""
    
    SENTRY_DSN: Optional[str] = os.getenv("SENTRY_DSN")
    """Sentry DSN for error tracking and monitoring"""
    
    # ============ Performance Settings ============
    REQUEST_TIMEOUT: int = int(os.getenv("REQUEST_TIMEOUT", 30))
    """Default request timeout in seconds"""
    
    # Validators
    @field_validator("CORS_ORIGINS")
    @classmethod
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        """Parse CORS origins from environment variable if provided as string."""
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        """Validate and ensure proper database URL format."""
        if v.startswith("postgres://"):
            # Convert old postgres:// to postgresql://
            v = v.replace("postgres://", "postgresql://", 1)
        return v
    
    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        """Ensure secret key is set in production."""
        if cls.ENVIRONMENT == "production" and not v:
            raise ValueError("SECRET_KEY must be set in production environment")
        return v
    
    class Config:
        """Pydantic configuration."""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"  # Changed from "forbid" to "ignore" to allow extra env variables


# Global settings instance
settings = Settings()


def is_production() -> bool:
    """Helper function to check if running in production environment."""
    return settings.ENVIRONMENT == "production"


def is_development() -> bool:
    """Helper function to check if running in development environment."""
    return settings.ENVIRONMENT == "development"


def get_cors_origins() -> List[str]:
    """
    Get CORS origins based on environment.
    
    Returns:
        List of allowed origins. In production, returns production domains.
        In development, returns development origins plus production domains.
    """
    production_origins = [
        "https://ignux.com",
        "https://www.ignux.com",
        "https://api.ignux.com",
    ]
    
    if is_production():
        return production_origins
    else:
        # In development, allow both local and production origins
        return list(set(settings.CORS_ORIGINS + production_origins))