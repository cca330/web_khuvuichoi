import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import promotionsApi from "../../api/promotionsApi";
import "../../styles/admin.css";

export default function PromotionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [promoRes, statsRes] = await Promise.allSettled([
        promotionsApi.getById(id),
        promotionsApi.getStats(id),
      ]);

      if (promoRes.status === "fulfilled") setPromotion(promoRes.value.data);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Đang tải...</div>;
  if (!promotion)
    return <div className="container">Không tìm thấy khuyến mãi</div>;

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>{promotion.code}</h1>
          <p className="muted">Chi tiết khuyến mãi ID {promotion.id}</p>
        </div>
        <div className="top-buttons">
          <Link
            to={`/admin/promotions/edit/${promotion.id}`}
            className="btn primary"
          >
            Sửa
          </Link>
          <button className="btn" onClick={() => navigate("/admin/promotions")}>
            Quay lại
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-row">
          <strong>Mô tả:</strong> {promotion.description || "Chưa có"}
        </div>
        <div className="detail-row">
          <strong>Giảm giá:</strong> {promotion.discount}%
        </div>
        <div className="detail-row">
          <strong>Thời gian:</strong>{" "}
          {new Date(promotion.startDate).toLocaleDateString("vi-VN")} →{" "}
          {new Date(promotion.endDate).toLocaleDateString("vi-VN")}
        </div>
        <div className="detail-row">
          <strong>Trạng thái:</strong> {promotion.status}
        </div>
        <div className="detail-row">
          <strong>Phạm vi áp dụng:</strong>{" "}
          {promotion.gateTickets?.length > 0
            ? promotion.gateTickets.map((g) => g.gateTicketId).join(", ")
            : "Tất cả loại vé"}
        </div>

        {stats && (
          <div className="detail-row">
            <strong>Thống kê sử dụng:</strong> Đã dùng {stats.totalUsed} lần —
            Tổng tiền đã giảm: {stats.totalDiscount?.toLocaleString("vi-VN")}đ
          </div>
        )}
      </div>
    </div>
  );
}
