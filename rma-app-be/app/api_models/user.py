import uuid

from pydantic import Field

from app.api_models.base import ApiBaseModel
from app.constants import USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH


class UserBase(ApiBaseModel):
    """Base model for user profile."""

    id: uuid.UUID
    username: str = Field(
        min_length=USERNAME_MIN_LENGTH, max_length=USERNAME_MAX_LENGTH, pattern=r"^\w+$"
    )


class UserResponse(UserBase):
    """Model for user profile response."""

    pass


class UserCreateRequest(UserBase):
    """Model for creating a new user."""

    pass
