import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa';
import Header from './Header';
import { setUserRole, setUserStatus } from '../features/UserSlice';

const formatJoined = (value) => {
  if (!value) return 'Unknown';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
};

const roleLabel = (role) => (role === 'admin' ? 'Admin' : 'Reader');

const AdminUsers = () => {
  const users = useSelector((state) => state.user.users);
  const current = useSelector((state) => state.user.user);
  const reviews = useSelector((state) => state.reviews.reviews);
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(() => users[0]?.id || null);
  const [draftRole, setDraftRole] = useState(
    () => (users[0]?.role === 'admin' ? 'admin' : 'user')
  );

  const reviewCountByUser = useMemo(() => {
    const map = {};
    reviews.forEach((r) => {
      map[r.userId] = (map[r.userId] || 0) + 1;
    });
    return map;
  }, [reviews]);

  const stats = useMemo(() => {
    const active = users.filter((u) => u.status === 'active').length;
    const suspended = users.filter((u) => u.status === 'suspended').length;
    return {
      total: users.length,
      active,
      suspended,
      reviews: reviews.length,
    };
  }, [users, reviews]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchRole =
        roleFilter === 'all' ||
        (roleFilter === 'admin' ? u.role === 'admin' : u.role !== 'admin');
      const matchStatus =
        statusFilter === 'all' || (u.status || 'active') === statusFilter;
      const matchQ =
        !q ||
        (u.username || '').toLowerCase().includes(q) ||
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q);
      return matchRole && matchStatus && matchQ;
    });
  }, [users, search, roleFilter, statusFilter]);

  const selected =
    users.find((u) => u.id === selectedId) || filtered[0] || null;

  useEffect(() => {
    if (!selected) return;
    if (selected.id !== selectedId) {
      setSelectedId(selected.id);
    }
    setDraftRole(selected.role === 'admin' ? 'admin' : 'user');
  }, [selected?.id, selected?.role]);

  const selectedReviewCount = selected
    ? reviewCountByUser[selected.id] || 0
    : 0;
  const isProtected =
    !!selected && (selected.role === 'admin' || selected.id === current?.id);

  const openAccount = (user) => {
    setSelectedId(user.id);
    setDraftRole(user.role === 'admin' ? 'admin' : 'user');
  };

  const handleSaveRole = () => {
    if (!selected || isProtected) return;
    dispatch(setUserRole({ id: selected.id, role: draftRole }));
  };

  const handleToggleStatus = (user) => {
    if (!user || user.role === 'admin' || user.id === current?.id) return;
    const next = user.status === 'suspended' ? 'active' : 'suspended';
    dispatch(setUserStatus({ id: user.id, status: next }));
  };

  return (
    <div className="app-shell admin-shell">
      <Header variant="admin" />
      <main className="page-body admin-page admin-users-page">
        <header className="admin-form-hero">
          <p className="admin-kicker">Community administration</p>
          <h1 className="page-heading">Manage users</h1>
          <p className="admin-hero-sub">
            Find reader accounts, review their activity, and manage access
            responsibly.
          </p>
        </header>

        <div className="admin-users-stats">
          <div>
            <strong>{stats.total}</strong>
            <span>Total accounts</span>
          </div>
          <div>
            <strong>{stats.active}</strong>
            <span>Active accounts</span>
          </div>
          <div>
            <strong>{stats.suspended}</strong>
            <span>Disabled account{stats.suspended === 1 ? '' : 's'}</span>
          </div>
          <div>
            <strong>{stats.reviews}</strong>
            <span>Published reviews</span>
          </div>
        </div>

        <div className="admin-users-layout">
          <section className="side-card table-card admin-table-card">
            <div className="admin-table-toolbar">
              <div className="admin-table-search">
                <FaSearch className="admin-search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search users"
                />
              </div>
              <div className="admin-table-filters">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  aria-label="Filter by role"
                >
                  <option value="all">All roles</option>
                  <option value="user">Readers</option>
                  <option value="admin">Admins</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Disabled</option>
                </select>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-books-table admin-users-table">
                <thead>
                  <tr>
                    <th>User / Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Reviews</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="admin-empty-row">
                        No accounts match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => {
                      const count = reviewCountByUser[u.id] || 0;
                      const isSelected = selected?.id === u.id;
                      const protectedRow =
                        u.role === 'admin' || u.id === current?.id;
                      return (
                        <tr
                          key={u.id}
                          className={isSelected ? 'is-selected' : ''}
                          onClick={() => openAccount(u)}
                        >
                          <td>
                            <div className="admin-user-cell">
                              <strong>{u.username || u.name}</strong>
                              <span>{u.email}</span>
                            </div>
                          </td>
                          <td>{roleLabel(u.role)}</td>
                          <td>
                            <span
                              className={`status-pill ${
                                u.status === 'suspended'
                                  ? 'suspended'
                                  : 'published'
                              }`}
                            >
                              {u.status === 'suspended' ? 'Disabled' : 'Active'}
                            </span>
                          </td>
                          <td>
                            {count} review{count === 1 ? '' : 's'}
                          </td>
                          <td>
                            <div className="admin-row-actions">
                              <button
                                type="button"
                                className="edit-book-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAccount(u);
                                }}
                              >
                                View
                              </button>
                              {protectedRow ? (
                                <span className="admin-protected-label">Protected</span>
                              ) : u.status === 'suspended' ? (
                                <button
                                  type="button"
                                  className="admin-linkish restore"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStatus(u);
                                  }}
                                >
                                  Enable
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="admin-linkish suspend"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStatus(u);
                                  }}
                                >
                                  Disable
                                </button>
                              )}
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
                Showing {filtered.length === users.length ? 'all ' : ''}
                {filtered.length} account{filtered.length === 1 ? '' : 's'}
              </span>
              <span>1 of 1</span>
            </div>
          </section>

          <aside className="admin-users-side">
            {selected ? (
              <section className="admin-selected-card">
                <p className="admin-selected-kicker">Selected account</p>
                <div className="admin-selected-head">
                  <h2>{selected.username || selected.name}</h2>
                  <span
                    className={`status-pill ${
                      selected.status === 'suspended' ? 'suspended' : 'published'
                    }`}
                  >
                    {selected.status === 'suspended' ? 'Disabled' : 'Active'}
                  </span>
                </div>
                <p className="admin-selected-email">{selected.email}</p>
                <p className="admin-selected-meta">
                  Joined {formatJoined(selected.joined)} · {selectedReviewCount}{' '}
                  published review{selectedReviewCount === 1 ? '' : 's'}
                </p>

                <div className="admin-field">
                  <label htmlFor="account-role">Account role</label>
                  <select
                    id="account-role"
                    className="form-control"
                    value={draftRole}
                    onChange={(e) => setDraftRole(e.target.value)}
                    disabled={isProtected}
                  >
                    <option value="user">Reader</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="admin-save-btn admin-users-save-role"
                  onClick={handleSaveRole}
                  disabled={
                    isProtected ||
                    draftRole === (selected.role === 'admin' ? 'admin' : 'user')
                  }
                >
                  Save role
                </button>

                {isProtected ? (
                  <p className="admin-selected-note protected">
                    Administrator accounts are protected and cannot be disabled
                    or reassigned from this panel.
                  </p>
                ) : (
                  <>
                    <button
                      type="button"
                      className={
                        selected.status === 'suspended'
                          ? 'admin-restore-account-btn'
                          : 'admin-suspend-account-btn'
                      }
                      onClick={() => handleToggleStatus(selected)}
                    >
                      {selected.status === 'suspended'
                        ? 'Enable account'
                        : 'Disable account'}
                    </button>
                    <p className="admin-selected-note">
                      Disable blocks login and new reviews. Existing reviews
                      remain visible on the shelf.
                    </p>
                  </>
                )}
              </section>
            ) : (
              <section className="admin-selected-card">
                <p className="admin-selected-kicker">Selected account</p>
                <h2>No account selected</h2>
                <p className="admin-selected-note">
                  Choose a row to review role and access controls.
                </p>
              </section>
            )}

            <section className="admin-notes-card">
              <h3>Administration notes</h3>
              <p>
                The administrator account is protected. Role changes and
                disable actions should be confirmed before applying. These accounts
                and activity totals are illustrative.
              </p>
            </section>
          </aside>
        </div>

        <footer className="admin-site-footer">
          <strong>INKTALK</strong>
          <span>Reviews that write the story</span>
        </footer>
      </main>
    </div>
  );
};

export default AdminUsers;
