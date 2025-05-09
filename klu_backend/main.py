from app.api.api import api_router
from app.core.config import settings
from app.db.session import engine
from app.models.transaction import Base
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Crear tablas en la base de datos (pero ya existe alembic)
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    docs_url="/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    debug=True,
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Payments App API"}


@app.get("/healthcheck")
def read_root():
    return {"status": "ok"}
