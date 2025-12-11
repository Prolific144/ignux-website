# app/routes/auth.py
"""
Authentication Routes

This module handles user authentication, registration, and token management.
Includes password reset functionality and admin user management.
"""

from datetime import datetime, timedelta, UTC
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field, validator
import secrets
import re

from app.core.database import get_db
from app.core.security import (
    create_access_token, 
    verify_password, 
    get_password_hash,
    get_current_user,
    get_current_admin_user
)
from app.core.config import settings
from app.core.email_service import email_service
from app.models import User
from app.schemas import UserCreate, UserResponse, Token, PasswordResetRequest, PasswordResetConfirm
from app.crud import user as user_crud

router = APIRouter(prefix="/auth", tags=["authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

class LoginRequest(BaseModel):
    """Login request schema."""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    
    @validator("username")
    def validate_username(cls, v: str) -> str:
        """Validate username format."""
        if not re.match(r'^[a-zA-Z0-9._-]+$', v):
            raise ValueError("Username can only contain letters, numbers, dots, underscores, and hyphens")
        return v.lower()

class RegisterRequest(UserCreate):
    """Registration request schema with additional validation."""
    
    @validator("password")
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r'[0-9]', v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("Password must contain at least one special character")
        return v
    
    @validator("email")
    def validate_email(cls, v: str) -> str:
        """Validate email domain and format."""
        # Additional email validation can be added here
        return v.lower()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: RegisterRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Register a new user account.
    
    - **username**: Must be unique, 3-50 characters
    - **email**: Must be unique and valid
    - **password**: At least 8 chars with uppercase, lowercase, number, and special char
    - **full_name**: User's full name
    
    Returns the created user without password.
    """
    try:
        # Check if username already exists
        existing_user = user_crud.get_user_by_username(db, user_data.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        # Check if email already exists
        existing_email = user_crud.get_user_by_email(db, user_data.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        user = user_crud.create_user(db, user_data)
        
        # Send welcome email in background
        background_tasks.add_task(
            send_welcome_email,
            user.email,
            user.full_name or user.username
        )
        
        return user
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Login with username and password.
    
    Returns access token for authenticated requests.
    Token expires in 8 days by default.
    """
    try:
        # Get user by username or email
        user = user_crud.get_user_by_username(db, form_data.username)
        if not user:
            # Try email
            user = user_crud.get_user_by_email(db, form_data.username)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect username or password",
                    headers={"WWW-Authenticate": "Bearer"}
                )
        
        # Verify password
        if not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=str(user.id),
            expires_delta=access_token_expires
        )
        
        # Update last login
        user.last_login = datetime.now(UTC)
        db.commit()
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": access_token_expires.total_seconds(),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "is_admin": user.is_admin
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@router.post("/refresh", response_model=Token)
async def refresh_token(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Refresh access token using current valid token.
    
    Useful for long sessions without requiring re-login.
    """
    try:
        # Create new token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=str(current_user.id),
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": access_token_expires.total_seconds()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )


@router.post("/password-reset-request")
async def request_password_reset(
    reset_request: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Request password reset link.
    
    Sends an email with reset token if the email exists.
    For security, always returns success even if email doesn't exist.
    """
    try:
        user = user_crud.get_user_by_email(db, reset_request.email)
        if user and user.is_active:
            # Generate reset token
            reset_token = secrets.token_urlsafe(32)
            reset_token_expiry = datetime.now(UTC) + timedelta(hours=24)
            
            # Store reset token (in a real app, store in database)
            # For now, we'll simulate by updating user
            user.reset_token = reset_token
            user.reset_token_expiry = reset_token_expiry
            db.commit()
            
            # Send reset email in background
            background_tasks.add_task(
                send_password_reset_email,
                user.email,
                user.full_name or user.username,
                reset_token
            )
        
        # Always return success for security
        return {
            "success": True,
            "message": "If an account exists with this email, a password reset link has been sent."
        }
        
    except Exception as e:
        # Still return success for security
        return {
            "success": True,
            "message": "If an account exists with this email, a password reset link has been sent."
        }


@router.post("/password-reset-confirm")
async def confirm_password_reset(
    reset_data: PasswordResetConfirm,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Confirm password reset with token.
    
    Requires valid reset token and new password.
    """
    try:
        # Find user by reset token (in real app, query by token)
        user = user_crud.get_user_by_reset_token(db, reset_data.token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        
        # Check token expiry
        if user.reset_token_expiry < datetime.now(UTC):
            # Clear expired token
            user.reset_token = None
            user.reset_token_expiry = None
            db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token has expired"
            )
        
        # Update password
        user.hashed_password = get_password_hash(reset_data.new_password)
        user.reset_token = None
        user.reset_token_expiry = None
        user.updated_at = datetime.now(UTC)
        db.commit()
        
        # Send confirmation email
        background_tasks.add_task(
            send_password_changed_email,
            user.email,
            user.full_name or user.username
        )
        
        return {
            "success": True,
            "message": "Password has been reset successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password reset failed: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current authenticated user information.
    """
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    """
    Update current user profile.
    
    Allowed fields: full_name, phone, address
    """
    try:
        # Filter allowed fields
        allowed_fields = ["full_name", "phone", "address"]
        update_data = {
            k: v for k, v in user_update.items() 
            if k in allowed_fields and v is not None
        }
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid fields to update"
            )
        
        # Update user
        updated_user = user_crud.update_user(db, current_user.id, update_data)
        
        return updated_user
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Update failed: {str(e)}"
        )


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Logout current user (invalidate token on client side).
    
    Note: Since JWT is stateless, actual invalidation requires
    a token blacklist or short token expiry. This endpoint
    mainly serves as a signal to the client.
    """
    # In a real implementation, you might:
    # 1. Add token to blacklist (Redis)
    # 2. Update user's last logout time
    # 3. Clear any refresh tokens
    
    return {
        "success": True,
        "message": "Successfully logged out"
    }


# Email helper functions
async def send_welcome_email(email: str, name: str) -> None:
    """Send welcome email to new user."""
    subject = "🎆 Welcome to IGNUX!"
    body = f"""
    <html>
    <body>
        <h2>Welcome to IGNUX, {name}!</h2>
        <p>Thank you for registering an account with IGNUX Fireworks & Stage FX.</p>
        <p>With your account, you can:</p>
        <ul>
            <li>Book fireworks displays online</li>
            <li>Track your bookings</li>
            <li>Receive special offers</li>
            <li>Save your preferences</li>
        </ul>
        <p>If you have any questions, contact us at {settings.COMPANY_PHONE}.</p>
        <br>
        <p>Best regards,</p>
        <p>The IGNUX Team</p>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(email, subject, body, is_html=True)
    except Exception as e:
        # Log error but don't fail registration
        print(f"Failed to send welcome email: {e}")


