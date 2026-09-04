from sqlalchemy import Column, ForeignKey, BigInteger, SmallInteger, Float, String, DateTime, \
    Text, Boolean, func, text, UUID
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncAttrs, create_async_engine
import main.config as config


class Base(AsyncAttrs, DeclarativeBase):
    pass


class Users(Base):
    __tablename__ = 'users'
    id = Column(
        UUID(as_uuid=False),
        primary_key=True,
        server_default=text('uuid_generate_v4()'),
        unique=True,
        nullable=False,
        index=True
    )
    fio = Column(String(length=255), nullable=True)
    phone_number = Column(BigInteger, nullable=False, unique=True, index=True)
    datetime_create = Column(
        DateTime,
        default=func.now(),
        server_default=text('(now() AT TIME ZONE \'Asia/Novosibirsk\')'),
        nullable=False,
        index=True
    )


class Checks(Base):
    __tablename__ = 'checks'
    id = Column(BigInteger, primary_key=True)
    raw_code_check = Column(String(length=255), nullable=False, unique=True)
    code_check = Column(String(length=255), nullable=False, unique=True, index=True)
    amount = Column(Float, nullable=False)
    datetime_create = Column(
        DateTime,
        default=func.now(),
        server_default=text('(now() AT TIME ZONE \'Asia/Novosibirsk\')'),
        nullable=False,
        index=True
    )
    platform = Column(String(length=255), nullable=True)
    user_id = Column(UUID, ForeignKey(Users.id), nullable=True, index=True)
    code_shop = Column(BigInteger, nullable=True)
    id_cassir = Column(String(length=255), nullable=True)
    fio_cassir = Column(String(length=255), nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False, server_default=text('False'))


class Suppliers(Base):
    __tablename__ = 'suppliers'
    id = Column(BigInteger, primary_key=True)
    name = Column(String(length=255), nullable=False)
    about = Column(Text, nullable=False)
    attachment_id = Column(
        UUID(as_uuid=False),
        nullable=True,
        server_default=text('uuid(\'00000000-0000-0000-0000-000000000000\')'),
        autoincrement=False,
        default='00000000-0000-0000-0000-000000000000'
    )
    logo_attachment_id = Column(
        UUID(as_uuid=False),
        nullable=True,
        server_default=text('uuid(\'00000000-0000-0000-0000-000000000000\')'),
        autoincrement=False,
        default='00000000-0000-0000-0000-000000000000'
    )


class Comments(Base):
    __tablename__ = 'comments'
    id = Column(BigInteger, primary_key=True)
    user_id = Column(UUID, ForeignKey(Users.id), nullable=False)
    supplier_id = Column(BigInteger, ForeignKey(Suppliers.id), nullable=False)
    attachment_id = Column(
        UUID(as_uuid=False),
        nullable=True,
        server_default=text('uuid(\'00000000-0000-0000-0000-000000000000\')'),
        autoincrement=False,
        default='00000000-0000-0000-0000-000000000000'
    )
    comment = Column(Text, nullable=False)
    datetime_create = Column(
        DateTime,
        default=func.now(),
        server_default=text('(now() AT TIME ZONE \'Asia/Novosibirsk\')'),
        nullable=False,
        index=True
    )
    delete = Column(Boolean, default=False, nullable=False, server_default=text('False'))


class Gifts(Base):
    __tablename__ = 'gifts'
    id = Column(BigInteger, primary_key=True)
    name = Column(String(length=255), nullable=False)
    about = Column(Text, nullable=False)
    attachment_id = Column(
        UUID(as_uuid=False),
        nullable=True,
        server_default=text('uuid(\'00000000-0000-0000-0000-000000000000\')'),
        autoincrement=False,
        default='00000000-0000-0000-0000-000000000000'
    )


class UsersGifts(Base):
    __tablename__ = 'users_gifts'
    id = Column(BigInteger, primary_key=True)
    user_id = Column(UUID, ForeignKey(Users.id), nullable=False)
    gift_id = Column(BigInteger, ForeignKey(Gifts.id), nullable=True)
    game_1 = Column(Boolean, default=False, nullable=False, server_default=text('False'))
    game_2 = Column(Boolean, default=False, nullable=False, server_default=text('False'))
    game_3 = Column(Boolean, default=False, nullable=False, server_default=text('False'))
    game_4 = Column(Boolean, default=False, nullable=False, server_default=text('False'))


# alembic init -t async web/alembic
# alembic revision --autogenerate -m "Init Alembic"
# alembic upgrade head
# op.execute('CREATE EXTENSION "uuid-ossp"')


engine = create_async_engine(
    f'postgresql+asyncpg://{config.DATABASE_USER}'
    f':{config.DATABASE_PASSWORD}'
    f'@{config.DATABASE_IP}:{config.DATABASE_PORT}'
    f'/{config.DATABASE_NAME}',
    echo=False,
    pool_recycle=300,
    query_cache_size=0,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=2,
    pool_use_lifo=True
)
