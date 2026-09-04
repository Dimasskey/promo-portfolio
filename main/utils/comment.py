from main.models.database import engine, Comments, Users
from main.models.CRUD import CRUD
from main.models.session import SessionHandler
from main.schemas.comment import CommentRegular, CommentAdd
from main.schemas.user import UserRegular
from fastapi import HTTPException


async def get_comments(supplier_id: int) -> tuple[CommentRegular] | tuple:
    from sqlalchemy import desc

    comments = await CRUD(
        session=SessionHandler.create(engine=engine), model=Comments
    ).extended_query(
        _select=[
            Comments.comment,
            Comments.attachment_id,
            Comments.datetime_create,
            Users.fio.label('user_fio')
        ],
        _join=[
            [Users, Users.id == Comments.user_id]
        ],
        _where=[
            Comments.delete == False,
            Comments.supplier_id == supplier_id
        ],
        _group_by=[],
        _order_by=[desc(Comments.datetime_create)],
        _all=True
    )

    if comments is None:
        return tuple()

    results = []
    for x in comments:
        results.append(
            CommentRegular(
                comment_text=x.comment,
                attachment_id=x.attachment_id,
                datetime_create=x.datetime_create.strftime('%Y-%m-%d %H:%M'),
                user_fio=x.user_fio
            )
        )

    return tuple(results)


async def add_comment(comment: CommentAdd, user: UserRegular) -> str:
    if user.fio is None:
        raise HTTPException(
            status_code=409,
            detail={"result": False, "message": "Вы не можете оставить комментарий без своего полного ФИО!", "data": {}}
        )

    await CRUD(
        session=SessionHandler.create(engine=engine), model=Comments
    ).create(
        _values=dict(
            user_id=user.token,
            supplier_id=comment.supplier_id,
            attachment_id=comment.attachment_id,
            comment=comment.comment_text
        )
    )

    return "Комментарий был успешно добавлен!"
