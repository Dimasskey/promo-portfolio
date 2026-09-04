from pydantic import BaseModel, field_validator
from fastapi.exceptions import HTTPException


class Check(BaseModel):
    code: str
    scode: str | int | None = None
    sname: str | None = None
    phone: str


class UploadCheck(BaseModel):
    checks: list[Check]
    sender_type: str

    @field_validator('sender_type')
    def validate_sender_type(cls, sender_type: str):
        if sender_type not in ['pos', 'web']:
            raise HTTPException(
                status_code=400,
                detail={"result": False, "message": "Аргументы переданы не корректно!", "data": {}}
            )
