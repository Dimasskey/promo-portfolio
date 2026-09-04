from pydantic import BaseModel
from sqlalchemy import UUID
from main.schemas.response import DefaultResponse


class SupplierRegular(BaseModel):
    id: int
    name: str
    about: str
    attachment_id: str | UUID | None = None
    logo_attachment_id: str | UUID | None = None

    class Config:
        arbitrary_types_allowed = True


class SupplierDefault(DefaultResponse):
    data: SupplierRegular | list[SupplierRegular] | list | None
