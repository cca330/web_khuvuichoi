import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';
import '../styles/login.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', repass: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.repass) {
      setError('Mật khẩu không trùng');
      return;
    }

    try {
      await authApi.register(form.username, form.password, form.email);
      alert('Đăng ký thành công');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tạo tài khoản');
    }
  };

  return (
    <div className="panel">
      <form onSubmit={handleSubmit}>
        <h1><b>Create Account</b></h1>

        <div className="txtbox">
          <input type="text" name="username" placeholder="User name" required onChange={handleChange} />
          <i className="bx bx-user-circle"></i>
        </div>

        <div className="txtbox">
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <div className="txtbox">
          <input type="password" name="repass" placeholder="Nhập lại password" required onChange={handleChange} />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <div className="txtbox">
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        </div>

        <div className="quenmk">
          <p>Lưu ý mỗi tài khoản chỉ được liên kết với 1 email!</p>
        </div>

        <div className="error">{error}</div>

        <button className="btnlogin" type="submit">Tạo tài khoản</button>

        <div className="taotaikhoan">
          <p>Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
        </div>
      </form>
    </div>
  );
}