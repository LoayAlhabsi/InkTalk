import * as yup from 'yup';

export const EditProfileValidation = yup.object().shape({
  username: yup
    .string()
    .required('Username is required..')
    .min(3, 'Username must be at least 3 chars'),
  email: yup
    .string()
    .required('Email is required..')
    .email('Enter valid email..'),
  bio: yup.string().max(240, 'About me must be under 240 chars'),
  password: yup
    .string()
    .transform((v) => (v === '' ? undefined : v))
    .notRequired()
    .min(8, 'Use at least 8 characters')
    .matches(/[0-9]/, 'Include a number'),
  cpassword: yup.string().when('password', {
    is: (val) => !!val,
    then: (schema) =>
      schema
        .required('Confirm password..')
        .oneOf([yup.ref('password')], 'Passwords must match'),
    otherwise: (schema) => schema.notRequired(),
  }),
});
