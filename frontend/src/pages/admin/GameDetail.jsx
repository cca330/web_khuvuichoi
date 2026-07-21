import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import gamesApi from "../../api/gamesApi";
import { getImageUrl } from "../../utils/imageUtils";
import "../../styles/admin.css";

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [stats, setStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gameRes, statsRes, feedbacksRes] = await Promise.allSettled([
        gamesApi.getById(id),
        gamesApi.getStats(id),
        gamesApi.getFeedbacks(id),
      ]);

      if (gameRes.status === "fulfilled") setGame(gameRes.value.data);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (feedbacksRes.status === "fulfilled")
        setFeedbacks(feedbacksRes.value.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Đang tải...</div>;
  if (!game) return <div className="container">Không tìm thấy trò chơi</div>;

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>{game.name}</h1>
          <p className="muted">Chi tiết trò chơi ID {game.id}</p>
        </div>
        <div className="top-buttons">
          <Link to={`/admin/games/edit/${game.id}`} className="btn primary">
            Sửa
          </Link>
          <button className="btn" onClick={() => navigate("/admin/games")}>
            Quay lại
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-row">
          <strong>Mô tả:</strong> {game.description || "Chưa có"}
        </div>
        <div className="detail-row">
          <strong>Độ tuổi khuyến nghị:</strong> {game.recommendedAge}+
        </div>
        <div className="detail-row">
          <strong>Danh mục:</strong> {game.category || "Chưa phân loại"}
        </div>
        <div className="detail-row">
          <strong>Loại vé áp dụng:</strong> {game.allowedTicket}
        </div>
        <div className="detail-row">
          <strong>Trạng thái:</strong> {game.status}
        </div>

        {stats && (
          <div className="detail-row">
            <strong>Thống kê:</strong> {stats.totalFeedbacks} đánh giá — trung
            bình {stats.avgRating}/5 sao
          </div>
        )}

        {game.images?.length > 0 && (
          <div className="detail-row">
            <strong>Ảnh:</strong>
            <div className="image-list">
              {game.images.map((img) => (
                <img
                  key={img.id}
                  src={getImageUrl(img.image)}
                  alt={game.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <h3 className="section-subtitle">Đánh giá của khách hàng</h3>
      <div className="table-wrap admin-table">
        <table>
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Đánh giá</th>
              <th>Nội dung</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 ? (
              <tr>
                <td colSpan="4">Chưa có đánh giá nào</td>
              </tr>
            ) : (
              feedbacks.map((fb) => (
                <tr key={fb.id}>
                  <td>{fb.username}</td>
                  <td>{fb.rating}/5</td>
                  <td>{fb.content}</td>
                  <td>{new Date(fb.createdAt).toLocaleDateString("vi-VN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
