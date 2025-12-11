# app/main.py
"""
FastAPI Application Entry Point

This module initializes the FastAPI application with proper configuration,
middleware, and routing for production deployment.
"""

import logging
import time
from contextlib import asynccontextmanager
from typing import Any, Dict

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
import sentry_sdk

from app.config import settings, is_production, get_cors_origins
from app.database import init_db, close_db
from app.routes import bookings, contacts, services, admin
from app.middleware import RateLimitMiddleware

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("ignux_api.log") if is_production() else None
    ]
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.
    
    Handles:
    - Database initialization
    - Monitoring setup
    - Resource cleanup
    """
    # Startup
    startup_time = time.time()
    logger.info("🚀 Starting IGNUX API v%s...", settings.VERSION)
    logger.info("Environment: %s", settings.ENVIRONMENT)
    
    try:
        # Initialize database
        init_db()
        logger.info("✅ Database initialized successfully")
        
        # Initialize Sentry for error tracking in production
        if settings.SENTRY_DSN:
            sentry_sdk.init(
                dsn=settings.SENTRY_DSN,
                traces_sample_rate=1.0,
                environment=settings.ENVIRONMENT,
                release=settings.VERSION,
            )
            logger.info("✅ Sentry monitoring initialized")
        
        startup_duration = time.time() - startup_time
        logger.info("✨ Startup completed in %.2f seconds", startup_duration)
        
        yield  # Application runs here
        
    except Exception as e:
        logger.error("❌ Startup failed: %s", str(e))
        raise
    finally:
        # Shutdown
        logger.info("👋 Shutting down IGNUX API...")
        try:
            close_db()
            logger.info("✅ Database connections closed")
        except Exception as e:
            logger.error("Error during shutdown: %s", e)


def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application instance.
    
    Returns:
        Configured FastAPI application ready for deployment.
    """
    # Create FastAPI instance with metadata
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="""
        🔥 IGNUX Fireworks & Stage FX Services API
        
        This API powers the IGNUX booking system, handling:
        - Event bookings and management
        - Client communications
        - Service catalog
        - Administrative functions
        
        ## Authentication
        Most endpoints require authentication via JWT tokens.
        
        ## Rate Limiting
        API is rate-limited to prevent abuse.
        """,
        docs_url="/docs" if not is_production() else None,
        redoc_url="/redoc" if not is_production() else None,
        openapi_url="/openapi.json" if not is_production() else None,
        lifespan=lifespan,
        contact={
            "name": settings.COMPANY_NAME,
            "email": settings.COMPANY_EMAIL,
            "url": "https://ignux.com",
        },
        license_info={
            "name": "Proprietary",
            "url": "https://ignux.com/terms",
        },
    )
    
    # ============ Middleware Configuration ============
    
    # CORS middleware - must be first
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_cors_origins(),
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=[
            "Content-Type", 
            "Authorization", 
            "Accept",
            "X-Requested-With",
            "X-CSRF-Token",
        ],
        expose_headers=["Content-Length", "X-Request-ID"],
        max_age=600,  # Cache preflight requests for 10 minutes
    )
    
    # Trusted Host middleware for production
    if is_production():
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=["ignux.com", "www.ignux.com", "api.ignux.com"]
        )
    
    # HTTPS redirect for production
    if is_production() and not settings.DEBUG:
        app.add_middleware(HTTPSRedirectMiddleware)
    
    # GZip compression for responses
    app.add_middleware(
        GZipMiddleware,
        minimum_size=1000,  # Only compress responses > 1KB
    )
    
    # Custom rate limiting middleware
    app.add_middleware(
        RateLimitMiddleware,
        limit=settings.RATE_LIMIT_PER_MINUTE,
        window=60,  # 1 minute window
    )
    
    # Request timing middleware
    @app.middleware("http")
    async def add_process_time_header(request: Request, call_next) -> Response:
        """Add X-Process-Time header to responses."""
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        # Log slow requests
        if process_time > 2.0:  # More than 2 seconds is slow
            logger.warning(
                "Slow request: %s %s took %.2f seconds",
                request.method,
                request.url.path,
                process_time
            )
        
        return response
    
    # Request ID middleware
    @app.middleware("http")
    async def add_request_id(request: Request, call_next) -> Response:
        """Add X-Request-ID header to requests and responses."""
        import uuid
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response
    
    # ============ Exception Handlers ============
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, 
        exc: RequestValidationError
    ) -> JSONResponse:
        """Handle Pydantic validation errors with detailed response."""
        logger.warning(
            "Validation error for %s %s: %s",
            request.method,
            request.url.path,
            exc.errors()
        )
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "message": "Validation failed",
                "errors": exc.errors(),
                "request_id": getattr(request.state, "request_id", None),
            },
        )
    
    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request, 
        exc: Exception
    ) -> JSONResponse:
        """Handle all uncaught exceptions."""
        error_id = str(uuid.uuid4())
        logger.error(
            "Unhandled exception [%s] for %s %s: %s",
            error_id,
            request.method,
            request.url.path,
            str(exc),
            exc_info=True
        )
        
        # Report to Sentry in production
        if settings.SENTRY_DSN:
            sentry_sdk.capture_exception(exc)
        
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal server error",
                "error_id": error_id,
                "request_id": getattr(request.state, "request_id", None),
            },
        )
    
    # ============ Static Files ============
    
    # Mount static files directory
    app.mount(
        "/static", 
        StaticFiles(directory="static"), 
        name="static"
    )
    
    # ============ Routes ============
    
    # Include API routers
    app.include_router(
        bookings.router, 
        prefix=settings.API_V1_STR, 
        tags=["bookings"]
    )
    app.include_router(
        contacts.router, 
        prefix=settings.API_V1_STR, 
        tags=["contacts"]
    )
    app.include_router(
        services.router, 
        prefix=settings.API_V1_STR, 
        tags=["services"]
    )
    app.include_router(
        admin.router, 
        prefix=settings.API_V1_STR, 
        tags=["admin"]
    )
    
    # ============ Prometheus Metrics ============
    
    # Initialize Prometheus metrics endpoint
    if is_production():
        Instrumentator().instrument(app).expose(app, endpoint="/metrics")
    
    # ============ Health and Info Endpoints ============
    
    @app.get("/", tags=["info"])
    async def read_root() -> Dict[str, Any]:
        """Root endpoint with API information."""
        return {
            "message": "Welcome to IGNUX API",
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
            "service": "Fireworks & Stage FX Services",
            "company": settings.COMPANY_NAME,
            "docs": "/docs" if not is_production() else None,
            "health": "/health",
            "status": "operational",
        }
    
    @app.get("/health", tags=["health"])
    async def health_check() -> Dict[str, Any]:
        """
        Health check endpoint for monitoring and load balancers.
        
        Returns detailed health status of all components.
        """
        health_status = {
            "status": "healthy",
            "service": "IGNUX API",
            "timestamp": time.time(),
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
        }
        
        # Check database connectivity
        try:
            from app.database import SessionLocal
            db = SessionLocal()
            db.execute("SELECT 1")
            db.close()
            health_status["database"] = "connected"
        except Exception as e:
            health_status["database"] = "disconnected"
            health_status["status"] = "unhealthy"
            health_status["database_error"] = str(e)
        
        # Check email service (if configured)
        if settings.SMTP_USERNAME:
            try:
                import smtplib
                with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                    server.starttls()
                    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                health_status["email_service"] = "connected"
            except Exception as e:
                health_status["email_service"] = "disconnected"
                health_status["status"] = "degraded"
        
        return health_status
    
    @app.get("/info", tags=["info"])
    async def system_info() -> Dict[str, Any]:
        """System information endpoint."""
        import platform
        import sys
        
        return {
            "system": {
                "python_version": sys.version,
                "platform": platform.platform(),
                "processor": platform.processor(),
            },
            "application": {
                "name": settings.PROJECT_NAME,
                "version": settings.VERSION,
                "environment": settings.ENVIRONMENT,
                "debug": settings.DEBUG,
            },
            "company": {
                "name": settings.COMPANY_NAME,
                "brand": settings.BRAND_NAME,
                "email": settings.COMPANY_EMAIL,
                "phone": settings.COMPANY_PHONE,
            },
            "developer": {
                "name": settings.DEVELOPER,
                "url": settings.DEVELOPER_URL,
            },
        }
    
    return app


# Create application instance
app = create_application()


# Application can be run with: uvicorn app.main:app --host 0.0.0.0 --port 8000