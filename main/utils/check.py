from main.models.database import engine, Checks, Users
from main.models.CRUD import CRUD
from main.models.session import SessionHandler
from fastapi import HTTPException
from main.schemas.check import Check
from uuid import uuid4


async def get_check(
        code_check: str | None = None,
        with_except: bool = False
) -> Checks | None:

    where_ = []
    if code_check is not None:
        where_.append(Checks.code_check == code_check)

    check: Checks = await CRUD(
        session=SessionHandler.create(engine=engine), model=Checks
    ).read(
        _where=where_, _all=False
    )

    if check is None:
        if with_except:
            raise HTTPException(
                status_code=409,
                detail={"result": False, "message": "Чек не найден!", "data": {}}
            )
        return None
    return check


async def add_new_check(
        raw_code_check: str,
        code_check: str,
        amount: float,
        platform: str,
        code_shop: int,
        user_id: str | None = None,
        id_cassir: int | None = None,
        fio_cassir: str | None = None
) -> None:
    await CRUD(
        session=SessionHandler.create(engine=engine), model=Checks
    ).create(
        _values=dict(
            raw_code_check=raw_code_check,
            code_check=code_check,
            amount=amount,
            platform=platform,
            user_id=user_id,
            code_shop=code_shop,
            id_cassir=id_cassir,
            fio_cassir=fio_cassir,
            is_verified=True
        )
    )


async def update_check(
        code_check: str,
        user_id: str | None = None,
        id_cassir: str | None = None,
        fio_cassir: str | None = None
) -> None:
    if user_id is not None:
        values_ = dict(user_id=user_id)
    if id_cassir is not None:
        values_ = dict(id_cassir=id_cassir)
    if fio_cassir is not None:
        values_ = dict(fio_cassir=fio_cassir)

    await CRUD(
        session=SessionHandler.create(engine=engine), model=Checks
    ).update(
        _where=[Checks.code_check == code_check],
        _values=values_
    )


