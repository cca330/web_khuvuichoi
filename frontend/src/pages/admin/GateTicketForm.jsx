import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ticketsApi from "../../api/ticketsApi";
import "../../styles/admin.css";

const defaults = {
  name: "",
  price: "",
  description: "",
  status: "ACTIVE",
  type: "ALL",
  admitsAdult: 1,
  admitsChild: 0,
  isCombo: false,
  validFromTime: "00:00",
  validUntilTime: "23:59",
};

export default function GateTicketForm({ initialData, gateTicketId }) {
  const isEdit = Boolean(gateTicketId);
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...defaults, ...initialData });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      admitsAdult: Number(form.admitsAdult),
      admitsChild: Number(form.admitsChild),
      validFromTime: `${form.validFromTime}:00`.slice(0, 8),
      validUntilTime: `${form.validUntilTime}:00`.slice(0, 8),
    };

    try {
      if (isEdit) {
        await ticketsApi.updateGateTicket(gateTicketId, payload);
      } else {
        await ticketsApi.createGateTicket(payload);
      }
      navigate("/admin/ticket-types");
    } catch (err) {
      const message = err.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Có lỗi xảy ra, vui lòng thử lại",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>{isEdit ? "Sửa loại vé" : "Thêm loại vé mới"}</h1>
          <p className="muted">
            {isEdit
              ? `Đang chỉnh sửa loại vé ID ${gateTicketId}`
              : "Điền thông tin loại vé mới"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Tên loại vé *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Giá vé (VND) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Đối tượng áp dụng *</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="ALL">Tất cả</option>
              <option value="ADULT">Người lớn</option>
              <option value="CHILD">Trẻ em</option>
            </select>
          </div>
          <div className="form-group">
            <label>Trạng thái *</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">ACTIVE - Đang bán</option>
              <option value="INACTIVE">INACTIVE - Ngừng bán</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Số người lớn *</label>
            <input
              type="number"
              name="admitsAdult"
              value={form.admitsAdult}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>Số trẻ em *</label>
            <input
              type="number"
              name="admitsChild"
              value={form.admitsChild}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Giờ bắt đầu *</label>
            <input
              type="time"
              name="validFromTime"
              value={form.validFromTime?.slice(0, 5)}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Giờ kết thúc *</label>
            <input
              type="time"
              name="validUntilTime"
              value={form.validUntilTime?.slice(0, 5)}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isCombo"
              checked={form.isCombo}
              onChange={handleChange}
            />{" "}
            Đây là vé combo dùng chung một mã QR
          </label>
        </div>

        {error && <div className="form-error">{error}</div>}
        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo loại vé"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/admin/ticket-types")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
