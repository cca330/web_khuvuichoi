import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaLock, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import authApi from "../api/authApi";
import "../styles/login.css"; // Sử dụng chung tệp CSS với Login/Register

export default function ResetPassword() {
  const [newPass, setNewPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken;

  // Trường hợp không hợp lệ - vẫn giữ nguyên khung giao diện đẹp mắt
  if (!resetToken) {
    return (
      <div className="lucid-login-page">
        <div
          className="login-bg-overlay"
          style={{ backgroundImage: "url('/img/banner.png')" }}
        ></div>
        <div className="login-dark-filter"></div>

        <div
          className="panel-modern text-center"
          style={{ alignItems: "center" }}
        >
          <FaExclamationTriangle
            style={{ fontSize: "48px", color: "#ff5b84", marginBottom: "20px" }}
          />
          <div className="login-header-text">
            <h1>Lỗi Truy Cập</h1>
            <p style={{ marginTop: "10px", lineHeight: "1.6" }}>
              Không tìm thấy dữ liệu yêu cầu đặt lại mật khẩu hợp lệ! Vui lòng
              thực hiện lại từ bước quên mật khẩu.
            </p>
          </div>

          <Link
            to="/forgot-password"
            className="btnlogin-modern"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              marginTop: "10px",
            }}
          >
            Quay lại quên mật khẩu
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPass !== rePass) {
      setError("Mật khẩu nhập lại không trùng khớp!");
      return;
    }

    try {
      await authApi.resetPassword(resetToken, newPass);
      alert("Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu!",
      );
    }
  };

  return (
    <div className="lucid-login-page">
      {/* Background sắc nét phía sau */}
      <div
        className="login-bg-overlay"
        style={{ backgroundImage: "url('/img/banner.png')" }}
      ></div>
      <div className="login-dark-filter"></div>

      <div className="panel-modern">
        <form onSubmit={handleSubmit}>
          <div className="login-header-text">
            <h1>Mật Khẩu Mới</h1>
            <p>Thiết lập mật khẩu mới cực kỳ bảo mật cho tài khoản của bạn</p>
          </div>

          {/* Ô nhập Mật khẩu mới */}
          <div className="txtbox-modern">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <FaLock className="box-icon" />
          </div>

          {/* Ô nhập lại Mật khẩu */}
          <div className="txtbox-modern">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              required
              value={rePass}
              onChange={(e) => setRePass(e.target.value)}
            />
            <FaLock className="box-icon" />
          </div>

          {/* Hiển thị lỗi rung lắc trực quan */}
          {error && <div className="error-message-box">{error}</div>}

          <button className="btnlogin-modern" type="submit">
            Thay đổi mật khẩu
          </button>

          <div className="taotaikhoan-modern">
            <p>
              Nhớ ra mật khẩu cũ? <Link to="/login">Đăng nhập</Link>
            </p>
          </div>
        </form>

        {/* Nút quay về nhanh dưới chân thẻ */}
        <Link to="/" className="back-to-home">
          <FaArrowLeft /> Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
