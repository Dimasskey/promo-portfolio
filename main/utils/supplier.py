from main.models.database import engine, Suppliers
from main.models.CRUD import CRUD
from main.models.session import SessionHandler
from fastapi import HTTPException
from main.schemas.supplier import SupplierRegular


def serialize_supplier(supplier: Suppliers) -> SupplierRegular:
    return SupplierRegular(
        id=supplier.id,
        name=supplier.name,
        about=supplier.about,
        attachment_id=supplier.attachment_id,
        logo_attachment_id=supplier.logo_attachment_id
    )


async def get_supplier(
        supplier_id: int | None = None,
        with_except: bool = False
) -> SupplierRegular | None:

    where_ = []
    if supplier_id is not None:
        where_.append(Suppliers.id == supplier_id)

    supplier: Suppliers = await CRUD(
        session=SessionHandler.create(engine=engine), model=Suppliers
    ).read(
        _where=where_, _all=supplier_id is None
    )

    if supplier is None:
        if with_except:
            raise HTTPException(
                status_code=409,
                detail={"result": False, "message": "Поставщик не найден!", "data": {}}
            )
        return None
    return serialize_supplier(supplier=supplier)
