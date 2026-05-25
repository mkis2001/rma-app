from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ProjectType(Base):
    """Database model for project type."""

    __tablename__ = "ProjectType"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
