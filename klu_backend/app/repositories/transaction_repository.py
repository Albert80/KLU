import uuid

from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate
from sqlalchemy.orm import Session


class TransactionRepository:
    def create_transaction(self, db: Session, transaction: TransactionCreate):
        db_transaction = Transaction(
            amount=transaction.amount,
            currency=transaction.currency,
            customer_email=transaction.customer_email,
            customer_name=transaction.customer_name,
            status="pending",
        )
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction

    def update_transaction_status(
        self,
        db: Session,
        transaction_id: uuid.UUID,
        status: str,
        blumonpay_transaction_id: str = None,
    ):
        db_transaction = (
            db.query(Transaction).filter(Transaction.id == transaction_id).first()
        )
        if db_transaction:
            db_transaction.status = status
            if blumonpay_transaction_id:
                db_transaction.blumonpay_transaction_id = blumonpay_transaction_id
            db.commit()
            db.refresh(db_transaction)
        return db_transaction

    def get_transaction(self, db: Session, transaction_id: uuid.UUID):
        return db.query(Transaction).filter(Transaction.id == transaction_id).first()

    def list_transactions(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Transaction).offset(skip).limit(limit).all()
