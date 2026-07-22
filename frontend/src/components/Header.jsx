import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/header.css";

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    /* THÊM CLASS anim-group-1 VÀO ĐÂY ĐỂ TOÀN BỘ HEADER XUẤT HIỆN ĐẦU TIÊN */
    <header className="lucid-header anim-group-1">
      <div className="lucid-header-container">
        {/* LOGO CHỮ NGHỆ THUẬT KIỂU LUCID */}
        <div className="lucid-logo-wrap">
          <Link to="/" className="lucid-logo-text">
            H<span>G</span>
          </Link>
        </div>

        {/* MENU ĐIỀU HƯỚNG DÀN NGANG CỰC SANG */}
        <nav className="lucid-nav-bar">
          <ul>
            <li className={isActive("/") ? "active" : ""}>
              <Link to="/">Trang Chủ</Link>
            </li>
            <li className={isActive("/games") ? "active" : ""}>
              <Link to="/games">Trò Chơi</Link>
            </li>
            <li className={isActive("/events") ? "active" : ""}>
              <Link to="/events">Tin Tức & Sự Kiện</Link>
            </li>
            <li
              className={
                isActive("/booking") ||
                isActive("/orders") ||
                isActive("/order")
                  ? "active"
                  : ""
              }
            >
              <Link to={user ? "/booking" : "/login"}>Vé & Combo</Link>
            </li>
          </ul>
        </nav>

        {/* TÀI KHOẢN / ĐĂNG XUẤT */}
        <div className="lucid-account-action">
          {user ? (
            <Link to="/" className="lucid-btn-account" onClick={logout}>
              <i className="fa fa-sign-out-alt"></i>
              <span>Đăng xuất ({user.username})</span>
            </Link>
          ) : (
            <Link to="/login" className="lucid-btn-account">
              <i className="fa fa-user"></i>
              <span>Tài khoản</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
