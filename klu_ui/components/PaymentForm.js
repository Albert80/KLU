import {useState} from 'react';
import {useRouter} from 'next/router';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {toast} from 'react-toastify';
import Card from './ui/Card';
import Button from './ui/Button';
import {processPayment} from "@/utils/api";
import {PaymentSchema} from "@/utils/validation";


export default function PaymentForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (values, {setSubmitting, resetForm}) => {
        setIsSubmitting(true);
        try {
            console.log(values);
            const transaction = await processPayment(values);
            toast.success('Payment processed successfully!');
            resetForm();
            router.push(`/confirmation/${transaction.id}`);
        } catch (error) {
            toast.error(error.detail || 'Payment failed. Please try again.');
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    return (
        <Card title="Payment Information">
            <Formik
                initialValues={{
                    amount: '',
                    currency: 'USD',
                    customer_email: '',
                    customer_name: '',
                    card_info: {
                        card_number: '',
                        card_expiry_month: '',
                        card_expiry_year: '',
                        card_cvv: '',
                        card_holder_name: '',
                    },
                }}
                validationSchema={PaymentSchema}
                onSubmit={handleSubmit}
            >
                {({isSubmitting}) => (
                    <Form className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Customer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="customer_name"
                                        id="customer_name"
                                        className="form-control"
                                        placeholder="John Doe"
                                    />
                                    <ErrorMessage name="customer_name" component="p" className="error-message"/>
                                </div>
                                <div>
                                    <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <Field
                                        type="email"
                                        name="customer_email"
                                        id="customer_email"
                                        className="form-control"
                                        placeholder="john@example.com"
                                    />
                                    <ErrorMessage name="customer_email" component="p" className="error-message"/>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-4">Payment Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                        Amount
                                    </label>
                                    <Field
                                        type="number"
                                        name="amount"
                                        id="amount"
                                        className="form-control"
                                        placeholder="99.99"
                                        step="0.01"
                                    />
                                    <ErrorMessage name="amount" component="p" className="error-message"/>
                                </div>
                                <div>
                                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                        Currency
                                    </label>
                                    <Field as="select" name="currency" id="currency" className="form-control">
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                        <option value="MXN">MXN</option>
                                    </Field>
                                    <ErrorMessage name="currency" component="p" className="error-message"/>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-4">Card Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="card_info.card_number"
                                           className="block text-sm font-medium text-gray-700">
                                        Card Number
                                    </label>
                                    <Field
                                        type="text"
                                        name="card_info.card_number"
                                        id="card_info.card_number"
                                        className="form-control"
                                        placeholder="4524212222222646"
                                        maxLength="16"
                                    />
                                    <ErrorMessage name="card_info.card_number" component="p" className="error-message"/>
                                </div>

                                <div>
                                    <label htmlFor="card_info.card_holder_name"
                                           className="block text-sm font-medium text-gray-700">
                                        Card Holder Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="card_info.card_holder_name"
                                        id="card_info.card_holder_name"
                                        className="form-control"
                                        placeholder="John Doe"
                                    />
                                    <ErrorMessage name="card_info.card_holder_name" component="p"
                                                  className="error-message"/>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="card_info.card_expiry_month"
                                               className="block text-sm font-medium text-gray-700">
                                            Month
                                        </label>
                                        <Field
                                            type="text"
                                            name="card_info.card_expiry_month"
                                            id="card_info.card_expiry_month"
                                            className="form-control"
                                            placeholder="MM"
                                            maxLength="2"
                                        />
                                        <ErrorMessage name="card_info.card_expiry_month" component="p"
                                                      className="error-message"/>
                                    </div>

                                    <div>
                                        <label htmlFor="card_info.card_expiry_year"
                                               className="block text-sm font-medium text-gray-700">
                                            Year
                                        </label>
                                        <Field
                                            type="text"
                                            name="card_info.card_expiry_year"
                                            id="card_info.card_expiry_year"
                                            className="form-control"
                                            placeholder="YY"
                                            maxLength="2"
                                        />
                                        <ErrorMessage name="card_info.card_expiry_year" component="p"
                                                      className="error-message"/>
                                    </div>

                                    <div>
                                        <label htmlFor="card_info.card_cvv"
                                               className="block text-sm font-medium text-gray-700">
                                            CVV
                                        </label>
                                        <Field
                                            type="password"
                                            name="card_info.card_cvv"
                                            id="card_info.card_cvv"
                                            className="form-control"
                                            placeholder="***"
                                            maxLength="4"
                                        />
                                        <ErrorMessage name="card_info.card_cvv" component="p"
                                                      className="error-message"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? 'Processing...' : 'Pay Now'}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-gray-500">
                            <p>Your payment information is secured with industry-standard encryption</p>
                            <div className="flex justify-center mt-3 space-x-4">
                                <img src="/images/payment-icons/visa.svg" alt="Visa" className="h-6"/>
                                <img src="/images/payment-icons/mastercard.svg" alt="Mastercard" className="h-6"/>
                                <img src="/images/payment-icons/amex.svg" alt="American Express" className="h-6"/>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
}
