import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import promotionsApi from '../../api/promotionsApi';
import '../../styles/admin.css';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionsApi.getAll();
      setPromotions(response.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (id) => {
    if (!window.confirm('Vô hiệu hóa khuyến mãi này?')) return;
    
    try {
      await promotionsApi.disable(id);
      fetchPromotions();
    } catch (error) {
      console.error('Error disabling promotion:', error);
      alert('Không thể vô hiệu hóa khuyến mãi');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      ACTIVE: 'green',
      EXPIRED: 'red'
    };
    return <span className={`badge ${colors[status] || 'gray'}`}>{status}</span>;
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Quản lý khuyến mãi</h1>
          <p className="muted">Danh sách tất cả mã khuyến mãi trong hệ thống</p>
        </div>
        <div className="top-buttons">
          <Link to="/admin/promotions/create" className="btn primary">+ Thêm khuyến mãi</Link>
        </div>
      </div>

      <div className="table-wrap admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã</th>
              <th>Giảm (%)</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Phạm vi áp dụng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Đang tải...</td>
              </tr>
            ) : promotions.length === 0 ? (
              <tr>
                <td colSpan="7">Không có dữ liệu</td>
              </tr>
            ) : (
              promotions.map((promotion) => (
                <tr key={promotion.id}>
                  <td>{promotion.id}</td>
                  <td>{promotion.code}</td>
                  <td>{promotion.discount}%</td>
                  <td>{new Date(promotion.startDate).toLocaleDateString('vi-VN')} → {new Date(promotion.endDate).toLocaleDateString('vi-VN')}</td>
                  <td>{getStatusBadge(promotion.status)}</td>
                  <td>
                    {promotion.scopeNames ? (
                      <span className="badge blue">{promotion.scopeNames}</span>
                    ) : (
                      <span className="badge grey">Tất cả loại vé</span>
                    )}
                  </td>
                  <td>
                    <Link className="btn" to={`/admin/promotions/${promotion.id}`}>Chi tiết</Link>
                    <Link className="btn" to={`/admin/promotions/edit/${promotion.id}`}>Sửa</Link>
                    {promotion.status === 'ACTIVE' && (
                      <button className="btn danger" onClick={() => handleDisable(promotion.id)}>
                        Vô hiệu hóa
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Promotions;
