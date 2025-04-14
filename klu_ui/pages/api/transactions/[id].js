import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Llamar a tu backend FastAPI
      const response = await axios.get(
        `${process.env.BACKEND_API_URL}/transactions/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching transaction:', error.response?.data || error.message);
      return res.status(error.response?.status || 500).json({
        detail: error.response?.data?.detail || 'An error occurred while fetching the transaction'
      });
    }
  }

  // Método no permitido
  return res.status(405).json({ detail: 'Method not allowed' });
}
