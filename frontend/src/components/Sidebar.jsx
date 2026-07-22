import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/adminSidebar.css"; // Import file CSS tách biệt hoàn toàn

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/tickets", label: "Doanh thu", icon: "🎫" },
    { path: "/admin/games", label: "Quản lý trò chơi", icon: "🎮" },
    { path: "/admin/users", label: "Quản lý người dùng", icon: "👤" },
    { path: "/admin/feedbacks", label: "Đánh giá", icon: "💬" },
    { path: "/admin/promotions", label: "Quản lý khuyến mãi", icon: "🎁" },
    { path: "/admin/events", label: "Quản lý sự kiện", icon: "🎡" },
  ];

  return (
    <aside className="adm-sidebar-container">
      {/* Brand/Logo Area */}
      <div className="adm-sidebar-brand">
        <div className="adm-brand-icon">🎡</div>
        <div className="adm-brand-text">
          <h2>HG Admin</h2>
          <span>Management Portal</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="adm-sidebar-nav">
        <div className="adm-nav-group-title">MAIN MENU</div>
        <ul className="adm-menu-list">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className="adm-menu-item">
                <Link
                  to={item.path}
                  className={`adm-menu-link ${isActive ? "active" : ""}`}
                >
                  <span className="adm-menu-icon">{item.icon}</span>
                  <span className="adm-menu-label">{item.label}</span>
                  {isActive && <span className="adm-active-pill"></span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Logout Area */}
      <div className="adm-sidebar-footer">
        <Link to="/login" className="adm-logout-btn">
          <span className="adm-logout-icon">🚪</span>
          <span className="adm-logout-text">Đăng xuất</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
