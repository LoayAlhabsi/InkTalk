import * as yup from 'yup';

export const RegistrationValidation = yup.object().shape({
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
    .required('Enter password..')
    .min(8, 'Use at least 8 characters')
    .matches(/[0-9]/, 'Include a number'),
  userType: yup
    .string()
    .oneOf(['Reader', 'Writer', 'Both'], 'Select a user type')
    .required('Select a user type'),
});
