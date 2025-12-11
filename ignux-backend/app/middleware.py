# app/middleware.py
"""
Custom Middleware Classes

This module contains custom middleware implementations for:
- Rate limiting
- Request logging
- Security headers
- Performance monitoring
"""

import time
from typing import Dict, Tuple
from collections import defaultdict

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
import redis
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware to prevent API abuse.
    
    Uses Redis for distributed rate limiting in production,
    falls back to in-memory storage in development.
    """
    
    def __init__(
        self, 
        app: ASGIApp, 
        limit: int = 60, 
        window: int = 60,
        redis_url: str = None
    ):
        """
        Initialize rate limiter.
        
        Args:
            app: ASGI application
            limit: Maximum requests per window
            window: Time window in seconds
            redis_url: Redis URL for distributed rate limiting
        """
        super().__init__(app)
        self.limit = limit
        self.window = window
        self.redis_client = None
        self.local_store = defaultdict(list)  # Fallback for development
        
        # Initialize Redis client if available
        if redis_url and settings.is_production():
            try:
                self.redis_client = redis.Redis.from_url(
                    redis_url,
                    decode_responses=True,
                    socket_connect_timeout=5,
                    socket_timeout=5,
                )
                # Test connection
                self.redis_client.ping()
                logger.info("Redis rate limiting enabled")
            except Exception as e:
                logger.warning("Redis connection failed, using local rate limiting: %s", e)
                self.redis_client = None
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """
        Process request with rate limiting.
        
        Args:
            request: Incoming request
            call_next: Next middleware or route handler
            
        Returns:
            Response with rate limit headers
        """
        # Get client identifier (IP address)
        client_ip = request.client.host if request.client else "unknown"
        
        # Generate key for rate limiting
        key = f"rate_limit:{client_ip}:{request.url.path}"
        current_time = int(time.time())
        
        # Check rate limit
        is_allowed = self._check_rate_limit(key, current_time)
        
        if not is_allowed:
            logger.warning(
                "Rate limit exceeded for %s from %s",
                request.url.path,
                client_ip
            )
            return Response(
                content='{"detail": "Rate limit exceeded"}',
                status_code=429,
                headers={
                    "Content-Type": "application/json",
                    "Retry-After": str(self.window),
                    "X-RateLimit-Limit": str(self.limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(current_time + self.window),
                }
            )
        
        # Calculate remaining requests
        remaining = self._get_remaining_requests(key, current_time)
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers to response
        response.headers.update({
            "X-RateLimit-Limit": str(self.limit),
            "X-RateLimit-Remaining": str(remaining),
            "X-RateLimit-Reset": str(current_time + self.window),
        })
        
        return response
    
    def _check_rate_limit(self, key: str, current_time: int) -> bool:
        """Check if request is within rate limit."""
        if self.redis_client:
            return self._check_redis_rate_limit(key, current_time)
        else:
            return self._check_local_rate_limit(key, current_time)
    
    def _check_redis_rate_limit(self, key: str, current_time: int) -> bool:
        """Check rate limit using Redis."""
        try:
            # Use Redis pipeline for atomic operations
            pipe = self.redis_client.pipeline()
            
            # Remove old timestamps
            pipe.zremrangebyscore(key, 0, current_time - self.window)
            
            # Get current count
            pipe.zcard(key)
            
            # If under limit, add current timestamp
            pipe.zadd(key, {str(current_time): current_time})
            
            # Set expiry on key
            pipe.expire(key, self.window)
            
            # Execute pipeline
            results = pipe.execute()
            current_count = results[1]
            
            return current_count < self.limit
        except Exception as e:
            logger.error("Redis rate limit check failed: %s", e)
            # Fallback to local rate limiting
            return self._check_local_rate_limit(key, current_time)
    
    def _check_local_rate_limit(self, key: str, current_time: int) -> bool:
        """Check rate limit using local memory storage."""
        # Clean old timestamps
        timestamps = self.local_store[key]
        timestamps[:] = [ts for ts in timestamps if ts > current_time - self.window]
        
        # Check if under limit
        if len(timestamps) < self.limit:
            timestamps.append(current_time)
            return True
        return False
    
    def _get_remaining_requests(self, key: str, current_time: int) -> int:
        """Get number of remaining requests."""
        if self.redis_client:
            try:
                # Clean old timestamps
                self.redis_client.zremrangebyscore(key, 0, current_time - self.window)
                current_count = self.redis_client.zcard(key)
                return max(0, self.limit - current_count)
            except Exception as e:
                logger.error("Redis remaining requests check failed: %s", e)
                return self.limit
        else:
            timestamps = self.local_store[key]
            timestamps[:] = [ts for ts in timestamps if ts > current_time - self.window]
            return max(0, self.limit - len(timestamps))


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to responses.
    
    Implements security best practices:
    - Content Security Policy
    - X-Frame-Options
    - X-Content-Type-Options
    - Referrer Policy
    - Permissions Policy
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """Add security headers to response."""
        response = await call_next(request)
        
        security_headers = {
            # Prevent clickjacking
            "X-Frame-Options": "DENY",
            
            # Prevent MIME type sniffing
            "X-Content-Type-Options": "nosniff",
            
            # Referrer policy
            "Referrer-Policy": "strict-origin-when-cross-origin",
            
            # Permissions policy
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
            
            # Cross-origin resource sharing
            "Cross-Origin-Resource-Policy": "same-origin",
            
            # Cross-origin opener policy
            "Cross-Origin-Opener-Policy": "same-origin",
        }
        
        # Add Content Security Policy (CSP) in production
        if settings.is_production():
            security_headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                "font-src 'self' https://fonts.gstatic.com; "
                "img-src 'self' data: https:; "
                "connect-src 'self' https://api.ignux.com; "
                "frame-ancestors 'none'; "
                "base-uri 'self'; "
                "form-action 'self';"
            )
        
        # Add all security headers
        for header, value in security_headers.items():
            response.headers[header] = value
        
        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware for structured request logging.
    
    Logs all requests with details for monitoring and debugging.
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """Log request details."""
        start_time = time.time()
        
        # Extract request details
        request_details = {
            "method": request.method,
            "path": request.url.path,
            "query": str(request.query_params),
            "client_ip": request.client.host if request.client else "unknown",
            "user_agent": request.headers.get("user-agent", ""),
            "request_id": getattr(request.state, "request_id", None),
        }
        
        # Log request start
        logger.info(
            "Request started: %s %s from %s",
            request.method,
            request.url.path,
            request.client.host if request.client else "unknown"
        )
        
        # Process request
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Log successful response
            logger.info(
                "Request completed: %s %s - Status: %d - Time: %.3fs",
                request.method,
                request.url.path,
                response.status_code,
                process_time
            )
            
        except Exception as e:
            process_time = time.time() - start_time
            
            # Log error
            logger.error(
                "Request failed: %s %s - Error: %s - Time: %.3fs",
                request.method,
                request.url.path,
                str(e),
                process_time,
                exc_info=True
            )
            raise
        
        return response


# Middleware factory functions for easy configuration

def get_rate_limit_middleware():
    """Factory function for rate limit middleware."""
    return RateLimitMiddleware(
        app=None,  # Will be set by FastAPI
        limit=settings.RATE_LIMIT_PER_MINUTE,
        window=60,
        redis_url=os.getenv("REDIS_URL") if settings.is_production() else None
    )


def get_security_headers_middleware():
    """Factory function for security headers middleware."""
    return SecurityHeadersMiddleware(app=None)


def get_request_logging_middleware():
    """Factory function for request logging middleware."""
    return RequestLoggingMiddleware(app=None)