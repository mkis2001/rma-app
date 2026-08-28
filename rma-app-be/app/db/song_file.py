from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.constants import NAME_MAX_LENGTH
from app.database import Base


class SongFile(Base):
    """Database model for a song file."""

    __tablename__ = "SongFile"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(NAME_MAX_LENGTH))
    song_id: Mapped[int] = mapped_column(ForeignKey("Song.id"))
    song: Mapped["Song"] = relationship()  # pyright: ignore[reportUndefinedVariable] # noqa: F821
    path: Mapped[str] = mapped_column()
    mime_type: Mapped[str] = mapped_column()
