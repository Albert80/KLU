// pages/api/transactions/index.js
import axios from 'axios';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Extraer los datos del pago del cuerpo de la solicitud
      const paymentData = req.body;

      // Llamar a tu backend FastAPI
      const response = await axios.post(
        `${process.env.BACKEND_API_URL}/transactions`,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Payment error:', error.response?.data || error.message);
      return res.status(error.response?.status || 500).json({
        detail: error.response?.data?.detail || 'An error occurred while processing the payment'
      });
    }
  } else if (req.method === 'GET') {
    try {
      // Obtener parámetros de consulta para filtrar transacciones
      const { limit, offset, status } = req.query;

      // Construir parámetros de consulta
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit);
      if (offset) params.append('offset', offset);
      if (status) params.append('status', status);

      // Llamar a tu backend FastAPI
      const response = await axios.get(
        `${process.env.BACKEND_API_URL}/transactions${params.toString() ? `?${params.toString()}` : ''}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error.response?.data || error.message);
      return res.status(error.response?.status || 500).json({
        detail: error.response?.data?.detail || 'An error occurred while fetching transactions'
      });
    }
  }

  // Método no permitido
  return res.status(405).json({ detail: 'Method not allowed' });
}
