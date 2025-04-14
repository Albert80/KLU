import logging
from celery import Celery
from app.core.config import settings

logger = logging.getLogger(__name__)

celery_app = Celery("worker", broker=settings.get_redis_url())

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_routes={
        "app.tasks.payment_tasks.*": "payments-queue"
    },
)

try:
    celery_app.autodiscover_tasks(["app.tasks.payment_tasks"])
    logger.info("Tareas de Celery descubiertas exitosamente.")
except Exception as e:
    logger.exception("Error al descubrir tareas de Celery")
    raise
