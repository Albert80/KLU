import logging
import uuid

from app.db.session import SessionLocal
from app.repositories.transaction_repository import TransactionRepository
from app.services.blumonpay_service import BlumonpayService
from app.worker import celery_app

logger = logging.getLogger(__name__)
blumonpay_service = BlumonpayService()
transaction_repo = TransactionRepository()


@celery_app.task(name="app.tasks.payment_tasks.process_payment")
def process_payment(transaction_id: str, payment_data: dict):
    """
    Tarea asíncrona para procesar un pago a través de Blumonpay
    """
    logger.info(f"Processing payment for transaction {transaction_id}")

    try:
        # Convertir a objeto UUID
        transaction_id = uuid.UUID(transaction_id)

        # Procesar el pago con Blumonpay
        payment_result = blumonpay_service.process_payment_sync(payment_data)

        # Actualizar el estado de la transacción
        db = SessionLocal()
        try:
            updated_transaction = transaction_repo.update_transaction_status(
                db,
                transaction_id,
                payment_result["status"],
                payment_result.get("blumonpay_transaction_id"),
            )
            logger.info(
                f"Transaction {transaction_id} updated with status {payment_result['status']}"
            )
            return {
                "transaction_id": str(updated_transaction.id),
                "status": updated_transaction.status,
            }
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Error processing payment: {str(e)}")
        # Actualizar transacción como fallida
        db = SessionLocal()
        try:
            transaction_repo.update_transaction_status(
                db,
                transaction_id,
                "failed",
            )
        finally:
            db.close()
        raise
