from typing import Optional

from pydantic import Field

from app.api_models.base import ApiBaseModel
from app.api_models.user import UserBase
from app.constants import (
    DESCRIPTION_MAX_LENGTH,
    NAME_MAX_LENGTH,
)


class ArtistBase(ApiBaseModel):
    """Base model for artist."""

    name: str = Field(max_length=NAME_MAX_LENGTH)


class ArtistShortResponse(ArtistBase):
    """Model for artist response without description."""

    id: int


class ArtistResponse(ArtistShortResponse):
    """Model for artist response."""

    description: str | None = Field(default=None, max_length=DESCRIPTION_MAX_LENGTH)
    users: Optional[list[UserBase]] = Field(default_factory=list)
