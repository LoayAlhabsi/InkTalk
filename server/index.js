import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import Book from './models/Book.js';
import Review from './models/Review.js';
import { seedDatabase } from './seed.js';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;

const conStr =
  process.env.MONGO_URI ||
  `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.pjq3iix.mongodb.net/InkTalk?retryWrites=true&w=majority&appName=Cluster0`;

const stripPassword = (user) => {
  if (!user) return user;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  delete obj._id;
  return obj;
};

const cleanDoc = (doc) => {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj.__v;
  delete obj._id;
  return obj;
};

mongoose
  .connect(conStr)
  .then(async () => {
    console.log('Database connected..');
    await seedDatabase();
  })
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send({ message: 'InkTalk server is running' });
});

/* ── Users ── */
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users.map(stripPassword));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const key = (email || '').trim();
    if (!key || !password) {
      return res.send({ message: 'Email and password are required' });
    }

    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await User.findOne({
      $or: [
        { email: new RegExp(`^${escaped}$`, 'i') },
        { username: new RegExp(`^${escaped}$`, 'i') },
      ],
    });

    if (!user) {
      return res.send({ message: 'Account not found. Please register first.' });
    }
    if (user.password !== password) {
      return res.send({ message: 'Incorrect password' });
    }
    if (user.status === 'suspended') {
      return res.send({ message: 'This account is disabled' });
    }
    res.send({ user: stripPassword(user), message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    const exists = await User.findOne({
      $or: [
        { email: new RegExp(`^${email}$`, 'i') },
        { username: new RegExp(`^${username}$`, 'i') },
      ],
    });
    if (exists) {
      return res.send({ message: 'Email or username already registered' });
    }

    const newUser = new User({
      id: `u${Date.now()}`,
      name: username,
      username,
      email,
      password,
      userType: userType || 'Reader',
      bio: '',
      website: '',
      savedBooks: [],
      role: 'user',
      status: 'active',
      avatar: '',
      joined: new Date().toISOString().slice(0, 10),
    });
    await newUser.save();
    res.send({ user: stripPassword(newUser), message: 'Registration successful' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { password, cpassword, ...rest } = req.body;
    const patch = { ...rest };
    if (password) patch.password = password;

    const existing = await User.findOne({ id: req.params.id });
    if (!existing) return res.status(404).send({ message: 'User not found' });

    const user = await User.findOneAndUpdate({ id: req.params.id }, patch, {
      new: true,
    });

    if (patch.username && patch.username !== existing.username) {
      await Review.updateMany(
        { userId: req.params.id },
        { username: patch.username }
      );
    }

    res.send({ user: stripPassword(user), message: 'Profile updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put('/users/:id/saved', async (req, res) => {
  try {
    const { bookId } = req.body;
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).send({ message: 'User not found' });

    const current = user.savedBooks || [];
    user.savedBooks = current.includes(bookId)
      ? current.filter((id) => id !== bookId)
      : [...current, bookId];
    await user.save();
    res.send({ user: stripPassword(user) });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { role },
      { new: true }
    );
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send({ user: stripPassword(user) });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).send({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.send({ message: 'Cannot change admin status' });
    }
    user.status = status;
    await user.save();
    res.send({ user: stripPassword(user) });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    await User.deleteOne({ id: req.params.id });
    res.send({ message: 'User deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/reset-password', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({
      username: (username || '').trim(),
      email: (email || '').trim().toLowerCase(),
    });
    if (!user) {
      // Keep client flow working even if not found (previous mock behavior)
      return res.send({ message: 'Password updated' });
    }
    user.password = password;
    await user.save();
    res.send({ message: 'Password updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

/* ── Books ── */
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books.map(cleanDoc));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/books', async (req, res) => {
  try {
    const book = new Book({
      id: `b${Date.now()}`,
      status: 'Published',
      cover: '',
      isbn: '',
      synopsis: '',
      shopName: '',
      shopAddress: '',
      updatedAt: new Date().toISOString().slice(0, 10),
      ...req.body,
      synopsis: req.body.synopsis || req.body.description || '',
    });
    await book.save();
    res.send({ book: cleanDoc(book), message: 'Book added' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedAt: new Date().toISOString().slice(0, 10) },
      { new: true }
    );
    if (!book) return res.status(404).send({ message: 'Book not found' });
    res.send({ book: cleanDoc(book), message: 'Book updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    await Book.deleteOne({ id: req.params.id });
    await Review.deleteMany({ bookId: req.params.id });
    res.send({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

/* ── Reviews ── */
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.send(reviews.map(cleanDoc));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/reviews', async (req, res) => {
  try {
    const review = new Review({
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      ...req.body,
    });
    await review.save();
    res.send({ review: cleanDoc(review), message: 'Review added' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!review) return res.status(404).send({ message: 'Review not found' });
    res.send({ review: cleanDoc(review), message: 'Review updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete('/reviews/:id', async (req, res) => {
  try {
    await Review.deleteOne({ id: req.params.id });
    res.send({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete('/reviews/book/:bookId', async (req, res) => {
  try {
    await Review.deleteMany({ bookId: req.params.bookId });
    res.send({ message: 'Reviews deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log('Server connected at port no ' + PORT);
});
