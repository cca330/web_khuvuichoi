import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gamesApi from '../api/gamesApi';
import '../styles/style1.css';

const Games = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [categoryFilter, ageFilter, searchKeyword, games]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await gamesApi.getAll();
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...games];

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(game => game.category === categoryFilter);
    }

    // Filter by age
    if (ageFilter > 0) {
      filtered = filtered.filter(game => game.recommendedAge <= ageFilter);
    }

    // Filter by search keyword
    if (searchKeyword) {
      filtered = filtered.filter(game => 
        game.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setFilteredGames(filtered);
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'Mạo Hiểm': 'badge-maohiem',
      'Ocean Park': 'badge-ocean',
      'Gia Đình': 'badge-giadinh',
      'Thư Giãn': 'badge-thugian',
    };
    return colors[category] || 'badge-primary';
  };

  const getStatusBadge = (status) => {
    return status === 'OPEN' ? 'green' : 'red';
  };

  const getCategories = () => {
    const categories = new Set(games.map(game => game.category));
    return Array.from(categories);
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="games-page">
      {/* Banner */}
      <section className="hero">
        <div className="hero__item">
          <div className="hero__text">
            <span>Hàng trăm trò chơi đỉnh cao đang chờ bạn!</span>
            <h2>Khám Phá Trò Chơi Tại HG Playground</h2>
            <p>Mạo Hiểm • Ocean Park • Gia Đình • Thư Giãn</p>
          </div>
        </div>
      </section>

      {/* Danh sách trò chơi */}
      <section className="games-list">
        <div className="container">
          <h2 className="text-center">Danh Sách Trò Chơi</h2>

          <div className="row">
            {/* Sidebar Filter */}
            <div className="col-lg-3">
              <div className="filter-sidebar">
                <h4>Lọc Trò Chơi</h4>
                <div className="form-group">
                  <label>Tìm kiếm</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên trò chơi..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Loại trò chơi</label>
                  <select
                    className="form-control"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    {getCategories().map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Độ tuổi tối thiểu: {ageFilter}+</label>
                  <input
                    type="range"
                    className="form-control-range"
                    min="0"
                    max="18"
                    value={ageFilter}
                    onChange={(e) => setAgeFilter(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Danh sách Game */}
            <div className="col-lg-9">
              <div className="games-grid">
                {filteredGames.length === 0 ? (
                  <div className="no-results">
                    <h4>Không tìm thấy trò chơi nào phù hợp!</h4>
                    <p>Thử thay đổi bộ lọc để xem thêm kết quả.</p>
                  </div>
                ) : (
                  filteredGames.map((game) => (
                    <div key={game.id} className="game-card">
                      <div className="game-image">
                        <img
                          src={game.images?.[0] ? `/uploads/${game.images[0]}` : '/img/default-game.jpg'}
                          alt={game.name}
                        />
                      </div>
                      <div className="game-info">
                        <span className={`badge ${getCategoryBadge(game.category)}`}>
                          {game.category}
                        </span>
                        <h3>{game.name}</h3>
                        <p>{game.description?.substring(0, 100)}...</p>
                        <div className="game-meta">
                          <span>Tuổi: {game.recommendedAge}+</span>
                          <span className={`badge ${getStatusBadge(game.status)}`}>
                            {game.status}
                          </span>
                        </div>
                        {game.allowedTicket === 'ADULT' && (
                          <span className="adult-only">Chỉ dành cho vé người lớn</span>
                        )}
                        <Link to={`/games/${game.id}`} className="btn-detail">
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Games;
