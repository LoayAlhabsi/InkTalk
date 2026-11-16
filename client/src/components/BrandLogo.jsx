import { Link } from 'react-router-dom';
import logo from '../assets/inktalk-logo.png';

const BrandLogo = ({ to = '/home', compact = false, className = '' }) => {
  return (
    <Link
      to={to}
      className={`brand-logo ${compact ? 'brand-logo-compact' : 'brand-logo-auth'} ${className}`}
    >
      <span className="brand-logo-frame">
        <img src={logo} alt="InkTalk" />
      </span>
    </Link>
  );
};

export default BrandLogo;
