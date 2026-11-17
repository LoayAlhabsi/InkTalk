import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  website: { type: String, default: '' },
  role: { type: String, default: 'user' },
  status: { type: String, default: 'active' },
  avatar: { type: String, default: '' },
  savedBooks: { type: [String], default: [] },
  joined: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  userType: { type: String, default: 'Reader' },
});

export default mongoose.model('User', UserSchema, 'Users');
