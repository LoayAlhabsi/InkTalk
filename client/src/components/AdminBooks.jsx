import { Button, Table } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Header from './Header';
import { deleteBook } from '../features/BooksSlice';

const AdminBooks = () => {
  const books = useSelector((state) => state.books.books);
  const reviews = useSelector((state) => state.reviews.reviews);
  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <Header />
      <main className="page-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-heading">Book management</h1>
          <Button color="dark" onClick={() => navigate('/admin/books/add')}>
            Add book
          </Button>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span>Total books</span>
            <strong>{books.length}</strong>
          </div>
          <div className="stat-card">
            <span>Total reviews</span>
            <strong>{reviews.length}</strong>
          </div>
          <div className="stat-card">
            <span>Total users</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        <div className="side-card table-card">
          <Table responsive hover className="mb-0 admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="table-book">
                      {b.cover ? (
                        <img src={b.cover} alt="" />
                      ) : (
                        <div className="mini-cover">{b.title.slice(0, 1)}</div>
                      )}
                      <span>{b.title}</span>
                    </div>
                  </td>
                  <td>{b.author}</td>
                  <td>{b.category}</td>
                  <td>{b.status}</td>
                  <td className="action-cell">
                    <button
                      type="button"
                      className="icon-btn edit"
                      title="Edit"
                      onClick={() => navigate(`/admin/books/${b.id}/edit`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      className="icon-btn delete"
                      title="Delete"
                      onClick={() => {
                        if (window.confirm(`Delete "${b.title}"?`)) {
                          dispatch(deleteBook(b.id));
                        }
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminBooks;
