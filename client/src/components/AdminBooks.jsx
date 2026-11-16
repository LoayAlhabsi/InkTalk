import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Header from './Header';

const GENRES = ['All genres', 'Fiction', 'History', 'Memoir', 'Self-development'];

const AdminBooks = () => {
  const books = useSelector((state) => state.books.books);
  const reviews = useSelector((state) => state.reviews.reviews);
  const users = useSelector((state) => state.user.users);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All genres');
  const [statusFilter, setStatusFilter] = useState('Published');

  const publishedCount = books.filter((b) => b.status === 'Published').length;
  const readerCount = users.filter((u) => u.role !== 'admin').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  const reviewCountByBook = useMemo(() => {
    const map = {};
    reviews.forEach((r) => {
      map[r.bookId] = (map[r.bookId] || 0) + 1;
    });
    return map;
  }, [reviews]);

  const statuses = useMemo(() => {
    const set = new Set(books.map((b) => b.status || 'Published'));
    return Array.from(set);
  }, [books]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((b) => {
      const matchGenre = genre === 'All genres' || b.category === genre;
      const matchStatus =
        statusFilter === 'all' || (b.status || 'Published') === statusFilter;
      const matchQ =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q);
      return matchGenre && matchStatus && matchQ;
    });
  }, [books, search, genre, statusFilter]);

  return (
    <div className="app-shell admin-shell">
      <Header variant="admin" />
      <main className="page-body admin-page">
        <section className="admin-hero">
          <div className="admin-hero-copy">
            <p className="admin-kicker">Admin workspace</p>
            <h1 className="page-heading">Book management</h1>
            <p className="admin-hero-sub">
              Keep the InkTalk shelf thoughtfully curated. Add a new title or
              update an existing book.
            </p>
          </div>
          <button
            type="button"
            className="admin-add-btn"
            onClick={() => navigate('/admin/books/add')}
          >
            + Add book
          </button>
        </section>

        <div className="stats-row admin-stats">
          <div className="stat-card">
            <span>Books in catalog</span>
            <strong>{books.length}</strong>
            <small>
              {publishedCount === books.length
                ? 'All titles published'
                : `${publishedCount} published`}
            </small>
          </div>
          <div className="stat-card">
            <span>Reader reviews</span>
            <strong>{reviews.length}</strong>
            <small>Across the complete catalog</small>
          </div>
          <div className="stat-card">
            <span>User accounts</span>
            <strong>{users.length}</strong>
            <small>
              {readerCount} reader{readerCount === 1 ? '' : 's'} · {adminCount}{' '}
              administrator{adminCount === 1 ? '' : 's'}
            </small>
          </div>
        </div>

        <div className="side-card table-card admin-table-card">
          <div className="admin-table-toolbar">
            <div className="admin-table-search">
              <FaSearch className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search books"
              />
            </div>
            <div className="admin-table-filters">
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                aria-label="Filter by genre"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                    {s === 'Published' ? ` (${publishedCount})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-books-table">
              <thead>
                <tr>
                  <th>Book / Author</th>
                  <th>Genre</th>
                  <th>Reviews</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-empty-row">
                      No books match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => {
                    const count = reviewCountByBook[b.id] || 0;
                    return (
                      <tr key={b.id}>
                        <td>
                          <div className="table-book">
                            {b.cover ? (
                              <img src={b.cover} alt="" />
                            ) : (
                              <div className="mini-cover">{b.title.slice(0, 1)}</div>
                            )}
                            <div className="table-book-meta">
                              <strong>{b.title}</strong>
                              <span>{b.author}</span>
                            </div>
                          </div>
                        </td>
                        <td>{b.category}</td>
                        <td>
                          {count} Review{count === 1 ? '' : 's'}
                        </td>
                        <td>
                          <span className="status-pill published">
                            {b.status || 'Published'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-row-actions">
                            <button
                              type="button"
                              className="edit-book-btn"
                              onClick={() => navigate(`/admin/books/${b.id}/edit`)}
                            >
                              Edit book
                            </button>
                            <Link to={`/book/${b.id}`} className="view-book-link">
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="admin-table-footer">
            <span>
              Showing {filtered.length === books.length ? 'all ' : ''}
              {filtered.length} book{filtered.length === 1 ? '' : 's'}
            </span>
            <span>Page 1 of 1</span>
          </div>
        </div>

        <footer className="admin-page-footer">
          <p>
            Sample counts and supplemental reviews are illustrative, not live
            activity.
          </p>
          <button
            type="button"
            className="admin-footer-link"
            onClick={() => navigate('/admin/users')}
          >
            Manage users →
          </button>
        </footer>
      </main>
    </div>
  );
};

export default AdminBooks;
