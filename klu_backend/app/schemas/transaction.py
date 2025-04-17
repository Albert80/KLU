import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, IPvAnyAddress


class CustomerInfo(BaseModel):
    firstName: str
    lastName: str
    middleName: str = ""
    email: EmailStr | str
    phone1: str
    city: str
    address1: str
    postalCode: str
    state: str
    country: str
    ip: IPvAnyAddress = '127.0.0.1'

    class Config:
        json_encoders = {
            IPvAnyAddress: lambda ipv: str(ipv),
        }


class CardInfo(BaseModel):
    cardNumber: str = Field(..., min_length=16, max_length=16)
    expirationMonth: str = Field(..., min_length=2, max_length=2)
    expirationYear: str = Field(..., min_length=2, max_length=2)
    cvv: str = Field(..., min_length=3, max_length=3)
    cardholderName: str = Field(..., min_length=2)


class TransactionBase(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str
    customerInformation: CustomerInfo


class TransactionBaseResponse(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str
    customer_email: EmailStr | str
    customer_name: str


class TransactionCreate(TransactionBase):
    pass


class CardPaymentRequest(TransactionBase):
    noPresentCardData: CardInfo


class TransactionResponse(TransactionBaseResponse):
    id: uuid.UUID
    status: str
    blumonpay_transaction_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
        }
