from pydantic import BaseModel
from main.schemas.gift import GiftRegular


class UserGiftRegular(BaseModel):
    game_1: bool
    gift: GiftRegular | None = None


class GameUpdate(BaseModel):
    game_1: bool = False
    game_2: bool = False
    game_3: bool = False
    game_4: bool = False


class GameRegular(BaseModel):
    game_1: UserGiftRegular
    game_2: bool
    game_3: bool
    game_4: bool
