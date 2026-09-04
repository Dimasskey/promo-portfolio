import time
import datetime
from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import ValidationException, HTTPException, RequestValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse


main = FastAPI(title='anix_promo_v2', docs_url=None, redoc_url=None)  #
main.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


main.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


@main.exception_handler(ValidationException)
async def validation_exception_handler(_, exc: ValidationException):
    return JSONResponse(
        status_code=400,
        content=jsonable_encoder({'result': False, 'message': exc.errors(), 'data': {}})
    )


@main.exception_handler(HTTPException)
def http_exception(_, exc: HTTPException):
    return JSONResponse(content=exc.detail, headers=exc.headers, status_code=exc.status_code)


@main.exception_handler(RequestValidationError)
def request_validation_error(_, exc: RequestValidationError):
    error_body = exc.errors()[0]
    try:
        message = f'{error_body["msg"]}: {error_body["type"]} - {error_body["loc"][1]}'
    except:
        message = f'{error_body["msg"]}: {error_body["type"]} - {error_body["loc"][0]}'
    return JSONResponse(content={'result': False, 'message': message, 'data': {}}, status_code=400)


@main.middleware("http")
async def before_request(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    response.headers["Cache-Control"] = 'no-cache, no-store, must-revalidate, max-age=0'
    response.headers["Pragma"] = 'no-cache'
    response.headers["Expires"] = '0'
    response.headers["Last-Modified"] = datetime.datetime.now().isoformat()
    return response


from main.views import views
from main.api import api_auth
from main.api import api_comment
from main.api import api_supplier
from main.api import api_user_gift
from main.api import api_check
