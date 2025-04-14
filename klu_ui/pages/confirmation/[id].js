import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import {getTransaction} from "@/utils/api";

export default function ConfirmationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTransaction(id);
    }
  }, [id]);

  const fetchTransaction = async (transactionId) => {
    try {
      setLoading(true);
      const data = await getTransaction(transactionId);
      setTransaction(data);
      setError(null);
    } catch (err) {
      setError('Unable to load transaction details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transaction details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error">
        <div className="max-w-lg mx-auto">
          <Alert type="error">{error}</Alert>
          <div className="text-center mt-6">
            <Link href="/">
              <Button variant="primary">Return to Payment Page</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!transaction) {
    return null;
  }

  const statusColors = {
    completed: 'bg-green-500',
    failed: 'bg-red-500',
    pending: 'bg-yellow-500'
  };

  const statusMessages = {
    completed: 'Payment Successful',
    failed: 'Payment Failed',
    pending: 'Payment Processing'
  };

  return (
    <Layout title="Payment Confirmation">
      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden">
          <div className={`p-4 ${statusColors[transaction.status]} text-white text-center`}>
            <h2 className="text-lg font-semibold">
              {statusMessages[transaction.status]}
            </h2>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Transaction Details</h3>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{transaction.id}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: transaction.currency
                    }).format(transaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    transaction.status === 'completed' ? 'text-green-600' : 
                    transaction.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(transaction.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Customer Information</h3>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{transaction.customer_name}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{transaction.customer_email}</span>
                </div>
              </div>
            </div>

            {transaction.status === 'completed' && (
              <Alert type="success">
                Your payment has been processed successfully. A confirmation email has been sent to your email address.
              </Alert>
            )}

            {transaction.status === 'failed' && (
              <Alert type="error">
                Your payment could not be processed. Please try again or contact customer support for assistance.
              </Alert>
            )}

            {transaction.status === 'pending' && (
              <Alert type="warning">
                Your payment is being processed. We'll update you once the payment is confirmed.
              </Alert>
            )}

            <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Link href="/">
                <Button variant="primary">Return to Home</Button>
              </Link>
              
              {transaction.status === 'failed' && (
                <Link href="/">
                  <Button variant="secondary">Try Again</Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
