import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, default: '' },
  isbn: { type: String, default: '' },
  description: { type: String, default: '' },
  synopsis: { type: String, default: '' },
  year: { type: Number },
  pages: { type: Number },
  language: { type: String, default: 'English' },
  cover: { type: String, default: '' },
  status: { type: String, default: 'Published' },
  shopName: { type: String, default: '' },
  shopAddress: { type: String, default: '' },
  updatedAt: { type: String, default: () => new Date().toISOString().slice(0, 10) },
});

export default mongoose.model('Book', BookSchema, 'Books');
