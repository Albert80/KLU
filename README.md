# Checkout Payment Page

Aplicación de procesamiento de pagos desarrollada con FastAPI, Next.js y la API de Blumonpay.

## Características

- Backend en FastAPI que actúa como intermediario con la API de Blumonpay
- Base de datos PostgreSQL/SQLite para el registro de transacciones
- Frontend en Next.js con React y TailwindCSS
- Procesamiento asíncrono de pagos con Celery y Redis
- Escalable con Docker, Docker Compose y soporte para Kubernetes

## Requisitos

- Python 3.10+
- Node.js 18+
- PostgreSQL (opcional, puede usar SQLite)
- Redis (para Celery)
- Docker y Docker Compose (opcional)

## Configuración

### Backend

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/username/checkout-payment-app.git
   cd checkout-payment-app
   ```

2. Crear y configurar el archivo `.env` usando como referencia `.env.example`:
   ```bash
   cp .env.example .env
   # Edita el archivo .env con tus configuraciones
   ```

3. Instalar dependencias usando UV:
   ```bash
   # Instalar UV si no lo tienes
   pip install uv
   
   # Crear entorno virtual e instalar dependencias
   cd klu_backend
   uv venv
   uv sync
   ```

4. Ejecutar migraciones:
   ```bash
   alembic upgrade head
   ```

5. Iniciar el servidor:

Opción 1:
   ```bash
   uv run uvicorn main:app --reload
   ```
Opción 2:
   ```bash
   uv run fastapi dev
   ```

6. Iniciar worker de Celery:
   ```bash
   uv run celery -A app.worker worker --loglevel=info
   ```

### Frontend

1. Instalar dependencias:
   ```bash
   cd klu_ui
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Uso con Docker

Si prefieres usar Docker:

```bash
# Construir y levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## Estructura del Proyecto

```
KLU/
├── klu_backend/
│   ├── app/
│   │   ├── api/            # Endpoints de la API
│   │   ├── core/           # Configuración central
│   │   ├── db/             # Configuración de la BD
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── repositories/   # Operaciones de BD
│   │   ├── schemas/        # Modelos Pydantic
│   │   ├── services/       # Servicios externos
│   │   └── tasks/          # Tareas Celery
│   ├── migrations/         # Migraciones Alembic
│   ├── tests/              # Tests unitarios
│   ├── main.py             # Punto de entrada
│   └── worker.py           # Configuración de Celery
├── klu_ui/
│   ├── components/         # Componentes React
│   ├── pages/              # Páginas Next.js
│   ├── public/             # Archivos estáticos
│   ├── styles/             # Estilos CSS
│   └── utils/              # Utilidades
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── k8s/                    # Configuraciones Kubernetes
├── .env.template
└── README.md
```

## API Endpoints

### Transacciones

- `POST /api/v1/transactions` - Crear una nueva transacción de pago
- `GET /api/v1/transactions/{id}` - Obtener detalles de una transacción
- `GET /api/v1/transactions` - Listar todas las transacciones

## Seguridad

- La aplicación implementa validación de datos en ambos lados (frontend y backend)
- Las credenciales sensibles se manejan a través de variables de entorno
- Los pagos se procesan en un worker asíncrono para mayor resistencia y escalabilidad
- HTTPS es recomendado para producción (con Nginx o un Ingress de Kubernetes)

## Pruebas

Para ejecutar las pruebas:

```bash
# Backend
cd klu_backend
pytest

# Frontend
cd klu_ui
npm test
```

## Datos de prueba

- Para simular un pago exitoso, usa el siguiente número de tarjeta: `452421XXXXXXX2646`
- Las credenciales para Blumonpay se configuran en el archivo `.env`

## Autores

- César Trejo <cesaratj27@gmail.com>

## Licencia

MIT
