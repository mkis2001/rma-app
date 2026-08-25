from typing import Optional

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.constants import NAME_MAX_LENGTH
from app.database import Base


class Song(Base):
    """Database model for a song."""

    __tablename__ = "Song"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(NAME_MAX_LENGTH))
    lyrics: Mapped[Optional[str]] = mapped_column(String(25000))
    project_id: Mapped[int] = mapped_column(ForeignKey("Project.id"))
    project: Mapped["Project"] = relationship(back_populates="songs")  # pyright: ignore[reportUndefinedVariable] # noqa: F821
    song_files: Mapped[list["SongFile"]] = relationship(back_populates="song")  # pyright: ignore[reportUndefinedVariable] # noqa: F821
