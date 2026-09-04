from main.models.database import engine, UsersGifts, Gifts
from main.models.CRUD import CRUD
from main.models.session import SessionHandler
from main.schemas.user_gift import UserGiftRegular, GameRegular, GameUpdate
from main.schemas.gift import GiftRegular
from main.schemas.user import UserRegular
from fastapi import HTTPException


async def get_user_gift(user_id: str) -> GameRegular | dict:
    users_gifts = await CRUD(
        session=SessionHandler.create(engine=engine), model=UsersGifts
    ).extended_query(
        _select=[
            UsersGifts.game_1,
            UsersGifts.game_2,
            UsersGifts.game_3,
            UsersGifts.game_4,
            Gifts.id.label('gift_id'),
            Gifts.name.label('gift_name'),
            Gifts.about.label('gift_about'),
            Gifts.attachment_id.label('gift_attachment_id')
        ],
        _join=[
            [Gifts, Gifts.id == UsersGifts.gift_id]
        ],
        _where=[
            UsersGifts.user_id == user_id
        ],
        _group_by=[],
        _order_by=[],
        _all=False
    )

    if users_gifts is None:
        return dict()

    return GameRegular(
        game_1=UserGiftRegular(
            game_1=users_gifts.game_1,
            gift=GiftRegular(
                id=users_gifts.gift_id,
                name=users_gifts.gift_name,
                about=users_gifts.gift_about,
                attachment_id=users_gifts.gift_attachment_id
            ) if users_gifts.gift_id else None
        ),
        game_2=users_gifts.game_2,
        game_3=users_gifts.game_3,
        game_4=users_gifts.game_4
    )


async def create_user_gift(user_id: str) -> None:
    await CRUD(
        session=SessionHandler.create(engine=engine), model=UsersGifts
    ).create(
        _values=dict(user_id=user_id)
    )


async def get_count_user_gifts_by_name_gift(user_id: str) -> int:
    from sqlalchemy import func

    count_user_gifts_by_name_gift = await CRUD(
        session=SessionHandler.create(engine=engine), model=UsersGifts
    ).extended_query(
        _select=[func.count(UsersGifts.gift_id).label('count')],
        _join=[
            [Gifts, Gifts.id == UsersGifts.gift_id]
        ],
        _where=[
            UsersGifts.user_id == user_id,
            Gifts.name == '+ шаг'
        ],
        _group_by=[UsersGifts.user_id],
        _order_by=[],
        _all=False
    )

    return count_user_gifts_by_name_gift.count if count_user_gifts_by_name_gift else 0


async def update_user_gift(game: GameUpdate, user: UserRegular) -> dict:
    if game.game_1 is not False and user.count_steps >= 10:
        import random
        from main.utils.gift import get_gift
        random_gift = random.choice(await get_gift())

        await CRUD(
            session=SessionHandler.create(engine=engine), model=UsersGifts
        ).update(
            _where=[UsersGifts.user_id == user.token],
            _values=dict(gift_id=random_gift.id, game_1=game.game_1)
        )
        return {"message": "Успешно добавлен пользовательский подарок!", "data": random_gift}

    elif game.game_2 is not False and user.count_steps >= 20:
        await CRUD(
            session=SessionHandler.create(engine=engine), model=UsersGifts
        ).update(
            _where=[UsersGifts.user_id == user.token], _values=dict(game_2=game.game_2)
        )
        return {"message": "Урааа вы прошли 2 игру!", "data": {}}

    elif game.game_3 is not False and user.count_steps >= 30:
        await CRUD(
            session=SessionHandler.create(engine=engine), model=UsersGifts
        ).update(
            _where=[UsersGifts.user_id == user.token], _values=dict(game_3=game.game_3)
        )
        return {"message": "Урааа вы прошли 3 игру!", "data": {}}

    elif game.game_4 is not False and user.count_steps >= 40:
        await CRUD(
            session=SessionHandler.create(engine=engine), model=UsersGifts
        ).update(
            _where=[UsersGifts.user_id == user.token], _values=dict(game_4=game.game_4)
        )
        return {"message": "Урааа вы прошли 4 игру!", "data": {}}

    else:
        raise HTTPException(
            status_code=400,
            detail={
                "result": False,
                "message": "К сожалению, у вас недостаточно шагов, чтобы пройти эту игру!",
                "data": {}
            }
        )
