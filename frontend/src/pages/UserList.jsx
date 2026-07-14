import { useState, useEffect } from 'react';
import userApi from '../api/userApi';
import '../styles/userList.css';

const PER_PAGE = 10;

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load users lần đầu
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await userApi.getAll();
      setUsers(res.data);
      setFilteredList(res.data);
    } catch (err) {
      console.error('LOAD USER ERROR:', err);
    }
  };

  // Search — tự động lọc lại khi gõ
  useEffect(() => {
    const keyword = search.toLowerCase();
    let list = users;

    if (statusFilter !== 'all') {
      list = list.filter((u) => u.status === statusFilter);
    }
    if (keyword) {
      list = list.filter((u) => (u.username + u.email).toLowerCase().includes(keyword));
    }

    setFilteredList(list);
    setCurrentPage(1);
  }, [search, statusFilter, users]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const openSidebarWithData = (u) => {
    setSelectedUser(u);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateStatus = async (newStatus) => {
    const actionText = newStatus === 'BLOCK' ? 'KHÓA' : 'MỞ';
    if (!window.confirm(`Bạn có chắc muốn ${actionText} tài khoản này?`)) return;

    try {
      await userApi.updateStatus(selectedUser.id, newStatus);
      closeSidebar();
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const total = filteredList.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const start = (currentPage - 1) * PER_PAGE;
  const end = Math.min(start + PER_PAGE, total);
  const pageData = filteredList.slice(start, end);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Danh sách tài khoản người dùng</h1>
          <p className="muted">{users.length} users</p>
        </div>
      </div>

      <div className="search-box">
        <i className="bx bx-search"></i>
        <input
          placeholder="Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filters">
        {['all', 'ACTIVE', 'BLOCK'].map((status) => (
          <div
            key={status}
            className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status === 'all' ? 'Tất cả' : status === 'ACTIVE' ? 'Đang hoạt động' : 'Khóa'}
          </div>
        ))}
      </div>

      <div className="table-wrap admin-table">
        <table>
          <thead>
            <tr>
              <th>Tên tài khoản</th>
              <th>Mật khẩu</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Thời gian tạo</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((u) => (
              <tr key={u.id} onClick={() => openSidebarWithData(u)}>
                <td>{u.username}</td>
                <td>••••••••</td>
                <td>{u.email}</td>
                <td>
                  <span className={`status-tag ${u.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                    {u.status}
                  </span>
                </td>
                <td>{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="page-rows">
          <label>Hiển thị:</label>
          <span className="muted">Showing {total === 0 ? 0 : start + 1}–{end} of {total}</span>
        </div>
        <div className="page-controls">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
            <button
              key={i}
              className={`page-btn ${i === currentPage ? 'active' : ''}`}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </button>
          ))}
          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Sidebar chi tiết */}
      <div id="sidebar" className={sidebarOpen ? 'active' : ''}>
        {selectedUser && (
          <>
            <div className="detail-header">
              <h2>Chi tiết người dùng</h2>
            </div>
            <div className="detail-body">
              <h3>{selectedUser.username}</h3>
              <div className="detail-status-box">
                <span className="status-tag">{selectedUser.status}</span>
              </div>
              <div className="detail-row">
                <i className="bx bx-envelope"></i>
                <p className="x">Email: {selectedUser.email}</p>
              </div>
              <div className="detail-row">
                <i className="bx bx-location-plus"></i>
                <p className="x">{formatDate(selectedUser.created_at)}</p>
              </div>
            </div>
            <div className="detail-footer">
              <button
                className="btnsecondary"
                disabled={selectedUser.status === 'ACTIVE'}
                onClick={() => handleUpdateStatus('ACTIVE')}
              >
                <i className="bx bx-edit"></i> Mở tài khoản
              </button>
              <button
                className="btnremove"
                disabled={selectedUser.status === 'BLOCK'}
                onClick={() => handleUpdateStatus('BLOCK')}
              >
                Khóa tài khoản
              </button>
            </div>
          </>
        )}
      </div>

      <div id="overlay" className={sidebarOpen ? 'active' : ''} onClick={closeSidebar}></div>
    </div>
  );
}