import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import cartApi from "../api/cartApi";
import { useAuth } from "../context/AuthContext";
import ticketsApi from "../api/ticketsApi";
import "../styles/oderhistory.css";

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Đã đồng bộ tên biến thành showToast
  const [showToast, setShowToast] = useState(location.state?.justPaid || false);

  useEffect(() => {
    if (!user) {
      alert("Bạn cần đăng nhập!");
      navigate("/login");
      return;
    }
    fetchOrderDetail();

    // ⏱️ Hẹn giờ gỡ Toast sau 3.5s
    if (location.state?.justPaid) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [id, user]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const [orderRes, ticketsRes] = await Promise.all([
        cartApi.getOrderDetail(id, user.id),
        ticketsApi.getByOrder(id),
      ]);
      setOrder(orderRes.data);
      setTickets(ticketsRes.data || []);
    } catch (error) {
      console.error("Error fetching order detail:", error);
      alert("Không tìm thấy đơn hàng");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-page-modern">
        <div className="cart-list-section text-center py-5">
          <p className="text-muted">Đang tải thông tin chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="cart-page-modern">
        <div className="cart-list-section text-center py-5">
          <h2>Không tìm thấy đơn hàng</h2>
          <Link to="/orders" className="btn-coupon-apply mt-3">
            ← Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-modern">
      {/* 🎉 TOAST POPUP THÔNG BÁO (BẮT ĐÚNG BIẾN showToast) */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeInOverlay 3.5s ease-in-out forwards",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#ffffff",
              border: "2px solid #10b981",
              borderRadius: "20px",
              padding: "24px 32px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              width: "440px",
              maxWidth: "90%",
              zIndex: 1000000,
              animation:
                "flyFromCenterToTop 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <div
              style={{
                fontSize: "36px",
                background: "#ecfdf5",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
              }}
            >
              🎉
            </div>
            <div style={{ textAlign: "left" }}>
              <h5
                style={{
                  margin: "0 0 4px 0",
                  color: "#065f46",
                  fontWeight: 800,
                  fontSize: "18px",
                }}
              >
                Thanh toán thành công!
              </h5>
              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  fontSize: "13.5px",
                  lineHeight: 1.5,
                }}
              >
                Đơn hàng <strong>#{order.id}</strong> đã được xác nhận. Mã vé
                điện tử đã sẵn sàng!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BANNER TRÀN LỀ CHUẨN TRANG BOOKING */}
      <section className="cart-hero-section">
        <div
          className="cart-hero-bg"
          style={{ backgroundImage: "url('/img/banner.png')" }}
        >
          <div className="cart-hero-overlay"></div>
          <div className="container cart-hero-content">
            <span className="cart-hero-tagline">Chi tiết giao dịch</span>
            <h2 className="cart-hero-title">🎫 Đơn Hàng #{order.id}</h2>
            <p className="cart-hero-desc">
              Cảm ơn bạn đã mua vé! Dưới đây là danh sách vé và mã check-in điện
              tử của bạn.
            </p>
          </div>
        </div>
      </section>

      {/* KHU VỰC CHI TIẾT */}
      <section className="cart-list-section">
        <div className="container">
          {/* Thông tin đơn hàng */}
          <div className="modern-cart-box">
            <h4>📦 Thông tin đơn hàng</h4>
            <div className="order-info-grid">
              <div>
                <span>Ngày đặt: </span>
                <strong>
                  {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </div>
              {order.paidAt && (
                <div>
                  <span>Ngày thanh toán: </span>
                  <strong>
                    {new Date(order.paidAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                </div>
              )}
              <div>
                <span>Trạng thái: </span>
                <span
                  className={`badge ${
                    order.status === "PAID" ? "badge-gate" : "badge-combo"
                  }`}
                >
                  {order.status === "PAID" ? "Đã thanh toán" : order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Danh sách vé */}
          <div className="modern-cart-box">
            <h4>🎫 Danh sách vé đã mua</h4>
            <div className="table-responsive">
              <table className="modern-cart-table">
                <thead>
                  <tr>
                    <th>Loại</th>
                    <th>Tên vé</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th style={{ textAlign: "right" }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span
                          className={`badge ${
                            item.isCombo ? "badge-combo" : "badge-gate"
                          }`}
                        >
                          {item.isCombo ? "COMBO" : "VÉ"}
                        </span>
                      </td>
                      <td>
                        <b>{item.name}</b>
                        {item.isCombo && (
                          <span className="combo-info">
                            (Combo: {item.admitsAdult} NL + {item.admitsChild}{" "}
                            TE)
                          </span>
                        )}
                      </td>
                      <td>{item.quantity}</td>
                      <td>{item.price?.toLocaleString()}đ</td>
                      <td style={{ textAlign: "right", fontWeight: "700" }}>
                        {(item.price * item.quantity).toLocaleString()}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vé QR Điện Tử */}
          {tickets.length > 0 && (
            <div className="modern-cart-box">
              <h4>🎟️ Mã Vé Điện Tử (Check-in)</h4>
              <div className="ticket-grid">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="ticket-card-item">
                    <div className="ticket-card-title">
                      {ticket.gateTicket?.name || "Vé cổng"}
                    </div>
                    <div className="ticket-code-display">
                      {ticket.ticketCode}
                    </div>
                    <div className="ticket-card-status">
                      Còn hiệu lực: {ticket.status === "ACTIVE" ? "✅" : "❌"}{" "}
                      {ticket.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tóm tắt tổng tiền */}
          <div className="modern-cart-box">
            <h4>💰 Tổng cộng thanh toán</h4>
            <div className="summary-row">
              <span>Tổng tiền vé:</span>
              <span>{order.totalPrice?.toLocaleString()}đ</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-row" style={{ color: "#ef4444" }}>
                <span>Giảm giá:</span>
                <span>-{order.discount.toLocaleString()}đ</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Thành tiền:</span>
              <span style={{ color: "#10b981" }}>
                {order.finalTotal?.toLocaleString()}đ
              </span>
            </div>
          </div>

          {/* Nút quay lại */}
          <div className="mt-3">
            <Link
              to="/orders"
              className="btn-coupon-apply"
              style={{
                textDecoration: "none",
                display: "inline-block",
                padding: "10px 20px",
                background: "#64748b",
              }}
            >
              ← Quay lại lịch sử đơn hàng
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetail;
