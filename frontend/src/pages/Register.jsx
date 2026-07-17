import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaLock, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import authApi from "../api/authApi";
import "../styles/login.css"; // Sử dụng chung file CSS với Login

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    repass: "",
    email: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.repass) {
      setError("Mật khẩu nhập lại không trùng khớp!");
      return;
    }

    try {
      await authApi.register(form.username, form.password, form.email);
      alert("Đăng ký tài khoản thành công! Hãy đăng nhập nhé.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi tạo tài khoản!");
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
            <h1>Đăng Ký</h1>
            <p>Tạo tài khoản để bắt đầu hành trình tại HG Playground</p>
          </div>

          {/* Ô nhập Tài khoản */}
          <div className="txtbox-modern">
            <input
              type="text"
              name="username"
              placeholder="Tên tài khoản"
              required
              onChange={handleChange}
            />
            <FaUserCircle className="box-icon" />
          </div>

          {/* Ô nhập Mật khẩu */}
          <div className="txtbox-modern">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              required
              onChange={handleChange}
            />
            <FaLock className="box-icon" />
          </div>

          {/* Ô nhập lại Mật khẩu */}
          <div className="txtbox-modern">
            <input
              type="password"
              name="repass"
              placeholder="Nhập lại mật khẩu"
              required
              onChange={handleChange}
            />
            <FaLock className="box-icon" />
          </div>

          {/* Ô nhập Email */}
          <div className="txtbox-modern">
            <input
              type="email"
              name="email"
              placeholder="Địa chỉ Email"
              required
              onChange={handleChange}
            />
            <FaEnvelope className="box-icon" />
          </div>

          <div
            className="quenmk-modern"
            style={{ justifyContent: "center", marginBottom: "15px" }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
              }}
            >
              ⚠️ Mỗi tài khoản chỉ được liên kết với 1 email duy nhất.
            </span>
          </div>

          {/* Hiển thị lỗi rung lắc trực quan */}
          {error && <div className="error-message-box">{error}</div>}

          <button className="btnlogin-modern" type="submit">
            Tạo tài khoản
          </button>

          <div className="taotaikhoan-modern">
            <p>
              Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
          </div>
        </form>

        {/* Nút quay về trang chủ nhanh dưới chân thẻ */}
        <Link to="/" className="back-to-home">
          <FaArrowLeft /> Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
