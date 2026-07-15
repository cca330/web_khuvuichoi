import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import gamesApi from '../api/gamesApi';
import '../styles/admin.css';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [images, setImages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ total: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameDetail();
  }, [id]);

  const fetchGameDetail = async () => {
    try {
      setLoading(true);
      const response = await gamesApi.getById(id);
      setGame(response.data);
      
      // Fetch images
      try {
        const imagesRes = await gamesApi.getImages(id);
        setImages(imagesRes.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }

      // Fetch feedbacks
      try {
        const feedbacksRes = await gamesApi.getFeedbacks(id);
        setFeedbacks(feedbacksRes.data);
        
        // Calculate stats
        const total = feedbacksRes.data.length;
        const avgRating = total > 0 
          ? feedbacksRes.data.reduce((sum, f) => sum + f.rating, 0) / total 
          : 0;
        setStats({ total, avgRating: avgRating.toFixed(1) });
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    } catch (error) {
      console.error('Error fetching game detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        {i < rating ? '★' : '☆'}
      </span>
    ));
  };

  const getStatusBadge = (status) => {
    return status === 'OPEN' ? 'green' : 'red';
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!game) {
    return <div className="error">Không tìm thấy trò chơi</div>;
  }

  return (
    <div className="layout">
      <div className="content">
        <div className="container">
          <div className="header">
            <div>
              <h1>Chi tiết trò chơi</h1>
              <p className="muted">{game.name}</p>
            </div>
          </div>

          {/* Game Info Card */}
          <div className="game-card">
            {images.length > 0 ? (
              <div className="game-carousel">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={`/uploads/${img}`}
                    alt={game.name}
                    className={`carousel-slide ${index === 0 ? 'active' : ''}`}
                  />
                ))}
              </div>
            ) : (
              <p className="muted">Chưa có ảnh cho trò chơi này</p>
            )}

            <div className="game-info">
              <h2>{game.name}</h2>
              <p className="description">{game.description}</p>
              
              <div className="game-meta">
                <div className="meta-item">
                  <span>Độ tuổi:</span>
                  <strong>{game.recommendedAge}+</strong>
                </div>
                <div className="meta-item">
                  <span>Loại vé:</span>
                  <strong>{game.allowedTicket}</strong>
                </div>
                <div className="meta-item">
                  <span>Trạng thái:</span>
                  <span className={`badge ${getStatusBadge(game.status)}`}>
                    {game.status}
                  </span>
                </div>
                <div className="meta-item">
                  <span>Danh mục:</span>
                  <strong>{game.category}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats">
            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-content">
                <span>Số lượt đánh giá</span>
                <strong>{stats.total}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span>Điểm trung bình</span>
                <strong>{stats.avgRating}/5</strong>
              </div>
            </div>
          </div>

          {/* Feedbacks */}
          <div className="feedbacks-section">
            <h3>Đánh giá của khách</h3>
            {feedbacks.length === 0 ? (
              <p className="muted">Chưa có đánh giá nào</p>
            ) : (
              <div className="feedbacks-list">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="feedback-item">
                    <div className="feedback-header">
                      <strong>{fb.username}</strong>
                      <div className="rating">
                        {renderStars(fb.rating)}
                      </div>
                    </div>
                    <p>{fb.content}</p>
                    <small className="muted">
                      {new Date(fb.createdAt).toLocaleString('vi-VN')}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="actions">
            <Link to="/games" className="btn secondary">
              ← Quay lại
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
