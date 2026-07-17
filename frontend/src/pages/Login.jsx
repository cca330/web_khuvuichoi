import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaLock, FaArrowLeft } from "react-icons/fa";
import authApi from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");

    if (!username.trim()) {
      setError("Vui lòng nhập tài khoản!");
      return;
    }
    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu!");
      return;
    }

    try {
      const res = await authApi.login(username, password);
      const { accessToken, user } = res.data;
      login(accessToken, user);
      navigate(user.role === "ADMIN" ? "/admin/tickets" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Không kết nối được server!");
    }
  };

  return (
    <div className="lucid-login-page">
      {/* Background mờ ảo phía sau */}
      <div
        className="login-bg-overlay"
        style={{ backgroundImage: "url('/img/banner.png')" }}
      ></div>
      <div className="login-dark-filter"></div>

      <div className="panel-modern">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="login-header-text">
            <h1>Đăng Nhập</h1>
            <p>Chào mừng bạn trở lại với HG Playground</p>
          </div>

          {/* Ô nhập Tài khoản */}
          <div className="txtbox-modern">
            <input
              type="text"
              placeholder="Tên tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUserCircle className="box-icon" />
          </div>

          {/* Ô nhập Mật khẩu */}
          <div className="txtbox-modern">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="box-icon" />
          </div>

          {/* Hiển thị thông báo lỗi tinh tế */}
          {error && <div className="error-message-box">{error}</div>}

          <div className="quenmk-modern">
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          <button className="btnlogin-modern" type="submit">
            Đăng Nhập
          </button>

          <div className="taotaikhoan-modern">
            <p>
              Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </form>

        {/* Nút quay về trang chủ nhanh */}
        <Link to="/" className="back-to-home">
          <FaArrowLeft /> Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
