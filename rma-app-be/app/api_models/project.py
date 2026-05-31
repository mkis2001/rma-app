from typing import Optional

from pydantic import Field

from app.api_models.artist import ArtistShortResponse
from app.api_models.base import ApiBaseModel


class ProjectBase(ApiBaseModel):
    """Base model for project."""

    name: str = Field(max_length=32)


class ProjectTypeResponse(ApiBaseModel):
    """Model for project type."""

    id: int
    name: str


class ProjectResponseShort(ProjectBase):
    """Model for project response in short format."""

    id: int


class ProjectResponse(ProjectBase):
    """Model for project response."""

    id: int
    description: Optional[str] = Field(default=None, max_length=255)
    type: ProjectTypeResponse
    artist: ArtistShortResponse


class ProjectCreateRequest(ProjectBase):
    """Model for create project request."""

    type_id: int
    description: Optional[str] = Field(default=None, max_length=255)
    artist_id: int
