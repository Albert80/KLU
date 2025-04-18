import * as Yup from 'yup';

export const PaymentSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  currency: Yup.string()
    .required('Currency is required'),
  customer_email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  middleName: Yup.string(),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  address: Yup.string()
    .required('Address is required'),
  city: Yup.string()
    .required('City is required'),
  postalCode: Yup.string()
    .required('Postal code is required')
    .matches(/^[0-9]{5,10}$/, 'Invalid postal code'),
  state: Yup.string()
    .required('State is required'),
  country: Yup.string()
    .required('Country is required')
    .length(2),
  ip: Yup.string()
    .matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Invalid IP address format'),
  card_info: Yup.object().shape({
    card_number: Yup.string()
      .required('Card number is required')
      .matches(/^\d{16}$/, 'Card number must be 16 digits'),
    card_expiry_month: Yup.string()
      .required('Expiry month is required')
      .matches(/^(0[1-9]|1[0-2])$/, 'Month must be between 01-12'),
    card_expiry_year: Yup.string()
      .required('Expiry year is required')
      .matches(/^\d{2}$/, 'Year must be 2 digits'),
    card_cvv: Yup.string()
      .required('CVV is required')
      .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
    card_holder_name: Yup.string()
      .required('Card holder name is required')
      .min(2, 'Name must be at least 2 characters'),
  }),
});
