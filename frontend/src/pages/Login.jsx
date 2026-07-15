import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');

    if (!username.trim()) {
      setError('Vui lòng nhập username!');
      return;
    }
    if (!password.trim()) {
      setError('Vui lòng nhập password!');
      return;
    }

    try {
      const res = await authApi.login(username, password);
      const { accessToken, user } = res.data;
      login(accessToken, user);
      navigate(user.role === 'ADMIN' ? '/admin/tickets' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Không kết nối được server!');
    }
  };

  return (
    <div className="panel">
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <h1><b>Login</b></h1>

        <div className="txtbox">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <i className="bx bx-user-circle"></i>
        </div>

        <div className="txtbox">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <div className="error">{error}</div>

        <div className="quenmk">
          <Link to="/forgot-password">Quên mật khẩu</Link>
        </div>

        <button className="btnlogin" type="submit">Login</button>

        <div className="taotaikhoan">
          <p>Bạn chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link></p>
        </div>
      </form>
    </div>
  );
}