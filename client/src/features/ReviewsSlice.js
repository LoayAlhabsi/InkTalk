import { createSlice } from '@reduxjs/toolkit';
import { seedReviews } from '../data/seed';

const ReviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: seedReviews,
  },
  reducers: {
    addReview: (state, action) => {
      state.reviews.unshift({
        id: `r${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
        ...action.payload,
      });
    },
    updateReview: (state, action) => {
      const { id, ...rest } = action.payload;
      state.reviews = state.reviews.map((r) =>
        r.id === id ? { ...r, ...rest } : r
      );
    },
    deleteReview: (state, action) => {
      state.reviews = state.reviews.filter((r) => r.id !== action.payload);
    },
  },
});

export const { addReview, updateReview, deleteReview } = ReviewsSlice.actions;
export default ReviewsSlice.reducer;
