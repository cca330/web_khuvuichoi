import { useState } from "react";
import { useNavigate } from "react-router-dom";
import eventsApi from "../../api/eventsApi";
import ImageUpload from "../../components/ImageUpload";
import "../../styles/admin.css";

const toDatetimeLocal = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toISOString().slice(0, 16);
};

// Helper to extract base64 data from preview URL
const extractBase64 = (dataUrl) => {
  if (dataUrl.startsWith("data:")) {
    return dataUrl;
  }
  // It's a server URL, keep as is
  return dataUrl;
};

export default function EventForm({ initialData, eventId }) {
  const isEdit = Boolean(eventId);
  const navigate = useNavigate();

  const [thumbnail, setThumbnail] = useState(
    initialData?.thumbnail ? [initialData.thumbnail] : []
  );
  const [form, setForm] = useState({
    title: initialData?.title || "",
    thumbnail: initialData?.thumbnail || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    startDatetime: toDatetimeLocal(initialData?.startDatetime),
    endDatetime: toDatetimeLocal(initialData?.endDatetime),
    status: initialData?.status || "COMING_SOON",
  });
  const [additionalImages, setAdditionalImages] = useState(
    initialData?.images?.map((img) => img.image) || []
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (images) => {
    setThumbnail(images);
    if (images.length > 0) {
      setForm((prev) => ({ ...prev, thumbnail: images[0] }));
    } else {
      setForm((prev) => ({ ...prev, thumbnail: "" }));
    }
  };

  const handleImagesChange = (images) => {
    setAdditionalImages(images);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Filter out empty strings and extract base64 data
    const images = additionalImages
      .filter((img) => img && img.trim())
      .map((img) => extractBase64(img));

    const payload = {
      title: form.title,
      thumbnail: form.thumbnail,
      description: form.description,
      location: form.location,
      startDatetime: form.startDatetime,
      endDatetime: form.endDatetime,
      status: form.status,
      images,
    };

    try {
      if (isEdit) {
        await eventsApi.update(eventId, payload);
      } else {
        await eventsApi.create(payload);
      }
      navigate("/admin/events");
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>{isEdit ? "Sửa sự kiện" : "Thêm sự kiện mới"}</h1>
          <p className="muted">
            {isEdit
              ? `Đang chỉnh sửa sự kiện ID ${eventId}`
              : "Điền thông tin sự kiện mới"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label>Tiêu đề *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ảnh thumbnail *</label>
          <ImageUpload
            images={thumbnail}
            onChange={handleThumbnailChange}
            multiple={false}
            label=""
            accept="image/*"
          />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Địa điểm</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Thời gian bắt đầu *</label>
            <input
              type="datetime-local"
              name="startDatetime"
              value={form.startDatetime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Thời gian kết thúc *</label>
            <input
              type="datetime-local"
              name="endDatetime"
              value={form.endDatetime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Trạng thái *</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="COMING_SOON">COMING_SOON</option>
            <option value="ONGOING">ONGOING</option>
            <option value="FINISHED">FINISHED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ảnh phụ</label>
          <ImageUpload
            images={additionalImages}
            onChange={handleImagesChange}
            multiple={true}
            maxImages={10}
            label=""
            accept="image/*"
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo sự kiện"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/admin/events")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}