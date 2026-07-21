import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import promotionsApi from "../../api/promotionsApi";
import "../../styles/admin.css";

export default function PromotionForm({ initialData, promotionId }) {
  const isEdit = Boolean(promotionId);
  const navigate = useNavigate();

  const [gateTickets, setGateTickets] = useState([]);
  const [form, setForm] = useState({
    code: initialData?.code || "",
    discount: initialData?.discount || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate?.slice(0, 10) || "",
    endDate: initialData?.endDate?.slice(0, 10) || "",
    status: initialData?.status || "ACTIVE",
    gateTicketIds: initialData?.gateTickets?.map((g) => g.gateTicketId) || [],
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGateTickets();
  }, []);

  const fetchGateTickets = async () => {
    try {
      const res = await promotionsApi.getGateTickets();
      setGateTickets(res.data);
    } catch (err) {
      console.error("Error fetching gate tickets:", err);
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

    const payload = {
      code: form.code,
      discount: parseInt(form.discount),
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      gateTicketIds: form.gateTicketIds,
    };

    try {
      if (isEdit) {
        await promotionsApi.update(promotionId, payload);
      } else {
        await promotionsApi.create(payload);
      }
      navigate("/admin/promotions");
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
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

        <div className="form-group">
          <label>Phạm vi áp dụng (bỏ trống = áp dụng cho tất cả loại vé)</label>
          <div className="checkbox-list">
            {gateTickets.map((gt) => (
              <label key={gt.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={form.gateTicketIds.includes(gt.id)}
                  onChange={() => toggleGateTicket(gt.id)}
                />
                {gt.name}
              </label>
            ))}
          </div>
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
