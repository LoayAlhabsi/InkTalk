import { Alert, Button, Col, FormGroup, Label, Row } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import { BookFormValidation } from '../validations/BookFormValidation';
import { addBook, updateBook, deleteBook } from '../features/BooksSlice';

const emptyBook = {
  title: '',
  author: '',
  category: '',
  description: '',
  year: '',
  pages: '',
  language: 'English',
  cover: '',
  shopName: '',
  shopAddress: '',
};

const AdminBookForm = ({ mode = 'add' }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const existing = useSelector((state) =>
    mode === 'edit' ? state.books.books.find((b) => b.id === id) : null
  );

  if (mode === 'edit' && !existing) {
    return (
      <div className="app-shell">
        <Header />
        <main className="page-body">
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
          description: existing.description,
          year: existing.year,
          pages: existing.pages,
          language: existing.language,
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
    };
    if (mode === 'edit') {
      dispatch(updateBook({ id, ...payload }));
    } else {
      dispatch(addBook(payload));
    }
    navigate('/admin/books', { replace: true });
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="page-body">
        <button type="button" className="back-link" onClick={() => navigate('/admin/books')}>
          ← Back to books
        </button>
        <h1 className="page-heading">
          {mode === 'edit' ? 'Edit book' : 'Add book'}
        </h1>

        <div className="side-card form-wide">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={BookFormValidation}
            onSubmit={handleSubmit}
          >
            <Form>
              <h3 className="form-section-title">Book information</h3>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label>Title</Label>
                    <Field name="title" className="form-control" />
                    <ErrorMessage name="title" component="p" className="field-error" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Author</Label>
                    <Field name="author" className="form-control" />
                    <ErrorMessage name="author" component="p" className="field-error" />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label>Description</Label>
                <Field as="textarea" name="description" rows="4" className="form-control" />
                <ErrorMessage name="description" component="p" className="field-error" />
              </FormGroup>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>Category</Label>
                    <Field as="select" name="category" className="form-control">
                      <option value="">Select...</option>
                      <option>Fiction</option>
                      <option>History</option>
                      <option>Science</option>
                      <option>Memoir</option>
                      <option>Art & Architecture</option>
                    </Field>
                    <ErrorMessage name="category" component="p" className="field-error" />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Publication year</Label>
                    <Field name="year" type="number" className="form-control" />
                    <ErrorMessage name="year" component="p" className="field-error" />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Pages</Label>
                    <Field name="pages" type="number" className="form-control" />
                    <ErrorMessage name="pages" component="p" className="field-error" />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label>Language</Label>
                <Field name="language" className="form-control" />
                <ErrorMessage name="language" component="p" className="field-error" />
              </FormGroup>

              <h3 className="form-section-title">Book cover</h3>
              <FormGroup>
                <Label>Cover image URL</Label>
                <Field
                  name="cover"
                  className="form-control"
                  placeholder="https://..."
                />
                <ErrorMessage name="cover" component="p" className="field-error" />
              </FormGroup>

              <h3 className="form-section-title">Bookshop location (optional)</h3>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label>Shop name</Label>
                    <Field name="shopName" className="form-control" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Address</Label>
                    <Field name="shopAddress" className="form-control" />
                  </FormGroup>
                </Col>
              </Row>

              <div className="d-flex gap-2 flex-wrap">
                <Button color="dark" type="submit">
                  {mode === 'edit' ? 'Save changes' : 'Add book'}
                </Button>
                {mode === 'edit' && (
                  <Button
                    color="danger"
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Delete this book permanently? This cannot be undone.'
                        )
                      ) {
                        dispatch(deleteBook(id));
                        navigate('/admin/books', { replace: true });
                      }
                    }}
                  >
                    Delete book
                  </Button>
                )}
              </div>
            </Form>
          </Formik>
        </div>
      </main>
    </div>
  );
};

export default AdminBookForm;
