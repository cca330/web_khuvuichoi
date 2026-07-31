import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import promotionsApi from "../../api/promotionsApi";
import "../../styles/admin.css";

export default function PromotionForm({ initialData, promotionId }) {
  const isEdit = Boolean(promotionId);
  const navigate = useNavigate();

  const [gateTickets, setGateTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // Map đúng gateTicketId từ danh sách PromotionGateTicket mà Backend trả về
  const initialGateTicketIds = initialData?.gateTickets
    ? initialData.gateTickets.map((g) => g.gateTicketId)
    : [];

  const [form, setForm] = useState({
    code: initialData?.code || "",
    discount: initialData?.discount || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate ? initialData.startDate.slice(0, 10) : "",
    endDate: initialData?.endDate ? initialData.endDate.slice(0, 10) : "",
    status: initialData?.status || "ACTIVE",
    gateTicketIds: initialGateTicketIds,
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGateTickets();
  }, []);

  // Lấy danh sách loại vé từ endpoint GET /promotions/gate-tickets
  const fetchGateTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await promotionsApi.getGateTickets();

      // Đảm bảo dữ liệu nhận được luôn là Array
      const tickets = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setGateTickets(tickets);
    } catch (err) {
      console.error(
        "Lỗi khi lấy danh sách gate tickets từ ticket-service:",
        err,
      );
      setError(
        "Không thể tải danh sách loại vé. Vui lòng kiểm tra lại ticket-service.",
      );
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleGateTicket = (id) => {
    setForm((prev) => {
      const exists = prev.gateTicketIds.includes(id);
      return {
        ...prev,
        gateTicketIds: exists
          ? prev.gateTicketIds.filter((x) => x !== id)
          : [...prev.gateTicketIds, id],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Ép kiểu chuẩn theo CreatePromotionDto & UpdatePromotionDto
    const payload = {
      code: form.code.trim(),
      discount: Number(form.discount),
      description: form.description,
      startDate: form.startDate, // Dạng YYYY-MM-DD
      endDate: form.endDate, // Dạng YYYY-MM-DD
      status: form.status,
      gateTicketIds: form.gateTicketIds || [], // Luôn đảm bảo truyền mảng (dù rỗng)
    };

    try {
      if (isEdit) {
        await promotionsApi.update(promotionId, payload);
      } else {
        await promotionsApi.create(payload);
      }
      navigate("/admin/promotions");
    } catch (err) {
      console.error("Lỗi submit promotion:", err);
      const msg = err.response?.data?.message;
      setError(
        Array.isArray(msg)
          ? msg.join(", ")
          : msg || "Có lỗi xảy ra, vui lòng thử lại",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>{isEdit ? "Sửa khuyến mãi" : "Thêm khuyến mãi mới"}</h1>
          <p className="muted">
            {isEdit
              ? `Đang chỉnh sửa khuyến mãi ID ${promotionId}`
              : "Điền thông tin khuyến mãi mới"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Mã khuyến mãi *</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="VD: SUMMER50"
              required
            />
          </div>

          <div className="form-group">
            <label>Giảm giá (%) *</label>
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              min="1"
              max="100"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Mô tả ngắn về chương trình khuyến mãi..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Ngày bắt đầu *</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ngày kết thúc *</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {isEdit && (
          <div className="form-group">
            <label>Trạng thái *</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </div>
        )}

        {/* ─── PHẦN CHỌN PHẠM VI ÁP DỤNG (HIỂN THỊ DANH SÁCH VÉ) ─── */}
        <div className="form-group">
          <label>Phạm vi áp dụng (bỏ trống = áp dụng cho tất cả loại vé)</label>

          {loadingTickets ? (
            <div className="muted" style={{ padding: "8px 0" }}>
              ⏳ Đang tải danh sách loại vé...
            </div>
          ) : gateTickets.length === 0 ? (
            <div
              style={{ color: "#f59e0b", fontSize: "14px", padding: "8px 0" }}
            >
              ⚠️ Không tìm thấy danh sách loại vé nào từ hệ thống.
            </div>
          ) : (
            <div className="checkbox-list">
              {gateTickets.map((gt) => {
                // ticket-service trả về object có id và name
                const ticketId = gt.id || gt.gateTicketId;
                const ticketName =
                  gt.name || gt.ticketName || `Vé #${ticketId}`;

                return (
                  <label key={ticketId} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={form.gateTicketIds.includes(ticketId)}
                      onChange={() => toggleGateTicket(ticketId)}
                    />
                    <span>{ticketName}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={saving}>
            {saving
              ? "Đang lưu..."
              : isEdit
                ? "Lưu thay đổi"
                : "Tạo khuyến mãi"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/admin/promotions")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
