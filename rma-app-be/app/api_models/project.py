from typing import Optional

from pydantic import BaseModel


class ProjectBase(BaseModel):
    """Base model for project."""

    name: str
    description: Optional[str] = None


class ProjectType(BaseModel):
    """Model for project type."""

    id: int
    name: str


class ProjectResponse(ProjectBase):
    """Model for project response."""

    id: int
    type: ProjectType
