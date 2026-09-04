"""fix 2 table users_gifts

Revision ID: 393d6518a5d3
Revises: a6210679b6dc
Create Date: 2024-11-08 17:07:51.077958

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '393d6518a5d3'
down_revision: Union[str, None] = 'a6210679b6dc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users_gifts', sa.Column('game_1', sa.Boolean(), server_default=sa.text('False'), nullable=False))
    op.add_column('users_gifts', sa.Column('game_2', sa.Boolean(), server_default=sa.text('False'), nullable=False))
    op.add_column('users_gifts', sa.Column('game_3', sa.Boolean(), server_default=sa.text('False'), nullable=False))
    op.add_column('users_gifts', sa.Column('game_4', sa.Boolean(), server_default=sa.text('False'), nullable=False))
    op.drop_column('users_gifts', 'game_number')


def downgrade() -> None:
    op.add_column('users_gifts', sa.Column('game_number', sa.SMALLINT(), autoincrement=False, nullable=False))
    op.drop_column('users_gifts', 'game_4')
    op.drop_column('users_gifts', 'game_3')
    op.drop_column('users_gifts', 'game_2')
    op.drop_column('users_gifts', 'game_1')
