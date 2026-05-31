from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ApiBaseModel(BaseModel):
    """Base model for all pydantic models."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        serialization_alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,  # allows ORM objects to be passed directly
    )
