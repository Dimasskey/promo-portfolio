"""fix table suppliers

Revision ID: f43ced225e1d
Revises: 393d6518a5d3
Create Date: 2024-11-12 23:14:23.845733

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'f43ced225e1d'
down_revision: Union[str, None] = '393d6518a5d3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'suppliers',
        sa.Column(
            'logo_attachment_id',
            sa.UUID(as_uuid=False),
            server_default=sa.text("uuid('00000000-0000-0000-0000-000000000000')"),
            autoincrement=False,
            nullable=True
        )
    )


def downgrade() -> None:
    op.drop_column('suppliers', 'logo_attachment_id')
