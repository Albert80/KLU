import logging
import uuid

from app.db.session import get_db
from app.models.transaction import Transaction
from app.repositories.transaction_repository import TransactionRepository
from app.schemas.transaction import (
    CardPaymentRequest,
    TransactionCreate,
    TransactionCreateResponse,
)
from app.services.blumonpay_service import BlumonpayService
from app.tasks.payment_tasks import process_payment
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()
transaction_repo = TransactionRepository()
blumonpay_service = BlumonpayService()


@router.post(
    "/", response_model=TransactionCreateResponse, status_code=status.HTTP_201_CREATED
)
async def create_transaction(
    payment_data: CardPaymentRequest, db: Session = Depends(get_db)
):
    payload = payment_data.model_dump(
        exclude={"noPresentCardData"},
    )
    # Crear registro de transacción inicial
    transaction_data = TransactionCreate(
        **payload
    )

    transaction: Transaction = transaction_repo.create_transaction(
        db=db,
        transaction=transaction_data,
    )

    process_payment.delay(str(transaction.id), payment_data.model_dump(mode='json'))
    return TransactionCreateResponse.model_validate(obj=transaction)


@router.get("/{transaction_id}", response_model=TransactionCreateResponse)
def get_transaction(transaction_id: uuid.UUID, db: Session = Depends(get_db)):
    transaction = transaction_repo.get_transaction(db, transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )
    return transaction


@router.get("/", response_model=list[TransactionCreateResponse])
def list_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = transaction_repo.list_transactions(db, skip=skip, limit=limit)
    return transactions
