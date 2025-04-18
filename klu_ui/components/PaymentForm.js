import {useState} from 'react';
import {useRouter} from 'next/router';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {toast} from 'react-toastify';
import Card from './ui/Card';
import Button from './ui/Button';
import {processPayment} from "@/utils/api";
import {PaymentSchema} from "@/utils/validation";
import Image from 'next/image';


export default function PaymentForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (values, {setSubmitting, resetForm}) => {
        setIsSubmitting(true);
        try {
            // Transformar los datos al formato esperado por la API
            const transformedData = {
                amount: parseFloat(values.amount),
                currency: values.currency,
                customerInformation: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    middleName: values.middleName || "",
                    email: values.customer_email,
                    phone1: values.phone,
                    city: values.city,
                    address1: values.address,
                    postalCode: values.postalCode,
                    state: values.state,
                    country: values.country,
                    ip: values.ip || "127.0.0.1"
                },
                noPresentCardData: {
                    cardNumber: values.card_info.card_number,
                    expirationMonth: values.card_info.card_expiry_month,
                    expirationYear: values.card_info.card_expiry_year,
                    cvv: values.card_info.card_cvv,
                    cardholderName: values.card_info.card_holder_name
                }
            };

            console.log('Transformed payload:', transformedData);
            const transaction = await processPayment(transformedData);
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
                    currency: '484', // Cambiado a '484' según el payload esperado
                    customer_email: '',
                    firstName: '',
                    lastName: '',
                    middleName: '',
                    phone: '',
                    city: '',
                    address: '',
                    postalCode: '',
                    state: '',
                    country: '',
                    ip: '127.0.0.1',
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        className="form-control"
                                        placeholder="John"
                                    />
                                    <ErrorMessage name="firstName" component="p" className="error-message"/>
                                </div>
                                <div>
                                    <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                                        Middle Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="middleName"
                                        id="middleName"
                                        className="form-control"
                                        placeholder="Albert"
                                    />
                                    <ErrorMessage name="middleName" component="p" className="error-message"/>
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        className="form-control"
                                        placeholder="Doe"
                                    />
                                    <ErrorMessage name="lastName" component="p" className="error-message"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <Field
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        className="form-control"
                                        placeholder="+1234567890"
                                    />
                                    <ErrorMessage name="phone" component="p" className="error-message"/>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-4">Address Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <Field
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="form-control"
                                        placeholder="123 Main St"
                                    />
                                    <ErrorMessage name="address" component="p" className="error-message"/>
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <Field
                                        type="text"
                                        name="city"
                                        id="city"
                                        className="form-control"
                                        placeholder="New York"
                                    />
                                    <ErrorMessage name="city" component="p" className="error-message"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                                        Postal Code
                                    </label>
                                    <Field
                                        type="text"
                                        name="postalCode"
                                        id="postalCode"
                                        className="form-control"
                                        placeholder="10001"
                                    />
                                    <ErrorMessage name="postalCode" component="p" className="error-message"/>
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                        State
                                    </label>
                                    <Field
                                        type="text"
                                        name="state"
                                        id="state"
                                        className="form-control"
                                        placeholder="NY"
                                    />
                                    <ErrorMessage name="state" component="p" className="error-message"/>
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <Field
                                        type="text"
                                        name="country"
                                        id="country"
                                        className="form-control"
                                        placeholder="US"
                                    />
                                    <ErrorMessage name="country" component="p" className="error-message"/>
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
                                        <option value="484">MXN (484)</option>
                                        <option value="840">USD (840)</option>
                                        <option value="978">EUR (978)</option>
                                        <option value="826">GBP (826)</option>
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
                                        placeholder="JOHN A DOE"
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
                                <Image
                                    src="/images/payment-icons/visa.svg"
                                    alt="Visa"
                                    width={24}
                                    height={24}
                                />
                                <Image
                                    src="/images/payment-icons/mastercard.svg"
                                    alt="Mastercard"
                                    width={24}
                                    height={24}
                                />
                                <Image
                                    src="/images/payment-icons/amex.svg"
                                    alt="American Express"
                                    width={24}
                                    height={24}
                                />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
}
