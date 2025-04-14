import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class TransactionBase(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str = Field(..., min_length=3, max_length=3)
    customer_email: EmailStr
    customer_name: str = Field(..., min_length=2)


class TransactionCreate(TransactionBase):
    pass


class CardInfo(BaseModel):
    card_number: str = Field(..., min_length=16, max_length=16)
    card_expiry_month: str = Field(..., min_length=2, max_length=2)
    card_expiry_year: str = Field(..., min_length=2, max_length=2)
    card_cvv: str = Field(..., min_length=3, max_length=3)
    card_holder_name: str = Field(..., min_length=2)


class PaymentRequest(TransactionBase):
    card_info: CardInfo


class TransactionResponse(TransactionBase):
    id: uuid.UUID
    status: str
    blumonpay_transaction_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
