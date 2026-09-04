"""Init Alembic

Revision ID: 4886cc898196
Revises: 
Create Date: 2024-11-02 20:45:40.271703

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '4886cc898196'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION "uuid-ossp"')
    op.create_table(
        'suppliers',
        sa.Column('id', sa.BigInteger(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('about', sa.Text(), nullable=False),
        sa.Column(
            'attachment_id',
            sa.UUID(as_uuid=False),
            server_default=sa.text("uuid('00000000-0000-0000-0000-000000000000')"),
            autoincrement=False,
            nullable=True
        ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table(
        'users',
        sa.Column(
            'id',
            sa.UUID(as_uuid=False),
            server_default=sa.text('uuid_generate_v4()'),
            nullable=False
        ),
        sa.Column('fio', sa.String(length=255), nullable=True),
        sa.Column('phone_number', sa.BigInteger(), nullable=False),
        sa.Column(
            'datetime_create',
            sa.DateTime(),
            server_default=sa.text("(now() AT TIME ZONE 'Asia/Novosibirsk')"),
            nullable=False
        ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_datetime_create'), 'users', ['datetime_create'], unique=False)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=True)
    op.create_index(op.f('ix_users_phone_number'), 'users', ['phone_number'], unique=True)
    op.create_table(
        'checks',
        sa.Column('id', sa.BigInteger(), nullable=False),
        sa.Column('raw_code_check', sa.String(length=255), nullable=False),
        sa.Column('code_check', sa.String(length=255), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column(
            'datetime_create',
            sa.DateTime(),
            server_default=sa.text("(now() AT TIME ZONE 'Asia/Novosibirsk')"),
            nullable=False
        ),
        sa.Column('platform', sa.String(length=255), nullable=True),
        sa.Column('user_id', sa.UUID(), nullable=True),
        sa.Column('code_shop', sa.BigInteger(), nullable=True),
        sa.Column('id_cassir', sa.String(length=255), nullable=True),
        sa.Column('fio_cassir', sa.String(length=255), nullable=True),
        sa.Column('is_verified', sa.Boolean(), server_default=sa.text('False'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('raw_code_check')
    )
    op.create_index(op.f('ix_checks_code_check'), 'checks', ['code_check'], unique=True)
    op.create_index(op.f('ix_checks_datetime_create'), 'checks', ['datetime_create'], unique=False)
    op.create_index(op.f('ix_checks_user_id'), 'checks', ['user_id'], unique=False)
    op.create_table(
        'comments',
        sa.Column('id', sa.BigInteger(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('supplier_id', sa.BigInteger(), nullable=False),
        sa.Column(
            'attachment_id',
            sa.UUID(as_uuid=False),
            server_default=sa.text("uuid('00000000-0000-0000-0000-000000000000')"),
            autoincrement=False,
            nullable=True
        ),
        sa.Column('comment', sa.Text(), nullable=False),
        sa.Column(
            'datetime_create',
            sa.DateTime(),
            server_default=sa.text("(now() AT TIME ZONE 'Asia/Novosibirsk')"),
            nullable=False
        ),
        sa.Column('delete', sa.Boolean(), server_default=sa.text('False'), nullable=False),
        sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_comments_datetime_create'), 'comments', ['datetime_create'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_comments_datetime_create'), table_name='comments')
    op.drop_table('comments')
    op.drop_index(op.f('ix_checks_user_id'), table_name='checks')
    op.drop_index(op.f('ix_checks_datetime_create'), table_name='checks')
    op.drop_index(op.f('ix_checks_code_check'), table_name='checks')
    op.drop_table('checks')
    op.drop_index(op.f('ix_users_phone_number'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_datetime_create'), table_name='users')
    op.drop_table('users')
    op.drop_table('suppliers')
