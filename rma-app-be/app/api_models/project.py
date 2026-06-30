from typing import Optional

from pydantic import Field

from app.api_models.artist import ArtistShortResponse
from app.api_models.base import ApiBaseModel
from app.constants import (
    DESCRIPTION_MAX_LENGTH,
    NAME_MAX_LENGTH,
)


class ProjectBase(ApiBaseModel):
    """Base model for project."""

    name: str = Field(max_length=NAME_MAX_LENGTH)


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
    description: Optional[str] = Field(default=None, max_length=DESCRIPTION_MAX_LENGTH)
    type: ProjectTypeResponse
    artist: ArtistShortResponse


class ProjectCreateRequest(ProjectBase):
    """Model for create project request."""

    type_id: int
    description: Optional[str] = Field(default=None, max_length=DESCRIPTION_MAX_LENGTH)
    artist_id: int
