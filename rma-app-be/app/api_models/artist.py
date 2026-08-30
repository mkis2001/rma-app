import uuid
from typing import Optional

from pydantic import Field

from app.api_models.base import ApiBaseModel
from app.api_models.user import UserBase
from app.constants import (
    DESCRIPTION_MAX_LENGTH,
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
)


class ArtistBase(ApiBaseModel):
    """Base model for artist."""

    name: str = Field(min_length=NAME_MIN_LENGTH, max_length=NAME_MAX_LENGTH)


class ArtistShortResponse(ArtistBase):
    """Model for artist response without description."""

    id: int


class ArtistResponse(ArtistShortResponse):
    """Model for artist response."""

    description: str | None = Field(default=None, max_length=DESCRIPTION_MAX_LENGTH)
    users: Optional[list[UserBase]] = Field(default_factory=list)


class ArtistCreateRequest(ApiBaseModel):
    """Model for creating an artist."""

    name: str = Field(min_length=NAME_MIN_LENGTH, max_length=NAME_MAX_LENGTH)
    description: str | None = Field(default=None, max_length=DESCRIPTION_MAX_LENGTH)


class ArtistUpdateRequest(ApiBaseModel):
    """Model for updating an artist."""

    name: Optional[str] = Field(
        default=None, min_length=NAME_MIN_LENGTH, max_length=NAME_MAX_LENGTH
    )
    description: Optional[str] = Field(default=None, max_length=DESCRIPTION_MAX_LENGTH)


class ArtistAddUserRequest(ApiBaseModel):
    """Model for adding a user to an artist."""

    user_id: uuid.UUID
