import { useState, useEffect, useRef } from "react";
import "../styles/admin.css";

// Component dùng lại cho việc chọn, upload, hiển thị và xóa ảnh.
export default function ImageUpload({
  // Danh sách ảnh ban đầu, thường được truyền từ dữ liệu backend
  images = [],
  // Callback gửi danh sách ảnh mới về component cha.
  onChange,
  // Cho phép chọn nhiều ảnh và giới hạn tổng số ảnh.
  multiple = true,
  maxImages = 10,
  // Các tùy chọn hiển thị và giới hạn loại file.
  label = "Chọn ảnh",
  accept = "image/*",
  // Callback tùy chọn để component cha nhận thông báo lỗi.
  onError,
}) {
  // Lưu danh sách tên file hoặc URL ảnh đang hiển thị.
  const [previews, setPreviews] = useState([]);
  // Lưu lỗi upload để hiển thị cho người dùng.
  const [uploadError, setUploadError] = useState("");
  // Tham chiếu đến input file đang được ẩn trên giao diện.
  const fileInputRef = useRef(null);

  // Đồng bộ ảnh truyền từ component cha vào state nội bộ.
  useEffect(() => {
    if (images.length > 0) {
      setPreviews(images);
    }
  }, [images]);

  // Xử lý danh sách file sau khi người dùng chọn ảnh.
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadError("");

    // Không cho phép tổng số ảnh hiện tại và ảnh mới vượt quá giới hạn.
    const currentCount = previews.length;
    if (currentCount + files.length > maxImages) {
      const errorMsg = `Tối đa ${maxImages} ảnh. Bạn đang chọn ${files.length} ảnh, đã có ${currentCount} ảnh.`;
      setUploadError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    // Lưu tên các file upload thành công trong lần chọn này.
    const newFilenames = [];
    let hasError = false;

    for (const file of files) {
      // Kiểm tra file được chọn có phải là ảnh hay không.
      if (!file.type.startsWith("image/")) {
        const errorMsg = `${file.name} không phải là file ảnh hợp lệ`;
        setUploadError(errorMsg);
        if (onError) onError(errorMsg);
        hasError = true;
        continue;
      }

      // Đóng gói file để gửi dạng multipart/form-data.
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Gửi file đến API Gateway để lưu trên server.
        const res = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Backend cần trả về filename của ảnh đã lưu.
        const data = await res.json();
        if (data.filename) {
          newFilenames.push(data.filename);
        } else {
          throw new Error("Không nhận được filename từ server");
        }
      } catch (err) {
        const errorMsg = `Upload ảnh thất bại: ${file.name} - ${err.message}`;
        setUploadError(errorMsg);
        if (onError) onError(errorMsg);
        hasError = true;
      }
    }

    // Nếu tất cả file đều thành công, gộp ảnh mới với ảnh hiện tại
    // rồi thông báo danh sách mới cho component cha.
    if (!hasError && newFilenames.length > 0) {
      const updated = [...previews, ...newFilenames];
      setPreviews(updated);
      onChange(updated);
    }

    // Cho phép chọn lại chính file vừa chọn trước đó.
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Xóa ảnh khỏi danh sách đang hiển thị và cập nhật component cha.
  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newPreviews);
  };

  // Mở hộp thoại chọn file thông qua input đang bị ẩn.
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Chuyển filename thành URL đầy đủ để thẻ img có thể hiển thị.
  const getImageSrc = (preview) => {
    if (preview.startsWith("data:") || preview.startsWith("http")) {
      return preview;
    }
    return `http://localhost:8000/uploads/${preview}`;
  };

  // Giao diện vùng chọn file, thông báo lỗi và danh sách ảnh preview.
  return (
    <div className="image-upload-container">
      {label && <label>{label}</label>}
      <div className="image-upload-area" onClick={handleClick}>
        {/* Input thật được ẩn; người dùng click vào vùng bên ngoài để mở nó. */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div className="upload-icon">
          {/* Biểu tượng upload được vẽ bằng SVG inline. */}
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

      {/* Chỉ hiển thị thông báo khi quá trình kiểm tra hoặc upload có lỗi. */}
      {uploadError && (
        <div className="form-error" style={{ marginTop: "10px" }}>
          {uploadError}
        </div>
      )}

      {/* Chỉ tạo lưới preview khi đã có ít nhất một ảnh. */}
      {previews.length > 0 && (
        <div className="image-preview-grid">
          {previews.map((preview, index) => (
            <div key={index} className="image-preview-item">
              <img src={getImageSrc(preview)} alt={`Preview ${index + 1}`} />
              <button
                type="button"
                className="remove-image"
                onClick={(e) => {
                  // Không để click nút xóa kích hoạt lại vùng chọn file.
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
