from typing import Optional

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Artist(Base):
    """Database model for an artist."""

    __tablename__ = "Artist"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(32))
    description: Mapped[Optional[str]] = mapped_column(String(255))
    projects: Mapped[list["Project"]] = relationship(back_populates="artist")  # pyright: ignore[reportUndefinedVariable] # noqa: F821
