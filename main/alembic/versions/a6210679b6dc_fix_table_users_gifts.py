"""fix table users_gifts

Revision ID: a6210679b6dc
Revises: 73bb46b836ac
Create Date: 2024-11-04 15:25:44.507442

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a6210679b6dc'
down_revision: Union[str, None] = '73bb46b836ac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('users_gifts', 'gift_id', existing_type=sa.BIGINT(), nullable=True)


def downgrade() -> None:
    op.alter_column('users_gifts', 'gift_id', existing_type=sa.BIGINT(), nullable=False)
