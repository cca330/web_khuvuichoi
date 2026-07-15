import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserList from './pages/UserList';
import Tickets from './pages/admin/Tickets';
import Promotions from './pages/admin/Promotions';
import Games from './pages/admin/Games';
import Events from './pages/admin/Events';
import Feedbacks from './pages/admin/Feedbacks';
import Home from './pages/Home';
import GamesPage from './pages/Games';
import EventsPage from './pages/Events';
import PromotionsPage from './pages/Promotions';
import GameDetail from './pages/GameDetail';
import EventDetail from './pages/EventDetail';
import AdminLayout from './components/AdminLayout';

function AppContent() {
  const location = useLocation();
  const hideHeader = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/tickets" element={<AdminLayout><Tickets /></AdminLayout>} />
        <Route path="/admin/promotions" element={<AdminLayout><Promotions /></AdminLayout>} />
        <Route path="/admin/games" element={<AdminLayout><Games /></AdminLayout>} />
        <Route path="/admin/events" element={<AdminLayout><Events /></AdminLayout>} />
        <Route path="/admin/feedbacks" element={<AdminLayout><Feedbacks /></AdminLayout>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;