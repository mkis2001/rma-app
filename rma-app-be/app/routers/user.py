from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api_models.user import UserCreateRequest
from app.database import get_db
from app.db.user import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", status_code=status.HTTP_200_OK)
def get_user(username: str, db: Session = Depends(get_db)):
    """Endpoint for getting all users."""

    users = db.scalars(select(User).where(User.username.ilike(f"%{username}%"))).all()

    return users


@router.get("/{username}/available", status_code=status.HTTP_200_OK)
def check_username(username: str, db: Session = Depends(get_db)):
    """Endpoint for getting a user by username."""

    user = db.scalar(select(User).where(User.username == username))

    if user:
        return {"available": False}

    return {"available": True}


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreateRequest, db: Session = Depends(get_db)):
    """Endpoint for creating a new user."""

    new_user = User(id=user.id, username=user.username)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
