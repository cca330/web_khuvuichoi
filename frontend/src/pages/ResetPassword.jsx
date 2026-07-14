import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import authApi from '../api/authApi';
import '../styles/login.css';

export default function ResetPassword() {
  const [newPass, setNewPass] = useState('');
  const [rePass, setRePass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken;

  if (!resetToken) {
    return (
      <div className="panel">
        <p>Không có dữ liệu để đặt mật khẩu mới! Vui lòng thực hiện lại từ bước quên mật khẩu.</p>
        <Link to="/forgot-password">Quay lại</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPass !== rePass) {
      setError('Mật khẩu không trùng');
      return;
    }

    try {
      await authApi.resetPassword(resetToken, newPass);
      alert('Đổi mật khẩu thành công');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đổi mật khẩu');
    }
  };

  return (
    <div className="panel">
      <form onSubmit={handleSubmit}>
        <h1><b>Nhập mật khẩu mới</b></h1>

        <div className="txtbox">
          <input type="password" placeholder="Mật khẩu mới" required value={newPass} onChange={(e) => setNewPass(e.target.value)} />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <div className="txtbox">
          <input type="password" placeholder="Nhập lại mật khẩu" required value={rePass} onChange={(e) => setRePass(e.target.value)} />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <div className="error">{error}</div>

        <button className="btnlogin" type="submit">Thay đổi</button>

        <div className="taotaikhoan">
          <p>Quay lại <Link to="/login">Đăng nhập</Link></p>
        </div>
      </form>
    </div>
  );
}