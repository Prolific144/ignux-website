# app/core/security.py
from datetime import datetime, timedelta, UTC
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptPasswordHasher
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app import crud, models
from app.core.config import settings

# JWT
ALGORITHM = "HS256"
bearer_scheme = HTTPBearer()

pwd_context = CryptPasswordHasher(schemes=["bcrypt"], deprecated="auto")


def create_access_token(subject: str, expires_delta: timedelta = None) -> str:
    expire = datetime.now(UTC) + (expires_delta or timedelta(minutes=60))
    to_encode = {"exp": expire, "sub": str(subject)}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = crud.get_user(db, int(user_id))
    if user is None:
        raise credentials_exception
    return user


def get_current_admin_user(current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user