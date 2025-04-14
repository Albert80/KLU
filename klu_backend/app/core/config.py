import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Payments App API"
    API_V1_STR: str = "/api/v1"

    # Database
    DB_TYPE: str = os.getenv("DB_TYPE", "sqlite")  # "sqlite" o "postgres"

    # PostgreSQL
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "payments_app")

    # SQLite
    SQLITE_URI: str = os.getenv("SQLITE_URI", "sqlite:///./payments_app.db")

    # Blumonpay credentials
    BLUMONPAY_TOKEN_HOST: str = os.getenv(
        "BLUMONPAY_TOKEN_HOST", ""
    )
    BLUMONPAY_USERNAME: str = os.getenv("BLUMONPAY_USERNAME", "")
    BLUMONPAY_PASSWORD: str = os.getenv("BLUMONPAY_PASSWORD", "")
    BLUMONPAY_CHARGE_HOST: str = os.getenv(
        "BLUMONPAY_CHARGE_HOST",
        "",
    )

    # Redis (para Celery)
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", 6379))

    class Config:
        env_file = ".env"

    def get_db_uri(self) -> str:
        if self.DB_TYPE.lower() == "postgres":
            return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
        return self.SQLITE_URI

    def get_redis_url(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/0"


settings = Settings()
