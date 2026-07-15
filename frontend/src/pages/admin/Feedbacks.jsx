import React, { useState, useEffect } from 'react';
import gamesApi from '../../api/gamesApi';
import '../../styles/admin.css';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ total: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('all');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      // For now, we'll fetch all feedbacks from games
      // This might need a dedicated feedback API endpoint
      const response = await gamesApi.getAll();
      const allFeedbacks = [];
      
      for (const game of response.data) {
        try {
          const gameFeedbacks = await gamesApi.getFeedbacks(game.id);
          allFeedbacks.push(...gameFeedbacks.data.map(f => ({ ...f, gameName: game.name })));
        } catch (error) {
          console.error(`Error fetching feedbacks for game ${game.id}:`, error);
        }
      }
      
      setFeedbacks(allFeedbacks);
      
      // Calculate stats
      const total = allFeedbacks.length;
      const avgRating = total > 0 
        ? allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / total 
        : 0;
      setStats({ total, avgRating: avgRating.toFixed(1) });
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredFeedbacks = () => {
    if (ratingFilter === 'all') return feedbacks;
    return feedbacks.filter(f => f.rating === parseInt(ratingFilter));
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Quản lý phản hồi khách hàng</h1>
          <p className="muted">Theo dõi và phân tích đánh giá của khách hàng để nâng cao chất lượng dịch vụ.</p>
        </div>
      </div>

      <div className="stats">
        <div className="card">
          <div>
            <p>Tổng đánh giá</p>
            <h2>{stats.total}</h2>
          </div>
          <div className="icon blue"><i className="fa-regular fa-comment"></i></div>
        </div>

        <div className="card">
          <div>
            <p>Đánh giá trung bình</p>
            <h2>{stats.avgRating}</h2>
          </div>
          <div className="icon yellow"><i className="fa-regular fa-star"></i></div>
        </div>
      </div>

      <div className="filters">
        <h3><i className="fa-solid fa-sliders"></i> Lọc đánh giá</h3>
        <div className="filter-grid">
          <div>
            <label>Đánh giá sao</label>
            <select 
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">Tất cả đánh giá</option>
              <option value="5">★★★★★ 5 Stars</option>
              <option value="4">★★★★☆ 4 Stars</option>
              <option value="3">★★★☆☆ 3 Stars</option>
              <option value="2">★★☆☆☆ 2 Stars</option>
              <option value="1">★☆☆☆☆ 1 Star</option>
            </select>
          </div>
        </div>
      </div>

      <div className="feedback-list">
        {loading ? (
          <p>Đang tải...</p>
        ) : getFilteredFeedbacks().length === 0 ? (
          <p>Không có đánh giá nào</p>
        ) : (
          getFilteredFeedbacks().map((feedback) => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-header">
                <div className="feedback-user">
                  <strong>{feedback.username}</strong>
                  <span className="feedback-game">{feedback.gameName}</span>
                </div>
                <div className="feedback-rating">
                  {renderStars(feedback.rating)}
                </div>
              </div>
              <div className="feedback-content">
                {feedback.content}
              </div>
              <div className="feedback-date">
                {new Date(feedback.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
