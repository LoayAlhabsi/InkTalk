import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  bookId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString().slice(0, 10) },
});

export default mongoose.model('Review', ReviewSchema, 'Reviews');
