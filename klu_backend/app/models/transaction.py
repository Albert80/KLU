import uuid

from app.db.session import Base
from sqlalchemy import Column, DateTime, Float, String, func
from sqlalchemy.dialects.postgresql import UUID


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_name = Column(String, nullable=False)
    status = Column(
        String, nullable=False, default="pending"
    )  # pending/completed/failed
    blumonpay_transaction_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Índices para búsquedas frecuentes
    __table_args__ = (
        # Índice para búsquedas por status
        {"sqlite_autoincrement": True},
    )
