import Layout from '../components/Layout';
import PaymentForm from '../components/PaymentForm';

export default function Home() {
  return (
    <Layout title="Checkout">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Secure Checkout
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Complete your payment securely with Blumonpay
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <PaymentForm />
      </div>
    </Layout>
  );
}
