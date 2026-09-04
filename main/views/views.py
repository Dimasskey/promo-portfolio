from main import main, templates
from fastapi import Request
from fastapi.responses import HTMLResponse


@main.get("/", status_code=200, tags=["Views"], response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", context={"request": request})


@main.get("/login", status_code=200, tags=["Views"], response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", context={"request": request})


@main.get('/api/add_code_from_qr', status_code=200, tags=["Views"], response_class=HTMLResponse)
def add_code_from_qr(request: Request, qr: str | None = None):
    if qr is None or qr == "":
        return templates.TemplateResponse("index.html", context={"request": request})
    return templates.TemplateResponse("login.html", context={"request": request})


@main.get("/gifts", status_code=200, tags=["Views"], response_class=HTMLResponse)
async def gifts(request: Request):
    return templates.TemplateResponse("prizesPage.html", context={"request": request})


@main.get("/stage_two", status_code=200, tags=["Views"], response_class=HTMLResponse)
async def stage_two(request: Request):
    return templates.TemplateResponse("gameStageTwo.html", context={"request": request})


@main.get("/suppliers", status_code=200, tags=["Views"], response_class=HTMLResponse)
async def suppliers(request: Request):
    return templates.TemplateResponse("supplierPage.html", context={"request": request})


@main.get("/conditions", status_code=200, tags=["Views"], response_class=HTMLResponse)
async def conditions(request: Request):
    return templates.TemplateResponse("conditions.html", context={"request": request})


@main.get("/winners", status_code=200, tags=["Views"], response_class=HTMLResponse)
async def winners(request: Request):
    return templates.TemplateResponse("winners.html", context={"request": request})


@main.get(
    '/add_user_0JzQvtGH0LAg0YHRitC10LvQsCDQs9C+0LLQvdC+',
    status_code=200,
    tags=["Views"],
    response_class=HTMLResponse
)
def shop_add_user(request: Request):
    return templates.TemplateResponse('add_user.html', context={"request": request})


@main.get(
    '/check_code_check_0JzQvtGH0LAg0YHRitC10LvQsCDQs9C+0LLQvdC+',
    status_code=200,
    tags=["Views"],
    response_class=HTMLResponse
)
def check_code_check_web(request: Request):
    return templates.TemplateResponse('check_code.html', context={"request": request})

