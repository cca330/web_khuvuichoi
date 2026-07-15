import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ticketsApi from '../../api/ticketsApi';
import '../../styles/admin.css';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, unused: 0, used: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchStats();
    fetchTickets();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await ticketsApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      
      const response = await ticketsApi.getAll(params);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchTickets();
      return;
    }
    // Filter locally for now (can be moved to backend)
    const filtered = tickets.filter(ticket => 
      ticket.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTickets(filtered);
  };

  const getStatusBadge = (status) => {
    const colors = {
      ACTIVE: 'green',
      EXPIRED: 'gray',
      CANCELLED: 'red'
    };
    return <span className={`badge ${colors[status] || 'gray'}`}>{status}</span>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Quản lý vé</h1>
          <p className="muted">Quản lý và xác nhận tất cả vé trong hệ thống</p>
        </div>
      </div>

      <div className="stats">
        <div className="card blue">
          <span>Tổng số vé</span>
          <h2>{stats.total}</h2>
        </div>
        <div className="card green">
          <span>Còn hiệu lực</span>
          <h2>{stats.unused}</h2>
        </div>
        <div className="card gray">
          <span>Hết hạn / Đã hủy</span>
          <h2>{stats.used}</h2>
        </div>
        <div className="card purple">
          <span>Tổng doanh thu vé</span>
          <h2>{formatPrice(stats.revenue)}</h2>
        </div>
      </div>

      <div className="filters filter-toolbar">
        <input 
          type="text" 
          placeholder="Tìm theo mã vé..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            fetchTickets();
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Còn hiệu lực</option>
          <option value="EXPIRED">Hết hạn</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
        <select 
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            fetchTickets();
          }}
        >
          <option value="">Tất cả loại</option>
          <option value="SINGLE">Vé đơn</option>
          <option value="COMBO">Combo</option>
        </select>
      </div>

      <div className="table-wrap admin-table">
        <table>
          <thead>
            <tr>
              <th>Mã vé</th>
              <th>Mã đơn hàng</th>
              <th>Loại</th>
              <th>Tên vé</th>
              <th>Giá vé</th>
              <th>Thời gian tạo</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Đang tải...</td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan="7">Không có dữ liệu</td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.code}</td>
                  <td>{ticket.orderId}</td>
                  <td>{ticket.type}</td>
                  <td>{ticket.name}</td>
                  <td>{formatPrice(ticket.price)}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>{getStatusBadge(ticket.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tickets;
