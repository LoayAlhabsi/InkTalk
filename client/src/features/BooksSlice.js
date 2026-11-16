import { createSlice } from '@reduxjs/toolkit';
import { seedBooks } from '../data/seed';

const BooksSlice = createSlice({
  name: 'books',
  initialState: {
    books: seedBooks,
  },
  reducers: {
    addBook: (state, action) => {
      state.books.unshift({
        id: `b${Date.now()}`,
        status: 'Published',
        cover: action.payload.cover || '',
        shopName: action.payload.shopName || '',
        shopAddress: action.payload.shopAddress || '',
        ...action.payload,
      });
    },
    updateBook: (state, action) => {
      const { id, ...rest } = action.payload;
      state.books = state.books.map((b) =>
        b.id === id ? { ...b, ...rest } : b
      );
    },
    deleteBook: (state, action) => {
      state.books = state.books.filter((b) => b.id !== action.payload);
    },
  },
});

export const { addBook, updateBook, deleteBook } = BooksSlice.actions;
export default BooksSlice.reducer;
