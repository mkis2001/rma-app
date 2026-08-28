from pydantic import Field

from app.api_models.base import ApiBaseModel
from app.constants import NAME_MAX_LENGTH


class SongFileResponse(ApiBaseModel):
    """Response model for a song file."""

    id: int
    name: str = Field(max_length=NAME_MAX_LENGTH)
    song_id: int
    path: str
    mime_type: str
