from pydantic import Field

from app.api_models.base import ApiBaseModel


class ArtistBase(ApiBaseModel):
    """Base model for artist."""

    name: str = Field(max_length=32)


class ArtistShortResponse(ArtistBase):
    """Model for artist response without description."""

    id: int


class ArtistResponse(ArtistShortResponse):
    """Model for artist response."""

    description: str | None = Field(default=None, max_length=255)
