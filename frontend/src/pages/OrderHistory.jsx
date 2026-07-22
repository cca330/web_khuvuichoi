import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cartApi from "../api/cartApi";
import { useAuth } from "../context/AuthContext";
import "../styles/datve.css";

const OrderHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      alert("Bạn cần đăng nhập!");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await cartApi.getOrderHistory(user.id);
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-page-modern">
        <div className="cart-list-section text-center py-5">
          <p className="text-muted">Đang tải lịch sử mua vé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-modern">
      {/* BANNER TRÀN LỀ CHUẨN TRANG BOOKING */}
      <section className="cart-hero-section">
        <div
          className="cart-hero-bg"
          style={{ backgroundImage: "url('/img/banner.png')" }}
        >
          <div className="cart-hero-overlay"></div>
          <div className="container cart-hero-content">
            <span className="cart-hero-tagline">Tài khoản cá nhân</span>
            <h2 className="cart-hero-title">📋 Lịch Sử Mua Vé</h2>
            <p className="cart-hero-desc">
              Xem lại danh sách tất cả các đơn hàng và mã vé điện tử bạn đã đăng
              ký mua tại HG Playground.
            </p>
          </div>
        </div>
      </section>

      {/* KHU VỰC NỘI DUNG DANH SÁCH */}
      <section className="cart-list-section">
        <div className="container">
          <div className="cart-header-bar">
            <h3>🎫 Lịch sử đơn hàng</h3>
            <button
              className="btn-modern-primary"
              onClick={() => navigate("/booking")}
            >
              ➕ Đặt vé mới
            </button>
          </div>

          <div className="modern-cart-box">
            {orders.length === 0 ? (
              <div className="text-center py-5">
                <p style={{ fontSize: "40px", marginBottom: "8px" }}>🎟️</p>
                <h4 style={{ border: "none", marginBottom: "8px" }}>
                  Bạn chưa có đơn hàng nào
                </h4>
                <p className="text-muted mb-4">
                  Sở hữu ngay vé trải nghiệm các trò chơi hấp dẫn ngay hôm nay!
                </p>
                <button
                  className="btn-checkout-action"
                  style={{ maxWidth: "200px" }}
                  onClick={() => navigate("/booking")}
                >
                  Mua vé ngay
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="modern-cart-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Ngày mua</th>
                      <th>Tổng tiền</th>
                      <th>Giảm giá</th>
                      <th>Thành tiền</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: "right" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <b style={{ color: "#0f172a" }}>#{order.id}</b>
                        </td>
                        <td>
                          {order.paidAt
                            ? new Date(order.paidAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "-"}
                        </td>
                        <td>{order.totalPrice?.toLocaleString()}đ</td>
                        <td style={{ color: "#ef4444" }}>
                          {order.discount > 0
                            ? `-${order.discount.toLocaleString()}đ`
                            : "-"}
                        </td>
                        <td>
                          <b style={{ color: "#10b981" }}>
                            {order.finalTotal?.toLocaleString()}đ
                          </b>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              order.status === "PAID"
                                ? "badge-gate"
                                : "badge-combo"
                            }`}
                          >
                            {order.status === "PAID"
                              ? "Đã thanh toán"
                              : order.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <Link
                            to={`/order/${order.id}`}
                            className="btn-coupon-apply"
                            style={{
                              textDecoration: "none",
                              display: "inline-block",
                              lineHeight: "36px",
                            }}
                          >
                            Xem chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderHistory;
