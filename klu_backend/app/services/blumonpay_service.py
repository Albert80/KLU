import hashlib
import logging

import httpx
import requests
from requests_toolbelt import MultipartEncoder

from app.core.config import settings
from app.schemas.transaction import CardPaymentRequest
import base64

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.DEBUG)



class BlumonpayAPIError(Exception):
    """Excepción para errores de comunicación con la API de Blumonpay"""
    pass


class PaymentDeclinedError(Exception):
    """Excepción para pagos rechazados por el procesador"""
    def __init__(self, code, message, transaction_id, details=None):
        self.code = code
        self.transaction_id = transaction_id
        self.details = details
        super().__init__(message)


class BlumonpayService:
    def __init__(self):
        self.token_url = settings.BLUMONPAY_TOKEN_HOST
        self.charge_url = settings.BLUMONPAY_CHARGE_HOST
        self.username = settings.BLUMONPAY_USERNAME
        self.password = settings.BLUMONPAY_PASSWORD
        self.token = None

    def get_hashed_password(self) -> str:
        return hashlib.sha256(self.password.encode('utf-8')).hexdigest()

    def generate_basic_token(self,) -> str:
        # token_raw = f"{self.username}:{self.password}"
        token_raw = "blumon_pay_ecommerce_api:blumon_pay_ecommerce_api_password"
        token_bytes = token_raw.encode()
        base64_bytes = base64.b64encode(token_bytes)
        return base64_bytes.decode()

    async def get_token(self):
        """Obtiene un token de acceso de Blumonpay"""
        payload = {
            "username": self.username,
            "password": self.password,
            "grant_type": "password",
        }

        basic_token = self.generate_basic_token()
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {basic_token}"
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.token_url, data=payload, headers=headers
                )
                response.raise_for_status()

                data = response.json()
                self.token = data.get("access_token")
                return self.token
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error obtaining token: {e}")
                raise
            except Exception as e:
                logger.error(f"Unexpected error obtaining token: {e}")
                raise

    async def process_payment(self, payment_data: CardPaymentRequest):
        """Procesa un pago a través de Blumonpay"""
        if not self.token:
            await self.get_token()

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}",
        }

        # Formatear datos para la API de Blumonpay
        payload = {
            "amount": payment_data.amount,
            "currency": payment_data.currency,
            "card": {
                "number": payment_data.card_info.card_number,
                "exp_month": payment_data.card_info.card_expiry_month,
                "exp_year": payment_data.card_info.card_expiry_year,
                "cvv": payment_data.card_info.card_cvv,
                "holder_name": payment_data.card_info.card_holder_name,
            },
            "customer": {
                "email": payment_data.customer_email,
                "name": payment_data.customer_name,
            },
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.charge_url, json=payload, headers=headers
                )
                response.raise_for_status()

                result = response.json()
                return {
                    "status": "completed"
                    if result.get("status") == "succeeded"
                    else "failed",
                    "blumonpay_transaction_id": result.get("id"),
                    "details": result,
                }
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error processing payment: {e}")
                return {"status": "failed", "error": str(e)}
            except Exception as e:
                logger.error(f"Unexpected error processing payment: {e}")
                return {"status": "failed", "error": str(e)}

    def get_token_sync(self):
        """Obtiene un token de acceso de Blumonpay (versión síncrona)"""
        hashed_password = self.get_hashed_password()
        payload = MultipartEncoder(
            fields={
                "username": self.username,
                "password": hashed_password,
                "grant_type": "password",
            }
        )

        basic_token = self.generate_basic_token()
        headers = {
            "Content-Type": payload.content_type,
            "Authorization": f"Basic {basic_token}"
        }

        response = requests.post(
            url=self.token_url,
            data=payload,
            headers=headers,
        )
        response.raise_for_status()

        data = response.json()
        self.token = data.get("access_token")
        return self.token

    # Agregar este método a BlumonpayService
    def process_payment_sync(self, payment_data: dict):
        """
        Versión síncrona para procesar pagos (para Celery).

        Args:
            payment_data (dict): Datos de pago a procesar

        Returns:
            dict: Respuesta estructurada con los datos de la transacción

        Raises:
            BlumonpayAPIError: Si hay un error de comunicación con la API
            PaymentDeclinedError: Si el pago es rechazado por el procesador
        """
        try:
            if not self.token:
                self.get_token_sync()

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}",
            }

            response = requests.post(
                self.charge_url,
                json=payment_data,
                headers=headers,
                timeout=30,  # Agregado timeout para evitar bloqueos indefinidos
            )

            # Verificar si la respuesta HTTP es exitosa
            response.raise_for_status()

            # Parsear la respuesta JSON
            result = response.json()

            # Crear un objeto de respuesta estandarizado
            transaction_response = {
                "success": result.get("status", False),
                "transaction_id": result.get("id"),
                "request_id": result.get("requestId"),
                "timestamp": f"{result.get('date', '')}T{result.get('time', '')}",
            }

            # Procesar caso de éxito
            if result.get("status") is True and "dataResponse" in result:
                data_response = result["dataResponse"]
                transaction_response.update(
                    {
                        "authorization_code": data_response.get("authorization"),
                        "message": data_response.get("description", "APROBADA"),
                        "card_info": {
                            "bank": data_response.get("binInformation", {}).get("bank"),
                            "brand": data_response.get("binInformation", {}).get(
                                "brand"
                            ),
                            "type": data_response.get("binInformation", {}).get("type"),
                            "product": data_response.get("binInformation", {}).get(
                                "product"
                            ),
                            "last_four": data_response.get("lastFour"),
                        },
                    }
                )

            # Procesar caso de error
            elif "error" in result:
                error_data = result["error"]
                transaction_response.update(
                    {
                        "success": False,
                        "error_code": error_data.get("code"),
                        "message": error_data.get("description", "Error desconocido"),
                        "card_info": {
                            "bank": error_data.get("binInformation", {}).get("bank"),
                            "brand": error_data.get("binInformation", {}).get("brand"),
                            "type": error_data.get("binInformation", {}).get("type"),
                            "product": error_data.get("binInformation", {}).get(
                                "product"
                            ),
                        },
                    }
                )

                # Si queremos lanzar una excepción para pagos rechazados:
                # if error_data.get("httpStatusCode") == 200:
                #     raise PaymentDeclinedError(
                #         code=error_data.get("code"),
                #         message=error_data.get("description", "Pago rechazado"),
                #         transaction_id=result.get("id"),
                #         details=transaction_response
                #     )

            # Almacenar la respuesta original para referencia si es necesario
            transaction_response["raw_response"] = result

            return transaction_response

        except requests.exceptions.RequestException as e:
            # Manejar errores de comunicación HTTP
            raise BlumonpayAPIError(f"Error de comunicación con Blumonpay: {str(e)}")

        except ValueError as e:
            # Error al decodificar JSON
            raise BlumonpayAPIError(
                f"Error al procesar la respuesta de Blumonpay: {str(e)}"
            )
