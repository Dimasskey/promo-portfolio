import redis
from rq import Queue
from main import main
from fastapi import Request
from main.schemas.check import UploadCheck
from main.schemas.response import DefaultResponse
from main.utils.check import processed_check


@main.post('/api/add_code', status_code=200, tags=["Checks"], response_model=DefaultResponse)
async def api_add_code(upload_check: UploadCheck):
    try:
        q = Queue(name='anix_promo', connection=redis.Redis(), default_timeout=600)
        q.enqueue(processed_check, args=(upload_check.checks, False, None,))
        # await processed_check(checks=upload_check.checks, web=False, header=None)
        return DefaultResponse()
    except Exception as e:
        print(f"ERROR: {e}")
        return DefaultResponse(result=False, message="Аргументы переданы не корректно!", data={})


@main.post('/api/add_code_web', status_code=200, tags=["Checks"], response_model=DefaultResponse)
async def api_add_code_web(upload_check: UploadCheck, request: Request):
    await processed_check(checks=upload_check.checks, web=True, header=request.headers)
    return DefaultResponse()


@main.get('/api/check_code_check', status_code=200, tags=["Checks"], response_model=DefaultResponse)
async def api_check_code_check(code_check: str):
    from main.models.CRUD import CRUD
    from main.models.session import SessionHandler
    from main.models.database import engine, Checks, Users
    from fastapi import HTTPException
    from main.utils.validation import check_code_check

    code_check_ = check_code_check(code_check)
    if not code_check_:
        raise HTTPException(
            status_code=400,
            detail={"result": False, "message": 'Код чека указан не корректно', "data": {}}
        )
    code_check_ = code_check_['code_check']

    check: Checks = await CRUD(
        session=SessionHandler.create(engine=engine), model=Checks
    ).read(
        _where=[Checks.code_check == code_check_], _all=False
    )
    if check is None:
        return DefaultResponse(
            message="Данного чека нет в базе, получается человек может спокойно его зарегистрировать"
        )

    if check.user_id is None:
        return DefaultResponse(
            message=f'Данный чек в базе есть, он добавлен в {check.datetime_create}, но не за кем не закреплён, '
                    f'Так что человек может спокойно его зарегистрировать'
        )
    else:
        find_user: Users = await CRUD(
            session=SessionHandler.create(engine=engine), model=Users
        ).read(_where=[Users.id == check.user_id], _all=False)

        return DefaultResponse(
            message=f'Данный чек в базе есть, он добавлен в {check.datetime_create} и закреплён '
                    f'за пользователем с ФИО - '
                    f'{find_user.fio if find_user.fio is not None else "--ФИО не указано--"} и '
                    f'номером телефона - {find_user.phone_number}, данный пользователь был зарегистрирован - '
                    f'{find_user.datetime_create}.'
                    f'Так что данный чек уже не получиться зарегистрировать'
        )

