import * as yup from 'yup';

export const BookFormValidation = yup.object().shape({
  title: yup.string().required('Title is required..'),
  author: yup.string().required('Author is required..'),
  category: yup.string().required('Category is required..'),
  description: yup
    .string()
    .required('Description is required..')
    .min(20, 'Description must be at least 20 chars'),
  year: yup
    .number()
    .typeError('Year must be a number')
    .required('Year is required..')
    .min(1000, 'Enter a valid year')
    .max(2100, 'Enter a valid year'),
  pages: yup
    .number()
    .typeError('Pages must be a number')
    .required('Pages is required..')
    .min(1, 'Pages must be at least 1'),
  language: yup.string().required('Language is required..'),
  cover: yup
    .string()
    .transform((v) => (v === '' ? undefined : v))
    .url('Enter a valid cover URL')
    .notRequired(),
  shopName: yup.string(),
  shopAddress: yup.string(),
});
