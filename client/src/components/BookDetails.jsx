import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, FormGroup, Label } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaStar } from 'react-icons/fa';
import Header from './Header';
import StarRating from './StarRating';
import { ReviewValidation } from '../validations/ReviewValidation';
import { addReview } from '../features/ReviewsSlice';
import { toggleSavedBook } from '../features/UserSlice';

const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatVerdictCopy = (count) => {
  if (!count) return 'No community ratings yet.';
  return `Based on ${count} ${count === 1 ? 'review' : 'reviews'}.`;
};

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reviewRef = useRef(null);
  const [sortOrder, setSortOrder] = useState('oldest');

  const book = useSelector((state) => state.books.books.find((b) => b.id === id));
  const reviews = useSelector((state) =>
    state.reviews.reviews.filter((r) => r.bookId === id)
  );
  const user = useSelector((state) => state.user.user);
  const saved = user.savedBooks?.includes(id);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    list.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === 'oldest' ? da - db : db - da;
    });
    return list;
  }, [reviews, sortOrder]);

  if (!book) {
    return (
      <div className="app-shell discover-shell">
        <Header showSearch />
        <main className="page-body">
          <Alert color="warning">Book not found.</Alert>
          <Button color="dark" onClick={() => navigate('/home')}>
            Back to books
          </Button>
        </main>
      </div>
    );
  }

  const handleReview = (values, { resetForm }) => {
    dispatch(
      addReview({
        bookId: book.id,
        userId: user.id,
        username: user.username || user.name,
        rating: values.rating,
        text: values.text,
      })
    );
    resetForm();
  };

  const openReviewForm = () => {
    reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app-shell discover-shell">
      <Header showSearch />
      <main className="page-body book-details-page">
        <nav className="book-breadcrumb">
          <Link to="/home">Discover</Link>
          <span>/</span>
          <span>{book.category}</span>
          <span>/</span>
          <strong>{book.title}</strong>
        </nav>

        <section className="book-hero-panel">
          <div className="book-hero-cover">
            {book.cover ? (
              <img src={book.cover} alt={book.title} />
            ) : (
              <div className="cover-placeholder">{book.title.slice(0, 1)}</div>
            )}
          </div>
          <div className="book-hero-info">
            <p className="book-genre">{book.category}</p>
            <h1>{book.title}</h1>
            <p className="book-hero-author">by {book.author}</p>
            <p className="book-hero-tagline">{book.description}</p>
            <p className="book-hero-rating">
              <FaStar /> {avg ? avg.toFixed(1) : '—'} out of 5
              <span>
                {' '}
                · {reviews.length} reader {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </p>
            <div className="book-hero-actions">
              <button type="button" className="btn-primary-ink" onClick={openReviewForm}>
                Write review
              </button>
              <button
                type="button"
                className="btn-secondary-ink"
                onClick={() => dispatch(toggleSavedBook(id))}
              >
                {saved ? 'Saved to shelf' : 'Save to my shelf'}
              </button>
            </div>
          </div>
        </section>

        <div className="book-details-layout">
          <div className="book-details-main">
            <section className="detail-card">
              <h2>Synopsis</h2>
              <p>{book.description}</p>
              <p className="book-meta-line">
                Published {book.year} · {book.pages} pages · {book.language}
              </p>
            </section>

            <section className="detail-card">
              <div className="reviews-head">
                <h2>Reader reviews ({reviews.length})</h2>
                <button
                  type="button"
                  className="reviews-sort-btn"
                  onClick={() =>
                    setSortOrder((s) => (s === 'oldest' ? 'newest' : 'oldest'))
                  }
                >
                  {sortOrder === 'oldest' ? 'Oldest first ↓' : 'Newest first ↓'}
                </button>
              </div>

              {sortedReviews.length === 0 && (
                <p className="text-muted mb-0">No reviews yet. Be the first.</p>
              )}

              {sortedReviews.map((r) => (
                <article key={r.id} className="reader-review">
                  <div className="reader-review-top">
                    <div className="reader-identity">
                      <span className="reader-avatar">
                        {(r.username || '?').slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <strong>{r.username}</strong>
                        <p>{formatDate(r.createdAt)}</p>
                      </div>
                    </div>
                    <p className="reader-score">
                      <FaStar /> {r.rating}/5
                    </p>
                  </div>
                  <p className="reader-text">{r.text}</p>
                </article>
              ))}
            </section>

            <section className="detail-card write-review-card" ref={reviewRef}>
              <h2>Write review</h2>
              <p className="write-review-as">
                Reviewing as {user.username || user.name} · Share your honest
                reading experience.
              </p>

              <Formik
                initialValues={{ text: '', rating: 0 }}
                validationSchema={ReviewValidation}
                onSubmit={handleReview}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className="rating-row">
                      <StarRating
                        editable
                        size={22}
                        value={values.rating}
                        onChange={(n) => setFieldValue('rating', n)}
                      />
                      <span className="rating-label">
                        Your rating: {values.rating ? `${values.rating}/5` : '—/5'}
                      </span>
                    </div>
                    <ErrorMessage name="rating" component="p" className="field-error" />

                    <FormGroup className="mt-3">
                      <Label for="text">Review</Label>
                      <Field
                        as="textarea"
                        name="text"
                        rows="5"
                        className="form-control write-review-input"
                        placeholder="What stayed with you after the last page?"
                        maxLength={2000}
                      />
                      <ErrorMessage name="text" component="p" className="field-error" />
                    </FormGroup>

                    <div className="write-review-footer">
                      <p className="write-review-hint">
                        Be kind. Avoid spoilers. {values.text.length} / 2,000
                        characters
                      </p>
                      <Button color="dark" type="submit" className="btn-primary-ink">
                        Submit review
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </section>
          </div>

          <aside className="book-details-side">
            <section className="detail-card verdict-card">
              <h2>The reader verdict</h2>
              <p className="verdict-score">
                {avg ? avg.toFixed(1) : '—'} <span>/ 5</span>
              </p>
              <p className="verdict-copy">
                {formatVerdictCopy(reviews.length)}
              </p>
              <p className="verdict-note">Illustrative community ratings.</p>
            </section>

            <section className="detail-card">
              <h2>Find the book nearby</h2>
              <div className="map-panel">
                <div className="map-roads">
                  <span className="map-label map-street">Chapter Street</span>
                  <span className="map-label map-park">Reading park</span>
                  <span className="map-pin" />
                </div>
                <div className="map-zoom">
                  <button type="button">+</button>
                  <button type="button">−</button>
                </div>
              </div>
              <div className="shop-block">
                <strong>{book.shopName || 'The Chapter House'}</strong>
                <p>
                  {book.shopAddress || '18 Chapter Street'} · Sample bookshop
                </p>
                <p className="shop-hours">Open today · 10:00–20:00</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;
