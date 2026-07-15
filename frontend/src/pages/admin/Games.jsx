import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gamesApi from '../../api/gamesApi';
import '../../styles/admin.css';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchGames();
  }, []);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      fetchGames();
      return;
    }
    try {
      setLoading(true);
      const response = await gamesApi.search(searchKeyword);
      setGames(response.data);
    } catch (error) {
      console.error('Error searching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (id) => {
    try {
      await gamesApi.close(id);
      fetchGames();
    } catch (error) {
      console.error('Error closing game:', error);
      alert('Không thể đóng game');
    }
  };

  const handleOpen = async (id) => {
    try {
      await gamesApi.open(id);
      fetchGames();
    } catch (error) {
      console.error('Error opening game:', error);
      alert('Không thể mở game');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      OPEN: 'green',
      CLOSE: 'red'
    };
    return <span className={`badge ${colors[status] || 'gray'}`}>{status}</span>;
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Quản lý trò chơi</h1>
          <p className="muted">Danh sách tất cả trò chơi trong hệ thống</p>
        </div>
        <div className="top-buttons">
          <Link to="/admin/games/create" className="btn primary">+ Thêm game</Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="search-box">
        <i className='bx bx-search'></i>
        <input
          type="text"
          placeholder="Tìm theo tên game..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </form>

      <div className="table-wrap admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Độ tuổi</th>
              <th>Loại vé</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Đang tải...</td>
              </tr>
            ) : games.length === 0 ? (
              <tr>
                <td colSpan="6">Không có dữ liệu</td>
              </tr>
            ) : (
              games.map((game) => (
                <tr key={game.id}>
                  <td>{game.id}</td>
                  <td>{game.name}</td>
                  <td>{game.recommendedAge}+</td>
                  <td>{game.allowedTicket}</td>
                  <td>{getStatusBadge(game.status)}</td>
                  <td>
                    <Link className="btn" to={`/admin/games/${game.id}`}>Chi tiết</Link>
                    <Link className="btn" to={`/admin/games/edit/${game.id}`}>Sửa</Link>
                    {game.status === 'OPEN' ? (
                      <button className="btn danger" onClick={() => handleClose(game.id)}>
                        Đóng
                      </button>
                    ) : (
                      <button className="btn success" onClick={() => handleOpen(game.id)}>
                        Mở
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

export default Games;
