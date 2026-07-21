import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserList from "./pages/UserList";
import Tickets from "./pages/admin/Tickets";
import Promotions from "./pages/admin/Promotions";
import Games from "./pages/admin/Games";
import Events from "./pages/admin/Events";
import Feedbacks from "./pages/admin/Feedbacks";
import Home from "./pages/Home";
import GamesPage from "./pages/Games";
import EventsPage from "./pages/Events";
import PromotionsPage from "./pages/Promotions";
import GameDetail from "./pages/GameDetail";
import EventDetail from "./pages/EventDetail";
import GameCreate from "./pages/admin/GameCreate";
import GameEdit from "./pages/admin/GameEdit";
import GameDetailAdmin from "./pages/admin/GameDetail";
import PromotionCreate from "./pages/admin/PromotionCreate";
import PromotionEdit from "./pages/admin/PromotionEdit";
import PromotionDetail from "./pages/admin/PromotionDetail";
import EventCreate from "./pages/admin/EventCreate";
import EventEdit from "./pages/admin/EventEdit";
import EventDetailAdmin from "./pages/admin/EventDetail";
import ScrollToTop from "./components/ScrollToTop"; // Import sẵn có của bạn
import "./styles/responsive.css";
// Component bảo vệ route cho admin
function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 🟢 ĐẶT SCROLLTOTOP Ở ĐÂY (NGAY DƯỚI BROWSERROUTER) */}
        <ScrollToTop />

        <Routes>
          {/* Các trang công khai — có Header + Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/:id" element={<GameDetail />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/users" element={<UserList />} />
          </Route>

          {/* Trang auth — KHÔNG có Header/Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Trang admin — dùng AdminLayout riêng, có sidebar */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="tickets" element={<Tickets />} />
            <Route path="promotions" element={<Promotions />} />
            <Route
              path="/admin/promotions/create"
              element={<PromotionCreate />}
            />
            <Route
              path="/admin/promotions/edit/:id"
              element={<PromotionEdit />}
            />
            <Route path="/admin/promotions/:id" element={<PromotionDetail />} />
            <Route path="games" element={<Games />} />
            <Route path="/admin/games/create" element={<GameCreate />} />
            <Route path="/admin/games/:id" element={<GameDetailAdmin />} />
            <Route path="/admin/games/edit/:id" element={<GameEdit />} />
            <Route path="events" element={<Events />} />
            <Route path="/admin/events/create" element={<EventCreate />} />
            <Route path="/admin/events/edit/:id" element={<EventEdit />} />
            <Route path="/admin/events/:id" element={<EventDetailAdmin />} />
            <Route path="feedbacks" element={<Feedbacks />} />
            <Route path="users" element={<UserList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
