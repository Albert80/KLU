# Etapa de construcción
FROM python:3.12-slim AS builder

# Instalar uv desde imagen oficial
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Establecer directorio de trabajo
WORKDIR /build/

# Variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV="/build/.venv" \
    PATH="/build/.venv/bin:$PATH"

# Instalar dependencias del sistema necesarias para compilar paquetes
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar dependencias de Python
COPY uv.lock pyproject.toml /build/

# Crear entorno virtual con uv
RUN uv sync

# Etapa final
FROM python:3.12-slim

# Instalar uv nuevamente (por si necesitas usarlo en prod, por ejemplo para `uv pip`)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Variables de entorno para usar el venv
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV="/opt/venv" \
    PATH="/opt/venv/bin:$PATH" \
    PYTHONPATH="/app" \
    PORT=8000

# Crear usuario sin privilegios
RUN groupadd -r appgroup && useradd -r -g appgroup appuser \
    && mkdir -p /app /home/appuser \
    && chown -R appuser:appgroup /app /home/appuser

# Instalar solo lo mínimo necesario
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    tini \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar el entorno virtual desde la etapa de builder
COPY --from=builder --chown=appuser:appgroup /build/.venv /opt/venv

# Establecer directorio de trabajo
WORKDIR /app

# Copiar el código fuente
COPY --chown=appuser:appgroup . /app/

# Cambiar al usuario sin privilegios
USER appuser

# Usar tini para manejar señales correctamente
ENTRYPOINT ["tini", "--"]

# Exponer puerto (documentación)
EXPOSE 8000
