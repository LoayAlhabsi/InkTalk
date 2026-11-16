import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const reviews = useSelector((state) =>
    state.reviews.reviews.filter((r) => r.bookId === book.id)
  );

  const { avg, count } = useMemo(() => {
    if (!reviews.length) return { avg: 0, count: 0 };
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return { avg: sum / reviews.length, count: reviews.length };
  }, [reviews]);

  return (
    <article
      className="book-card discover-card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/book/${book.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/book/${book.id}`);
        }
      }}
    >
      <div className="book-cover-stage">
        {book.cover ? (
          <img src={book.cover} alt={book.title} />
        ) : (
          <div className="cover-placeholder">{book.title.slice(0, 1)}</div>
        )}
      </div>
      <div className="book-card-body">
        <div className="book-card-meta">
          <p className="book-genre">{book.category}</p>
          <h3>{book.title}</h3>
          <p className="book-author">{book.author}</p>
          <p className="book-desc">{book.description}</p>
          <p className="book-rating">
            <FaStar /> {avg ? avg.toFixed(1) : '—'} / 5
            <span>
              {' '}
              • {count} {count === 1 ? 'review' : 'reviews'}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