async def send_password_reset_email(email: str, name: str, token: str) -> None:
    """Send password reset email."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    subject = "🔐 IGNUX Password Reset Request"
    body = f"""
    <html>
    <body>
        <h2>Password Reset Request</h2>
        <p>Hello {name},</p>
        <p>You requested to reset your IGNUX account password.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="{reset_url}">{reset_url}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br>
        <p>Best regards,</p>
        <p>The IGNUX Team</p>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(email, subject, body, is_html=True)
    except Exception as e:
        print(f"Failed to send password reset email: {e}")


async def send_password_changed_email(email: str, name: str) -> None:
    """Send password changed confirmation email."""
    subject = "✅ IGNUX Password Changed"
    body = f"""
    <html>
    <body>
        <h2>Password Changed Successfully</h2>
        <p>Hello {name},</p>
        <p>Your IGNUX account password has been changed successfully.</p>
        <p>If you didn't make this change, please contact us immediately at {settings.COMPANY_PHONE}.</p>
        <br>
        <p>Best regards,</p>
        <p>The IGNUX Team</p>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(email, subject, body, is_html=True)
    except Exception as e:
        print(f"Failed to send password changed email: {e}")


# Admin endpoints
@router.post("/users/{user_id}/deactivate", dependencies=[Depends(get_current_admin_user)])
async def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Deactivate a user account (admin only).
    """
    try:
        user = user_crud.get_user(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user.is_active = False
        db.commit()
        
        return {
            "success": True,
            "message": f"User {user.username} deactivated"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to deactivate user: {str(e)}"
        )