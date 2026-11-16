import * as yup from 'yup';

export const ReviewValidation = yup.object().shape({
  text: yup
    .string()
    .required('Review is required..')
    .min(10, 'Review must be at least 10 chars')
    .max(2000, 'Review must be under 2,000 characters'),
  rating: yup
    .number()
    .required('Rating is required..')
    .min(1, 'Select a rating')
    .max(5, 'Max rating is 5'),
});
