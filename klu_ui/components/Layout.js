import Head from 'next/head';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children, title = 'Checkout' }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title} | Blumonpay Checkout</title>
        <meta name="description" content="Secure payment processing with Blumonpay" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="mt-8 py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Secure Payments by Blumonpay
            </p>
          </div>
        </div>
      </footer>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}
