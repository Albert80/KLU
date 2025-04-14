from app.api.endpoints import transactions
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(
    router=transactions.router,
    prefix="/transactions",
    tags=["transactions"],
)
