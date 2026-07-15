import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/header.css';

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="row header__inner">
          <div className="header__brand">
            <div className="header__logo">
              <Link to="/">
                <img src="/img/lg3.png" width="100px" height="100px" alt="logo" />
              </Link>
            </div>
          </div>
          <div className="header__nav-wrap">
            <nav className="header__menu">
              <ul>
                <li className={isActive('/') ? 'active' : ''}>
                  <Link to="/">Trang Chủ</Link>
                </li>
                <li className={isActive('/games') ? 'active' : ''}>
                  <Link to="/games">Trò Chơi</Link>
                </li>
                <li className={isActive('/events') ? 'active' : ''}>
                  <Link to="/events">Tin Tức & Sự Kiện</Link>
                </li>
                <li className={isActive('/tickets') || location.pathname.startsWith('/tickets') ? 'active' : ''}>
                  <Link to={user?.role === 'ADMIN' ? '/admin/tickets' : '/tickets'}>Đặt vé</Link>
                </li>
                <li className={isActive('/promotions') ? 'active' : ''}>
                  <Link to="/promotions">Khuyến Mãi</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="dropdown header__account">
            {user ? (
              <>
                <Link to="/" className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                  onClick={logout}>
                  <i className="fa fa-sign-out-alt me-2"></i>
                  Đăng xuất ({user.username})
                </Link>
              </>
            ) : (
              <Link to="/login" className="btn btn-outline-primary dropdown-toggle d-flex align-items-center">
                <i className="fa fa-user me-2"></i>
                Tài khoản
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;