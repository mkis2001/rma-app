from typing import Optional

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.constants import (
    DESCRIPTION_MAX_LENGTH,
    NAME_MAX_LENGTH,
)
from app.database import Base


class Artist(Base):
    """Database model for an artist."""

    __tablename__ = "Artist"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(NAME_MAX_LENGTH))
    description: Mapped[Optional[str]] = mapped_column(String(DESCRIPTION_MAX_LENGTH))
    projects: Mapped[list["Project"]] = relationship(back_populates="artist")  # pyright: ignore[reportUndefinedVariable] # noqa: F821
    users = relationship("User", secondary="UserArtist", back_populates="artists")  # pyright: ignore[reportUndefinedVariable] # noqa: F821
