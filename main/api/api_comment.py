from main import main
from fastapi import Depends
from main.schemas.response import DefaultResponse
from main.schemas.comment import CommentAdd, CommentDefault
from main.utils.user import get_current_user


@main.get('/api/comments', status_code=200, tags=["Comments"], response_model=CommentDefault)
async def api_get_comments(supplier_id: int):
    from main.utils.comment import get_comments
    return CommentDefault(data=await get_comments(supplier_id=supplier_id))


@main.post('/api/comments', status_code=200, tags=["Comments"], response_model=DefaultResponse)
async def api_add_comment(comment: CommentAdd, user=Depends(get_current_user)):
    from main.utils.comment import add_comment
    return DefaultResponse(message=await add_comment(comment=comment, user=user))
