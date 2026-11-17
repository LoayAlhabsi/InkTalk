import User from './models/User.js';
import Book from './models/Book.js';
import Review from './models/Review.js';
import { seedUsers, seedBooks, seedReviews } from './data/seedData.js';

export async function seedDatabase() {
  const [userCount, bookCount, reviewCount] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments(),
    Review.countDocuments(),
  ]);

  if (userCount === 0) {
    await User.insertMany(seedUsers);
    console.log(`Seeded ${seedUsers.length} users`);
  }
  if (bookCount === 0) {
    await Book.insertMany(seedBooks);
    console.log(`Seeded ${seedBooks.length} books`);
  }
  if (reviewCount === 0) {
    await Review.insertMany(seedReviews);
    console.log(`Seeded ${seedReviews.length} reviews`);
  }
}
