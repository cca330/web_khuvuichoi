import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PublicLayout from "./components/PublicLayout";
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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

          {/* Trang admin — dùng AdminLayout riêng, không dùng PublicLayout */}
          <Route path="/admin/tickets" element={<Tickets />} />
          <Route path="/admin/promotions" element={<Promotions />} />
          <Route path="/admin/games" element={<Games />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/feedbacks" element={<Feedbacks />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