async def processed_check(checks: [Check], web: bool = False, header=None):
    from main.utils.validation import check_code_check, check_phone_number
    from main.utils.user import get_user

    for i in checks:
        code_check: dict | bool = check_code_check(i.code)
        if not code_check:
            if web:
                raise HTTPException(
                    status_code=400,
                    detail={"result": False, "message": "Код указан не корректно!", "data": {}}
                )
            else:
                continue

        id_cassir, fio_cassir = i.scode, i.sname
        if id_cassir is None or id_cassir == "" or id_cassir == "null":
            id_cassir = None
        if fio_cassir is None or fio_cassir == "" or fio_cassir == "null":
            fio_cassir = None

        if web:
            try:
                p = header.get('user-agent')
                p = p[:255] if len(p) > 255 else p
            except Exception as e:
                p = 'ERROR'
                print(f"ERROR: Нашёлся хитрец\n{e}")
        else:
            p = 'pos'

        phone: int | bool = check_phone_number(i.phone)
        if phone is False and web:
            raise HTTPException(
                status_code=400,
                detail={"result": False, "message": "Номер телефона указан не корректно!", "data": {}}
            )

        amount: float = float(code_check["amount"])
        if amount < 500:
            if web:
                raise HTTPException(
                    status_code=400,
                    detail={
                        "result": False,
                        "message": "Простите, но сумма чека меньше 500 руб, и мы не можем его зарегистрировать!",
                        "data": {}
                    }
                )
            else:
                continue

        code_shop = (int(code_check["code_check"].split('-')[0]) - 100000) // 100

        find_check = await get_check(code_check=code_check["code_check"], with_except=False)

        if phone is False and find_check is None:
            await add_new_check(
                raw_code_check=code_check["raw_code_check"],
                code_check=code_check["code_check"],
                amount=amount,
                platform=p,
                user_id=None,
                code_shop=code_shop,
                id_cassir=id_cassir,
                fio_cassir=fio_cassir
            )

            if web:
                raise HTTPException(
                    status_code=200,
                    detail={"result": True, "message": f"Вы успешно зарегистрировали чек!", "data": {}}
                )
            else:
                continue

        elif phone is not False and find_check is None:
            find_user = await get_user(phone_number=phone, with_except=False)

            if find_user is None:
                new_token = str(uuid4())
                await CRUD(
                    session=SessionHandler.create(engine=engine), model=Users
                ).create(
                    _values=dict(
                        id=new_token,
                        fio=None,
                        phone_number=phone
                    )
                )

                await add_new_check(
                    raw_code_check=code_check["raw_code_check"],
                    code_check=code_check["code_check"],
                    amount=amount,
                    platform=p,
                    user_id=new_token,
                    code_shop=code_shop,
                    id_cassir=id_cassir,
                    fio_cassir=fio_cassir
                )

                if web:
                    raise HTTPException(
                        status_code=200,
                        detail={
                            "result": True,
                            "message": f"Вы успешно зарегистрировали чек!",
                            "data": {}
                        }
                    )
                else:
                    continue

            else:
                await add_new_check(
                    raw_code_check=code_check["raw_code_check"],
                    code_check=code_check["code_check"],
                    amount=amount,
                    platform=p,
                    user_id=find_user.id,
                    code_shop=code_shop,
                    id_cassir=id_cassir,
                    fio_cassir=fio_cassir
                )

                if web:
                    raise HTTPException(
                        status_code=200,
                        detail={
                            "result": True,
                            "message": f"Вы успешно зарегистрировали чек!",
                            "data": {}
                        }
                    )
                else:
                    continue

        elif phone is not False and find_check is not None:
            find_user = await get_user(phone_number=phone, with_except=False)

            if find_check.user_id is None:
                if find_user is None:
                    new_token = str(uuid4())
                    await CRUD(
                        session=SessionHandler.create(engine=engine), model=Users
                    ).create(
                        _values=dict(
                            id=new_token,
                            fio=None,
                            phone_number=phone
                        )
                    )

                    await update_check(code_check=code_check["code_check"], user_id=new_token)

                    if find_check.id_cassir is None and id_cassir is not None:
                        await update_check(code_check=code_check["code_check"], id_cassir=str(id_cassir))

                    if find_check.fio_cassir is None and fio_cassir is not None:
                        await update_check(code_check=code_check["code_check"], fio_cassir=fio_cassir)

                    if web:
                        raise HTTPException(
                            status_code=200,
                            detail={
                                "result": True,
                                "message": f"Вы успешно зарегистрировали чек!",
                                "data": {}
                            }
                        )
                    else:
                        continue

                else:
                    await update_check(code_check=code_check["code_check"], user_id=find_user.id)

                    if find_check.id_cassir is None and id_cassir is not None:
                        await update_check(code_check=code_check["code_check"], id_cassir=str(id_cassir))

                    if find_check.fio_cassir is None and fio_cassir is not None:
                        await update_check(code_check=code_check["code_check"], fio_cassir=fio_cassir)

                    if web:
                        raise HTTPException(
                            status_code=200,
                            detail={
                                "result": True,
                                "message": f"Вы успешно зарегистрировали чек!",
                                "data": {}
                            }
                        )
                    else:
                        continue

            else:
                if find_check.id_cassir is None and id_cassir is not None:
                    await update_check(code_check=code_check["code_check"], id_cassir=str(id_cassir))

                if find_check.fio_cassir is None and fio_cassir is not None:
                    await update_check(code_check=code_check["code_check"], fio_cassir=fio_cassir)

                if web:
                    exist_user: Users = await get_user(user_id=find_check.user_id)

                    raise HTTPException(
                        status_code=400,
                        detail={
                            "result": False,
                            "message": f"Чек зарегистрирован на номер 8-***-***-{str(exist_user.phone_number)[-4:]}",
                            "data": {}
                        }
                    )
                else:
                    continue

        elif phone is False and find_check is not None:
            if find_check.id_cassir is None and id_cassir is not None:
                await update_check(code_check=code_check["code_check"], id_cassir=str(id_cassir))

            if find_check.fio_cassir is None and fio_cassir is not None:
                await update_check(code_check=code_check["code_check"], fio_cassir=fio_cassir)

            if web:
                raise HTTPException(
                    status_code=200,
                    detail={"result": True, "message": f"Вы успешно зарегистрировали чек!", "data": {}}
                )
            else:
                continue

        else:
            print("Это конец или что?")
