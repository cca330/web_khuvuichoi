import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/admin.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/tickets', label: '🎫 Doanh thu', icon: 'fa-ticket' },
    { path: '/admin/games', label: '🎮 Quản lý trò chơi', icon: 'fa-gamepad' },
    { path: '/admin/users', label: '👤 Quản lý người dùng', icon: 'fa-user' },
    { path: '/admin/feedbacks', label: '💬 Đánh giá', icon: 'fa-comment' },
    { path: '/admin/promotions', label: '🎁 Quản lý khuyến mãi', icon: 'fa-gift' },
    { path: '/admin/events', label: '🎡 Quản lý sự kiện', icon: 'fa-calendar' },
  ];

  return (
    <aside className="sidebar">
      <h2 className="logo">🎡 Admin</h2>

      <ul className="menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link to="/login" className="logout">🚪 Đăng xuất</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
