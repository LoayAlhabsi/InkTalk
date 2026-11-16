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
        isbn: action.payload.isbn || '',
        synopsis: action.payload.synopsis || action.payload.description || '',
        shopName: action.payload.shopName || '',
        shopAddress: action.payload.shopAddress || '',
        updatedAt: new Date().toISOString().slice(0, 10),
        ...action.payload,
      });
    },
    updateBook: (state, action) => {
      const { id, ...rest } = action.payload;
      state.books = state.books.map((b) =>
        b.id === id
          ? { ...b, ...rest, updatedAt: new Date().toISOString().slice(0, 10) }
          : b
      );
    },
    deleteBook: (state, action) => {
      state.books = state.books.filter((b) => b.id !== action.payload);
    },
  },
});

export const { addBook, updateBook, deleteBook } = BooksSlice.actions;
export default BooksSlice.reducer;
