import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function processPayment(paymentData) {
  try {
    const response = await axios.post(`${API_URL}/transactions`, paymentData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'An error occurred while processing the payment';
    throw { detail: errorMessage };
  }
}

export async function getTransaction(transactionId) {
  try {
    const response = await axios.get(`${API_URL}/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'An error occurred while fetching the transaction';
    throw { detail: errorMessage };
  }
}

export async function getTransactions(params = {}) {
  try {
    const response = await axios.get(`${API_URL}/transactions`, { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'An error occurred while fetching transactions';
    throw { detail: errorMessage };
  }
}
