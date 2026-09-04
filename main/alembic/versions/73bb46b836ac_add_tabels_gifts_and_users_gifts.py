"""add tabels gifts and users_gifts

Revision ID: 73bb46b836ac
Revises: 4886cc898196
Create Date: 2024-11-03 18:17:29.797604

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '73bb46b836ac'
down_revision: Union[str, None] = '4886cc898196'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'gifts',
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
        'users_gifts',
        sa.Column('id', sa.BigInteger(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('gift_id', sa.BigInteger(), nullable=False),
        sa.Column('game_number', sa.SmallInteger(), nullable=False),
        sa.ForeignKeyConstraint(['gift_id'], ['gifts.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('users_gifts')
    op.drop_table('gifts')
