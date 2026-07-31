import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Helper: đọc user đã lưu, ưu tiên sessionStorage trước (vì admin dùng session)
function getSavedUser() {
  const sessionSaved = sessionStorage.getItem('user');
  if (sessionSaved) return JSON.parse(sessionSaved);

  const localSaved = localStorage.getItem('user');
  if (localSaved) return JSON.parse(localSaved);

  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSavedUser());

  const login = (accessToken, userData) => {
    // Xóa sạch dữ liệu cũ ở cả 2 nơi trước khi lưu mới, tránh rác tồn đọng
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');

    if (userData.role === 'ADMIN') {
      // Admin: lưu sessionStorage -> mất khi đóng trình duyệt/tab
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('user', JSON.stringify(userData));
    } else {
      // User thường: lưu localStorage -> giữ đăng nhập xuyên suốt
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}