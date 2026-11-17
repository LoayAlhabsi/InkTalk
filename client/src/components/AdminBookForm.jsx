import { useMemo, useRef, useState } from 'react';
import { Alert } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import Header from './Header';
import { BookFormValidation } from '../validations/BookFormValidation';
import { addBook, updateBook, deleteBook } from '../features/BooksSlice';
import { deleteReviewsByBook } from '../features/ReviewsSlice';

const GENRES = ['Fiction', 'History', 'Memoir', 'Self-development'];
const LANGUAGES = ['English', 'Arabic', 'French', 'Spanish', 'German'];

const emptyBook = {
  title: '',
  author: '',
  category: '',
  isbn: '',
  description: '',
  synopsis: '',
  year: '',
  pages: '',
  language: 'English',
  cover: '',
  shopName: '',
  shopAddress: '',
};

const formatUpdated = (value) => {
  if (!value) return 'Not saved yet';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const coverKind = (url) => {
  if (!url) return 'None';
  const lower = url.toLowerCase();
  if (lower.includes('.png')) return 'PNG';
  if (lower.includes('.webp')) return 'WEBP';
  if (lower.includes('.gif')) return 'GIF';
  return 'JPG';
};

const AdminBookForm = ({ mode = 'add' }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const coverInputRef = useRef(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showCoverUrl, setShowCoverUrl] = useState(false);

  const existing = useSelector((state) =>
    mode === 'edit' ? state.books.books.find((b) => b.id === id) : null
  );
  const reviews = useSelector((state) =>
    mode === 'edit'
      ? state.reviews.reviews.filter((r) => r.bookId === id)
      : []
  );

  const reviewStats = useMemo(() => {
    if (!reviews.length) return { avg: 0, count: 0 };
    const avg =
      reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length;
    return { avg, count: reviews.length };
  }, [reviews]);

  if (mode === 'edit' && !existing) {
    return (
      <div className="app-shell admin-shell">
        <Header variant="admin" />
        <main className="page-body admin-page">
          <Alert color="warning">Book not found.</Alert>
        </main>
      </div>
    );
  }

  const initialValues =
    mode === 'edit'
      ? {
          title: existing.title,
          author: existing.author,
          category: existing.category,
          isbn: existing.isbn || '',
          description: existing.description || '',
          synopsis: existing.synopsis || existing.description || '',
          year: existing.year,
          pages: existing.pages,
          language: existing.language || 'English',
          cover: existing.cover || '',
          shopName: existing.shopName || '',
          shopAddress: existing.shopAddress || '',
        }
      : emptyBook;

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      year: Number(values.year),
      pages: Number(values.pages),
      cover: values.cover || '',
      isbn: values.isbn || '',
      synopsis: values.synopsis || values.description,
    };
    if (mode === 'edit') {
      dispatch(updateBook({ id, ...payload }));
    } else {
      dispatch(addBook(payload));
    }
    navigate('/admin/books', { replace: true });
  };

  const confirmDelete = () => {
    dispatch(deleteBook(id));
    dispatch(deleteReviewsByBook(id));
    navigate('/admin/books', { replace: true });
  };

  const bookTitle = existing?.title || 'this book';
  const isEdit = mode === 'edit';

  return (
    <div className="app-shell admin-shell">
      <Header variant="admin" />
      <main className="page-body admin-page admin-form-page">
        <nav className="admin-breadcrumb" aria-label="Breadcrumb">
          <Link to="/admin/books">Book management</Link>
          <span>/</span>
          {isEdit ? (
            <>
              <Link to={`/book/${id}`}>{existing.title}</Link>
              <span>/</span>
              <strong>Edit book</strong>
            </>
          ) : (
            <strong>Add book</strong>
          )}
        </nav>

        <header className="admin-form-hero">
          <p className="admin-kicker">Curate the details</p>
          <h1 className="page-heading">{isEdit ? 'Edit book' : 'Add book'}</h1>
          <p className="admin-hero-sub">
            {isEdit
              ? `Update ${existing.title}. Changes are visible to readers when you save.`
              : 'Add a new title to the InkTalk catalog. Required fields are marked with an asterisk.'}
          </p>
        </header>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={BookFormValidation}
          onSubmit={handleSubmit}
        >
          {({ values, dirty, isSubmitting }) => (
            <Form className="admin-book-form">
              <div className="admin-form-layout">
                <div className="admin-form-main">
                  <section className="admin-form-card">
                    <h2>Book information</h2>

                    <div className="admin-field">
                      <label htmlFor="title">
                        Book title <span className="req">*</span>
                      </label>
                      <Field id="title" name="title" className="form-control" />
                      <ErrorMessage name="title" component="p" className="field-error" />
                    </div>

                    <div className="admin-field">
                      <label htmlFor="author">
                        Author <span className="req">*</span>
                      </label>
                      <Field id="author" name="author" className="form-control" />
                      <ErrorMessage name="author" component="p" className="field-error" />
                    </div>

                    <div className="admin-field-grid two">
                      <div className="admin-field">
                        <label htmlFor="category">
                          Genre <span className="req">*</span>
                        </label>
                        <Field
                          as="select"
                          id="category"
                          name="category"
                          className="form-control"
                        >
                          <option value="">Select genre</option>
                          {GENRES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="p"
                          className="field-error"
                        />
                      </div>
                      <div className="admin-field">
                        <label htmlFor="isbn">ISBN</label>
                        <Field id="isbn" name="isbn" className="form-control" />
                        <ErrorMessage name="isbn" component="p" className="field-error" />
                      </div>
                    </div>

                    <div className="admin-field">
                      <label htmlFor="description">
                        Short description <span className="req">*</span>
                      </label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows="2"
                        className="form-control"
                      />
                      <p className="field-hint">Shown on the book card.</p>
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="field-error"
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor="synopsis">
                        Complete synopsis <span className="req">*</span>
                      </label>
                      <Field
                        as="textarea"
                        id="synopsis"
                        name="synopsis"
                        rows="5"
                        className="form-control"
                      />
                      <p className="field-hint">
                        Complete synopsis shown on the book details page.
                      </p>
                      <ErrorMessage
                        name="synopsis"
                        component="p"
                        className="field-error"
                      />
                    </div>

                    <div className="admin-field-grid three">
                      <div className="admin-field">
                        <label htmlFor="year">Publication year</label>
                        <Field
                          id="year"
                          name="year"
                          type="number"
                          className="form-control"
                        />
                        <ErrorMessage name="year" component="p" className="field-error" />
                      </div>
                      <div className="admin-field">
                        <label htmlFor="pages">Pages</label>
                        <Field
                          id="pages"
                          name="pages"
                          type="number"
                          className="form-control"
                        />
                        <ErrorMessage name="pages" component="p" className="field-error" />
                      </div>
                      <div className="admin-field">
                        <label htmlFor="language">Language</label>
                        <Field
                          as="select"
                          id="language"
                          name="language"
                          className="form-control"
                        >
                          {LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="language"
                          component="p"
                          className="field-error"
                        />
                      </div>
                    </div>
                  </section>

                  <section className="admin-form-card">
                    <h2>Bookshop location</h2>
                    <p className="admin-card-note">
                      Illustrative map location—not live geolocation or verified stock.
                    </p>
                    <div className="admin-field-grid two">
                      <div className="admin-field">
                        <label htmlFor="shopName">Bookshop name</label>
                        <Field id="shopName" name="shopName" className="form-control" />
                      </div>
                      <div className="admin-field">
                        <label htmlFor="shopAddress">Address</label>
                        <Field
                          id="shopAddress"
                          name="shopAddress"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </section>

                  <div className="admin-form-actions">
                    <p className="admin-updated">
                      {isEdit
                        ? `Last updated ${formatUpdated(existing.updatedAt)}`
                        : 'New catalog entry'}
                    </p>
                    <div className="admin-form-actions-btns">
                      <button
                        type="button"
                        className="admin-cancel-btn"
                        onClick={() => navigate('/admin/books')}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="admin-save-btn"
                        disabled={isSubmitting || (isEdit && !dirty)}
                      >
                        {isEdit ? 'Save changes' : 'Add book'}
                      </button>
                    </div>
                  </div>

                  {isEdit && (
                    <section className="admin-danger-card">
                      <div>
                        <h2>Delete this book</h2>
                        <p>
                          Remove {bookTitle} from the catalog. This permanently removes
                          its book details and {reviewStats.count} associated reader
                          review{reviewStats.count === 1 ? '' : 's'}.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="admin-delete-btn"
                        onClick={() => setShowDelete(true)}
                      >
                        Delete book
                      </button>
                    </section>
                  )}
                </div>

                <aside className="admin-form-side">
                  <section className="admin-cover-card">
                    {isEdit && (
                      <span className="status-pill published admin-cover-status">
                        {existing.status || 'Published'}
                      </span>
                    )}
                    <div className="admin-cover-preview">
                      {values.cover ? (
                        <img src={values.cover} alt="" />
                      ) : (
                        <div className="admin-cover-empty">
                          {values.title?.slice(0, 1) || 'B'}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="admin-replace-cover-btn"
                      onClick={() => {
                        setShowCoverUrl((v) => !v);
                        setTimeout(() => coverInputRef.current?.focus(), 0);
                      }}
                    >
                      {values.cover ? 'Replace cover' : 'Add cover'}
                    </button>
                    {(showCoverUrl || !values.cover) && (
                      <div className="admin-field admin-cover-url-field">
                        <label htmlFor="cover">Cover image URL</label>
                        <Field
                          innerRef={coverInputRef}
                          id="cover"
                          name="cover"
                          className="form-control"
                          placeholder="https://..."
                        />
                        <ErrorMessage name="cover" component="p" className="field-error" />
                      </div>
                    )}
                    <p className="admin-cover-meta">
                      Current cover · {coverKind(values.cover)}
                    </p>
                    {isEdit && (
                      <p className="admin-cover-meta">
                        Ratings:{' '}
                        {reviewStats.count
                          ? `${reviewStats.avg.toFixed(1)}/5 from ${reviewStats.count} reader review${reviewStats.count === 1 ? '' : 's'}`
                          : 'No reader reviews yet'}
                      </p>
                    )}
                  </section>
                </aside>
              </div>
            </Form>
          )}
        </Formik>

        {showDelete && (
          <div
            className="admin-delete-overlay"
            role="presentation"
            onClick={() => setShowDelete(false)}
          >
            <div
              className="admin-delete-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-book-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="admin-delete-close"
                aria-label="Close"
                onClick={() => setShowDelete(false)}
              >
                <FaTimes />
              </button>
              <h3 id="delete-book-title">Are you sure you want to delete?</h3>
              <button
                type="button"
                className="admin-delete-confirm-btn"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                type="button"
                className="admin-keep-btn"
                onClick={() => setShowDelete(false)}
              >
                No
              </button>
            </div>
          </div>
        )}

        <footer className="admin-site-footer">
          <strong>INKTALK</strong>
          <span>Reviews that write the story</span>
        </footer>
      </main>
    </div>
  );
};

export default AdminBookForm;
