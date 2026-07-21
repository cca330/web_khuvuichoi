import { useState, useEffect, useRef } from "react";
import "../styles/admin.css";

export default function ImageUpload({
  images = [],
  onChange,
  multiple = true,
  maxImages = 10,
  label = "Chọn ảnh",
  accept = "image/*",
}) {
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (images.length > 0) {
      setPreviews(images);
    }
  }, [images]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const currentCount = previews.length;
    if (currentCount + files.length > maxImages) {
      alert(`Tối đa ${maxImages} ảnh`);
      return;
    }

    const newFilenames = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        newFilenames.push(data.filename);
      } catch (err) {
        alert(`Upload ảnh thất bại: ${file.name}`);
      }
    }

    const updated = [...previews, ...newFilenames];
    setPreviews(updated);
    onChange(updated);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newPreviews);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getImageSrc = (preview) => {
    if (preview.startsWith("data:") || preview.startsWith("http")) {
      return preview;
    }
    return `http://localhost:8000/uploads/${preview}`;
  };

  return (
    <div className="image-upload-container">
      {label && <label>{label}</label>}
      <div className="image-upload-area" onClick={handleClick}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div className="upload-icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p>Nhấn để chọn ảnh từ máy</p>
          {multiple && <span>(Tối đa {maxImages} ảnh)</span>}
        </div>
      </div>

      {previews.length > 0 && (
        <div className="image-preview-grid">
          {previews.map((preview, index) => (
            <div key={index} className="image-preview-item">
              <img src={getImageSrc(preview)} alt={`Preview ${index + 1}`} />
              <button
                type="button"
                className="remove-image"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
