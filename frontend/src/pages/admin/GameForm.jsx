import { useState } from "react";
import { useNavigate } from "react-router-dom";
import gamesApi from "../../api/gamesApi";
import ImageUpload from "../../components/ImageUpload";
import "../../styles/admin.css";

// Helper to extract base64 data from preview URL
const extractBase64 = (dataUrl) => {
  if (dataUrl.startsWith("data:")) {
    return dataUrl;
  }
  // It's a server URL, keep as is
  return dataUrl;
};

export default function GameForm({ initialData, gameId }) {
  const isEdit = Boolean(gameId);
  const navigate = useNavigate();

  const [images, setImages] = useState(
    initialData?.images?.map((img) => img.image) || []
  );
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    recommendedAge: initialData?.recommendedAge || "",
    category: initialData?.category || "",
    allowedTicket: initialData?.allowedTicket || "ALL",
    status: initialData?.status || "OPEN",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Filter out empty strings and extract base64 data
    const imageList = images
      .filter((img) => img && img.trim())
      .map((img) => extractBase64(img));

    const payload = {
      name: form.name,
      description: form.description,
      recommendedAge: form.recommendedAge
        ? parseInt(form.recommendedAge)
        : undefined,
      category: form.category,
      allowedTicket: form.allowedTicket,
      status: form.status,
      images: imageList,
    };

    try {
      if (isEdit) {
        await gamesApi.update(gameId, payload);
      } else {
        await gamesApi.create(payload);
      }
      navigate("/admin/games");
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
          <h1>{isEdit ? "Sửa trò chơi" : "Thêm trò chơi mới"}</h1>
          <p className="muted">
            {isEdit
              ? `Đang chỉnh sửa game ID ${gameId}`
              : "Điền thông tin trò chơi mới"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label>Tên trò chơi *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
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

        <div className="form-row">
          <div className="form-group">
            <label>Độ tuổi khuyến nghị</label>
            <input
              type="number"
              name="recommendedAge"
              value={form.recommendedAge}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Danh mục</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="VD: Adventure, Family, VR..."
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Loại vé áp dụng *</label>
            <select
              name="allowedTicket"
              value={form.allowedTicket}
              onChange={handleChange}
            >
              <option value="ALL">ALL</option>
              <option value="ADULT">ADULT</option>
            </select>
          </div>

          <div className="form-group">
            <label>Trạng thái *</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="OPEN">OPEN</option>
              <option value="CLOSE">CLOSE</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Ảnh trò chơi</label>
          <ImageUpload
            images={images}
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
            {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo trò chơi"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/admin/games")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}