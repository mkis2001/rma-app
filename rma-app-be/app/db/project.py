from typing import Optional

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.constants import (
    DESCRIPTION_MAX_LENGTH,
    NAME_MAX_LENGTH,
)
from app.database import Base
from app.db.artist import Artist
from app.db.project_type import ProjectType  # noqa: E402, F401


class Project(Base):
    """Database model for a project."""

    __tablename__ = "Project"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(NAME_MAX_LENGTH))
    type_id: Mapped[int] = mapped_column(ForeignKey("ProjectType.id"))
    type: Mapped["ProjectType"] = relationship()
    description: Mapped[Optional[str]] = mapped_column(String(DESCRIPTION_MAX_LENGTH))
    artist_id: Mapped[int] = mapped_column(ForeignKey("Artist.id"))
    artist: Mapped["Artist"] = relationship()
    songs: Mapped[list["Song"]] = relationship(back_populates="project")  # pyright: ignore[reportUndefinedVariable] # noqa: F821
