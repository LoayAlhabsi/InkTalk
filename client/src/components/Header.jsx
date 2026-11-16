import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSearch, FaUserCircle, FaChevronDown } from 'react-icons/fa';

const Header = ({ showSearch = false, search = '', onSearchChange }) => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  return (
    <header className="app-header home-header">
      <div className="header-left">
        <button
          type="button"
          className="header-wordmark"
          onClick={() => navigate('/home')}
        >
          INKTALK
        </button>
        <nav className="header-links">
          <NavLink to="/home">Discover</NavLink>
          <NavLink to="/profile">My reviews</NavLink>
          {isAdmin && <NavLink to="/admin/books">Admin</NavLink>}
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

      <button
        type="button"
        className="header-profile"
        onClick={() => navigate('/profile')}
      >
        <span className="header-avatar-circle">
          <FaUserCircle />
        </span>
        <span className="header-profile-text">
          <strong>{user?.username || user?.name || 'Reader'}</strong>
          <span>
            My profile <FaChevronDown size={10} />
          </span>
        </span>
      </button>
    </header>
  );
};

export default Header;
