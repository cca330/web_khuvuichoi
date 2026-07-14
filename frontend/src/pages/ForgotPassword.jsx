import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';
import '../styles/login.css';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await authApi.forgotPassword(username, email);
      // Chuyển sang trang đổi mật khẩu, kèm theo resetToken
      navigate('/reset-password', { state: { resetToken: res.data.resetToken } });
    } catch (err) {
      setError(err.response?.data?.message || 'Sai thông tin');
    }
  };

  return (
    <div className="panel">
      <form onSubmit={handleSubmit}>
        <h1><b>Forgot Password</b></h1>

        <div className="txtbox">
          <input type="text" placeholder="User name" required value={username} onChange={(e) => setUsername(e.target.value)} />
          <i className="bx bx-user-circle"></i>
        </div>

        <div className="txtbox">
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="error">{error}</div>

        <button className="btnlogin" type="submit">Xác minh</button>

        <div className="taotaikhoan">
          <p>Quay lại <Link to="/login">Đăng nhập</Link></p>
        </div>
      </form>
    </div>
  );
}