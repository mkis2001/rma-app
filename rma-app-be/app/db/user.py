import uuid

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.constants import USERNAME_MAX_LENGTH
from app.database import Base


class User(Base):
    """Database model for a user profile."""

    __tablename__ = "User"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(USERNAME_MAX_LENGTH), unique=True)
    artists = relationship("Artist", secondary="UserArtist", back_populates="users")  # pyright: ignore[reportUndefinedVariable] # noqa: F821
