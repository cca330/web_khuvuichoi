import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import authApi from "../api/authApi";
import "../styles/login.css"; // Sử dụng chung file CSS với các trang login khác

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authApi.forgotPassword(username, email);
      // Chuyển sang trang đổi mật khẩu, kèm theo resetToken
      navigate("/reset-password", {
        state: { resetToken: res.data.resetToken },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Thông tin xác minh không chính xác!",
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
            <h1>Quên Mật Khẩu</h1>
            <p>
              Nhập thông tin tài khoản và email đã liên kết để lấy lại mật khẩu
            </p>
          </div>

          {/* Ô nhập Tài khoản */}
          <div className="txtbox-modern">
            <input
              type="text"
              placeholder="Tên tài khoản"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUserCircle className="box-icon" />
          </div>

          {/* Ô nhập Email */}
          <div className="txtbox-modern">
            <input
              type="email"
              placeholder="Địa chỉ Email đã đăng ký"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="box-icon" />
          </div>

          {/* Hiển thị lỗi rung lắc trực quan */}
          {error && <div className="error-message-box">{error}</div>}

          <button className="btnlogin-modern" type="submit">
            Xác minh tài khoản
          </button>

          <div className="taotaikhoan-modern">
            <p>
              Nhớ ra mật khẩu? <Link to="/login">Đăng nhập ngay</Link>
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
