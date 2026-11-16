import { Table, Badge } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import Header from './Header';
import { deleteUser, setUserRole } from '../features/UserSlice';

const AdminUsers = () => {
  const users = useSelector((state) => state.user.users);
  const current = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const activeCount = users.filter((u) => u.status === 'active').length;

  return (
    <div className="app-shell">
      <Header />
      <main className="page-body">
        <h1 className="page-heading mb-4">Manage users</h1>

        <div className="stats-row">
          <div className="stat-card">
            <span>Total users</span>
            <strong>{users.length}</strong>
          </div>
          <div className="stat-card">
            <span>Active users</span>
            <strong>{activeCount}</strong>
          </div>
          <div className="stat-card">
            <span>Admins</span>
            <strong>{users.filter((u) => u.role === 'admin').length}</strong>
          </div>
        </div>

        <div className="side-card table-card">
          <Table responsive hover className="mb-0 admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name}</strong>{' '}
                    {u.status === 'active' ? (
                      <Badge color="success">Active</Badge>
                    ) : (
                      <Badge color="secondary">Inactive</Badge>
                    )}
                  </td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={u.role}
                      onChange={(e) =>
                        dispatch(setUserRole({ id: u.id, role: e.target.value }))
                      }
                      disabled={u.id === current.id}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{u.joined}</td>
                  <td>
                    <button
                      type="button"
                      className="icon-btn delete"
                      title="Delete user"
                      disabled={u.id === current.id}
                      onClick={() => {
                        if (window.confirm(`Delete user ${u.email}?`)) {
                          dispatch(deleteUser(u.id));
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

export default AdminUsers;
