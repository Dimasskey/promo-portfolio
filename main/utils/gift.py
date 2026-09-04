from main.models.database import engine, Gifts
from main.models.CRUD import CRUD
from main.models.session import SessionHandler
from fastapi import HTTPException
from main.schemas.gift import GiftRegular


def serialize_gift(gift: Gifts) -> GiftRegular:
    return GiftRegular(
        id=gift.id,
        name=gift.name,
        about=gift.about,
        attachment_id=gift.attachment_id
    )


async def get_gift(
        gift_id: int | None = None,
        with_except: bool = False
) -> GiftRegular | tuple[GiftRegular] | None:

    where_ = []
    if gift_id is not None:
        where_.append(Gifts.id == gift_id)

    gifts: Gifts | list[Gifts] = await CRUD(
        session=SessionHandler.create(engine=engine), model=Gifts
    ).read(
        _where=where_, _all=gift_id is None
    )

    if gifts is None:
        if with_except:
            raise HTTPException(
                status_code=409,
                detail={"result": False, "message": "Подарок не найден!", "data": {}}
            )
        return None

    if gift_id is None:
        return tuple(serialize_gift(gift=gift) for gift in gifts)
    return serialize_gift(gift=gifts)
