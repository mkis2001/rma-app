import uuid

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UserArtist(Base):
    """Database model for user-artist relationship."""

    __tablename__ = "UserArtist"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("User.id"))
    artist_id: Mapped[int] = mapped_column(ForeignKey("Artist.id"))
