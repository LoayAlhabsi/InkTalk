import {configureStore} from '@reduxjs/toolkit';
import UserSlice from './features/UserSlice';
import BooksSlice from './features/BooksSlice';
import ReviewsSlice from './features/ReviewsSlice';

export const store=configureStore({
    reducer:{
        user:UserSlice,
        books:BooksSlice,
        reviews:ReviewsSlice
    }
});
