from pydantic import BaseModel
from sqlalchemy import UUID
from datetime import datetime
from main.schemas.response import DefaultResponse


class CommentRegular(BaseModel):
    comment_text: str
    attachment_id: str | UUID | None = None
    datetime_create: str | datetime
    user_fio: str

    class Config:
        arbitrary_types_allowed = True


class CommentAdd(BaseModel):
    supplier_id: int
    comment_text: str
    attachment_id: str | UUID | None = None

    class Config:
        arbitrary_types_allowed = True


class CommentDefault(DefaultResponse):
    data: CommentRegular | list[CommentRegular] | list | None
