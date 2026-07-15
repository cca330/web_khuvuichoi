import React, { useState, useEffect } from 'react';
import promotionsApi from '../api/promotionsApi';
import '../styles/style1.css';

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
      // Chỉ hiển thị các khuyến mãi đang hoạt động
      const activePromotions = response.data.filter(p => p.status === 'ACTIVE');
      setPromotions(activePromotions);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return status === 'ACTIVE' ? 'green' : 'red';
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="promotions-page">
      <section className="promotions-section">
        <div className="container">
          <div className="section-title text-center">
            <h2>Khuyến Mãi Đang Áp Dụng</h2>
            <p>Các mã giảm giá đang hoạt động cho khách hàng</p>
          </div>

          {promotions.length === 0 ? (
            <div className="no-promotions">
              <h4>Hiện chưa có khuyến mãi nào đang hoạt động</h4>
              <p>Hãy quay lại sau để xem các ưu đãi mới</p>
            </div>
          ) : (
            <div className="promotions-grid">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="promotion-card">
                  <div className="promotion-header">
                    <h3>{promotion.code}</h3>
                    <span className={`badge ${getStatusBadge(promotion.status)}`}>
                      {promotion.status}
                    </span>
                  </div>
                  <div className="promotion-body">
                    <div className="promotion-discount">
                      <span className="discount-value">{promotion.discount}%</span>
                      <span className="discount-label">GIẢM GIÁ</span>
                    </div>
                    <div className="promotion-details">
                      <div className="detail-item">
                        <span>Phạm vi áp dụng:</span>
                        <strong>
                          {promotion.scopeNames || 'Tất cả loại vé'}
                        </strong>
                      </div>
                      <div className="detail-item">
                        <span>Bắt đầu:</span>
                        <strong>
                          {new Date(promotion.startDate).toLocaleDateString('vi-VN')}
                        </strong>
                      </div>
                      <div className="detail-item">
                        <span>Kết thúc:</span>
                        <strong>
                          {new Date(promotion.endDate).toLocaleDateString('vi-VN')}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="promotion-footer">
                    <button className="btn-copy" onClick={() => {
                      navigator.clipboard.writeText(promotion.code);
                      alert(`Đã sao chép mã: ${promotion.code}`);
                    }}>
                      <i className="fa fa-copy"></i>
                      Sao chép mã
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Promotions;
