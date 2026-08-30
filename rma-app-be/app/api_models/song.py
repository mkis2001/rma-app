from typing import Optional

from pydantic import Field

from app.api_models.base import ApiBaseModel
from app.constants import NAME_MAX_LENGTH, NAME_MIN_LENGTH


class SongBase(ApiBaseModel):
    """Base model for a song."""

    name: str = Field(min_length=NAME_MIN_LENGTH, max_length=NAME_MAX_LENGTH)


class SongProject(ApiBaseModel):
    """Model for a song's project."""

    id: int
    name: str


class SongShortResponse(SongBase):
    """Model for song response without lyrics and project."""

    id: int


class SongResponse(SongShortResponse):
    """Model for song response."""

    lyrics: Optional[str] = Field(default=None, max_length=25000)
    project: SongProject


class SongCreateRequest(SongBase):
    """Model for create song request."""

    lyrics: Optional[str] = Field(default=None, max_length=25000)
    project_id: int


class SongUpdateRequest(ApiBaseModel):
    """Model for update song request."""

    name: Optional[str] = Field(
        default=None, min_length=NAME_MIN_LENGTH, max_length=NAME_MAX_LENGTH
    )
    lyrics: Optional[str] = Field(default=None, max_length=25000)
    project_id: Optional[int] = None
