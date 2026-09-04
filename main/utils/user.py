from fastapi import HTTPException, Header
from main.models.database import engine, Users, UsersGifts, Checks
from main.models.CRUD import CRUD
from main.models.session import SessionHandler
from main.schemas.user import UserSignUp, UserRegular, UserLogin, CustomUser
from main.utils.user_gift import create_user_gift


async def get_user(
        user_id: str | None = None,
        phone_number: int | None = None,
        with_except: bool = False
) -> Users | None:

    where_ = []
    if user_id is not None:
        where_.append(Users.id == user_id)
    if phone_number is not None:
        where_.append(Users.phone_number == phone_number)

    user: Users = await CRUD(
        session=SessionHandler.create(engine=engine), model=Users
    ).read(
        _where=where_, _all=False
    )

    if user is None:
        if with_except:
            raise HTTPException(
                status_code=409,
                detail={"result": False, "message": "Пользователь не найден!", "data": {}}
            )
        return None
    return user


async def create_new_user(user: UserSignUp) -> Users:
    if await get_user(phone_number=user.phone_number, with_except=False):
        raise HTTPException(
            status_code=409,
            detail={"result": False, "message": "Пользователь с таким номером телефона уже зарегистрирован!", "data": {}}
        )

    await CRUD(
        session=SessionHandler.create(engine=engine), model=Users
    ).create(
        _values=user.model_dump()
    )

    return await get_user(phone_number=user.phone_number, with_except=False)


async def get_signup_user(user: UserSignUp) -> dict:
    new_user = await create_new_user(user=user)
    await create_user_gift(user_id=str(new_user.id))
    return {'message': 'Вы успешно зарегистрировались!', 'data': {'token': str(new_user.id)}}


async def get_login_user(user: UserLogin) -> dict:
    user = await get_user(phone_number=user.phone_number, with_except=False)
    if not user:
        raise HTTPException(
            status_code=409,
            detail={"result": False, "message": "Пользователь с таким номером телефона не найден!", "data": {}}
        )

    find_user_gift: UsersGifts = await CRUD(
        session=SessionHandler.create(engine=engine), model=UsersGifts
    ).read(
        _where=[UsersGifts.user_id == str(user.id)], _all=False
    )

    if not find_user_gift:
        await create_user_gift(user_id=str(user.id))

    return {'message': 'Вы успешно авторизовались!', 'data': {'token': str(user.id)}}


async def get_current_user(token: str = Header(default=None)) -> UserRegular:
    if token is None:
        raise HTTPException(
            status_code=401,
            detail={"result": False, "message": "Пожалуйста, авторизуйтесь на сайте!", "data": {}}
        )

    user = await get_user(user_id=token, with_except=False)
    if user:
        from main.utils.user_gift import get_user_gift, get_count_user_gifts_by_name_gift
        return UserRegular(
            token=user.id,
            fio=user.fio,
            phone_number=user.phone_number,
            count_steps=int(
                await get_count_steps_user(user_id=user.id) + await get_count_user_gifts_by_name_gift(user_id=user.id)
            ),
            games=await get_user_gift(user_id=user.id)
        )
    else:
        raise HTTPException(
            status_code=401,
            detail={"result": False, "message": "Ваш токен истек, авторизуйтесь на сайте еще раз!", "data": {}}
        )


async def add_user_fio(fio: str, token: str) -> str:
    from main.utils.validation import check_fio
    fio_ = check_fio(fio_=fio)
    if not fio_ or len(fio_.split()) > 3:
        raise HTTPException(
            status_code=400,
            detail={"result": False, "message": "Поле «ФИО» введено некорректно!", "data": {}}
        )

    user = await get_user(user_id=token, with_except=False)
    if user.fio is not None:
        raise HTTPException(
            status_code=409,
            detail={"result": False, "message": "Вы уже указали свое полное ФИО!", "data": {}}
        )

    await CRUD(
        session=SessionHandler.create(engine=engine), model=Users
    ).update(
        _where=[Users.id == token], _values=dict(fio=fio_)
    )

    return 'Вы успешно добавили свое ФИО!'


async def get_count_steps_user(user_id: str) -> int:
    from sqlalchemy import func

    count_steps = await CRUD(
        session=SessionHandler.create(engine=engine), model=Checks
    ).extended_query(
        _select=[func.sum(Checks.amount).label('sum')],
        _join=[],
        _where=[Checks.user_id == user_id],
        _group_by=[Checks.user_id],
        _order_by=[],
        _all=False
    )

    return count_steps.sum // 500 if count_steps else 0


async def add_custom_user(custom_user: CustomUser):
    if custom_user.sum < 500:
        raise HTTPException(
            status_code=400,
            detail={"result": False, "message": '"Sum check" is lower 500 rub', "data": {}}
        )

    user: Users = await get_user(phone_number=custom_user.phone, with_except=False)

    check: Checks = await CRUD(
        session=SessionHandler.create(engine=engine), model=Checks
    ).read(
        _where=[Checks.code_check == f'tornado-{custom_user.order_id}']
    )

    if user is None:
        if check is None:
            new_user: Users = await CRUD(
                session=SessionHandler.create(engine=engine), model=Users
            ).create(
                _values=dict(fio=None, phone_number=custom_user.phone)
            )

            await CRUD(
                session=SessionHandler.create(engine=engine), model=Checks
            ).create(
                _values=dict(
                    raw_code_check=f'tornado-{custom_user.order_id}',
                    code_check=f'tornado-{custom_user.order_id}',
                    amount=custom_user.sum,
                    platform='web',
                    user_id=new_user.id
                )
            )
        else:
            raise HTTPException(
                status_code=409,
                detail={"result": False, "message": 'This OrderID already exists', "data": {}}
            )
    else:
        if check is None:
            await CRUD(
                session=SessionHandler.create(engine=engine), model=Checks
            ).create(
                _values=dict(
                    raw_code_check=f'tornado-{custom_user.order_id}',
                    code_check=f'tornado-{custom_user.order_id}',
                    amount=custom_user.sum,
                    platform='web',
                    user_id=user.id
                )
            )
        else:
            raise HTTPException(
                status_code=409,
                detail={"result": False, "message": 'This OrderID already exists', "data": {}}
            )

