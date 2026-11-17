import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { logout } from '../features/UserSlice';

const Header = ({
  variant = 'default',
  showSearch = false,
  search = '',
  onSearchChange,
}) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const isAdminVariant = variant === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  return (
    <header className={`app-header home-header ${isAdminVariant ? 'admin-header' : ''}`}>
      <div className="header-left">
        <button
          type="button"
          className="header-wordmark"
          onClick={() => navigate(isAdminVariant ? '/admin/books' : '/home')}
        >
          INKTALK
        </button>
        <nav className="header-links">
          {isAdminVariant ? (
            <>
              <NavLink to="/admin/books">Book management</NavLink>
              <NavLink to="/admin/users">Manage users</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/home">Discover</NavLink>
              <NavLink
                to="/home#shelf"
                onClick={(e) => {
                  if (window.location.pathname === '/home') {
                    e.preventDefault();
                    document.getElementById('my-shelf')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                My shelf
              </NavLink>
              <NavLink to="/profile">My reviews</NavLink>
              {isAdmin && <NavLink to="/admin/books">Admin</NavLink>}
            </>
          )}
        </nav>
      </div>

      {showSearch && (
        <div className="header-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      )}

      <div className="header-right">
        <button
          type="button"
          className="header-profile"
          onClick={() => navigate(isAdminVariant ? '/admin/books' : '/profile')}
        >
          <span className="header-avatar-circle">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="header-avatar-img" />
            ) : (
              <FaUserCircle />
            )}
          </span>
          <span className="header-profile-text">
            <strong>
              {isAdminVariant
                ? 'Administrator'
                : user?.username || user?.name || 'Reader'}
            </strong>
            <span>
              {isAdminVariant ? 'Admin workspace' : 'My profile'}{' '}
              <FaChevronDown size={10} />
            </span>
          </span>
        </button>

        {isAdminVariant && (
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
