from typing import Optional

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Song(Base):
    """Database model for a song."""

    __tablename__ = "Song"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(32))
    lyrics: Mapped[Optional[str]] = mapped_column(String)
    project_id: Mapped[int] = mapped_column(ForeignKey("Project.id"))
    project: Mapped["Project"] = relationship(back_populates="songs")  # pyright: ignore[reportUndefinedVariable] # noqa: F821
