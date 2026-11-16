import * as yup from 'yup';

export const ForgotPasswordValidation = yup.object().shape({
  username: yup
    .string()
    .required('Username is required..')
    .min(3, 'Username must be at least 3 chars'),
  email: yup
    .string()
    .required('Email is required..')
    .email('Enter valid email..'),
  password: yup
    .string()
    .required('Enter Password..')
    .min(8, 'Use at least 8 characters')
    .matches(/[0-9]/, 'Include a number'),
  cpassword: yup
    .string()
    .required('Confirm password..')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});
