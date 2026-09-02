import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cartApi from "../api/cartApi";
import promotionsApi from "../api/promotionsApi";
import { useAuth } from "../context/AuthContext";
import "../styles/datve.css";

const Booking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [gateTickets, setGateTickets] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const minBookingDate = new Date().toISOString().split("T")[0];
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });

  // State dành cho Mã giảm giá
  const [promotions, setPromotions] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState(null);

  useEffect(() => {
    if (!user) {
      alert("Bạn cần đăng nhập để đặt vé!");
      navigate("/login");
      return;
    }
    fetchData();
  }, [user]);

  // Hàm tải dữ liệu ban đầu
  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, cartRes, promoRes] = await Promise.all([
        cartApi.getGateTickets(),
        cartApi.getCart(user.id),
        promotionsApi.getActivePromotions ? promotionsApi.getActivePromotions() : Promise.resolve({ data: [] }),
      ]);
      setGateTickets(ticketsRes.data || []);
      setCartData(cartRes.data || null);
      
      // Lấy danh sách ưu đãi
      const activePromos = promoRes.data || promoRes || [];
      setPromotions(Array.isArray(activePromos) ? activePromos : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tải lại giỏ hàng ngầm
  const refreshCartOnly = async () => {
    try {
      const cartRes = await cartApi.getCart(user.id);
      setCartData(cartRes.data || null);
    } catch (error) {
      console.error("Error refreshing cart:", error);
    }
  };

  const handleAddGate = async (gateTicketId) => {
    try {
      const res = await cartApi.addGate(user.id, gateTicketId);
      if (res?.data?.cart) {
        setCartData(res.data.cart);
      } else {
        await refreshCartOnly();
      }
    } catch (error) {
      console.error("Error adding gate:", error);
    }
  };

  const handleUpdateQty = async (itemId, action) => {
    try {
      const res = await cartApi.updateQty(itemId, action);
      if (res?.data?.cart) {
        setCartData(res.data.cart);
      } else {
        await refreshCartOnly();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Bạn có chắc muốn xóa vé này không?")) {
      try {
        const res = await cartApi.deleteItem(itemId);
        if (res?.data?.cart) {
          setCartData(res.data.cart);
        } else {
          await refreshCartOnly();
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  // 🎟️ Hàm Áp dụng Mã giảm giá từ Dropdown
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!selectedCoupon) return;

    if (!cartData || !cartData.order || !cartData.order.id) {
      setCouponMessage({
        type: "error",
        text: "Vui lòng chọn vé trước khi áp dụng mã giảm giá!",
      });
      return;
    }

    try {
      setApplyingCoupon(true);
      setCouponMessage(null);

      const res = await cartApi.applyCoupon(selectedCoupon, cartData.order.id);

      if (res?.data?.success) {
        await refreshCartOnly();
        setCouponMessage({
          type: "success",
          text: `Áp dụng thành công! Giảm ${res.data.discount?.toLocaleString() || 0}đ`,
        });
      } else {
        setCouponMessage({
          type: "error",
          text: res?.data?.message || "Không thể áp dụng mã giảm giá này!",
        });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          error?.data?.message ||
          "Mã giảm giá không hợp lệ hoặc đã hết hạn!",
      });
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (!cartData || !cartData.order || cartData.finalTotal <= 0) return;
    if (!bookingDate) {
      alert("Vui lòng chọn ngày sử dụng vé!");
      return;
    }

    try {
      setProcessing(true);
      const res = await cartApi.checkout(user.id, cartData.order.id, bookingDate);

      if (res.data.success) {
        navigate(`/order/${res.data.orderId}`, {
          state: {
            justPaid: true,
            message: "Thanh toán thành công! Mã vé của bạn đã sẵn sàng.",
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Đặt vé thất bại! Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="cart-page-modern">
      {/* BANNER TRÀN LỀ */}
      <section className="cart-hero-section">
        <div
          className="cart-hero-bg"
          style={{ backgroundImage: "url('/img/banner.png')" }}
        >
          <div className="cart-hero-overlay"></div>
          <div className="container cart-hero-content">
            <span className="cart-hero-tagline">Hệ Thống Đặt Vé Trực Tuyến</span>
            <h2 className="cart-hero-title">Đặt Vé HG Playground</h2>
            <p className="cart-hero-desc">
              Sở hữu ngay tấm vé thông hành để trải nghiệm hàng loạt trò chơi và
              dịch vụ giải trí đẳng cấp!
            </p>
          </div>
        </div>
      </section>

      {/* KHU VỰC DANH SÁCH VÉ & THANH TOÁN */}
      <section className="cart-list-section">
        <div className="container">
          <div className="cart-header-bar">
            <h3> Đặt Vé & Thanh Toán</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {/* Đã xóa nút Khuyến mãi đang hoạt động */}
              <button
                className="btn-modern-primary"
                onClick={() => navigate("/orders")}
              >
                📋 Lịch sử đơn hàng
              </button>
            </div>
          </div>

          <div className="row">
            {/* Cột trái: Chọn vé & Giỏ hàng */}
            <div className="col-lg-7 mb-4">
              <div className="modern-cart-box">
                <h4>🎟️ Chọn loại vé</h4>
                <table className="modern-cart-table">
                  <thead>
                    <tr>
                      <th>Loại vé</th>
                      <th>Giá</th>
                      <th style={{ textAlign: "right" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gateTickets.map((gate) => (
                      <tr key={gate.id}>
                        <td>
                          <b style={{ color: "#0f172a" }}>{gate.name}</b>
                          {gate.isCombo && (
                            <span className="combo-info">
                              (Combo: {gate.admitsAdult} NL + {gate.admitsChild} TE)
                            </span>
                          )}
                        </td>
                        <td>
                          <b style={{ color: "#10b981" }}>
                            {Number(gate.price).toLocaleString()}đ
                          </b>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="btn-modern-primary"
                            onClick={() => handleAddGate(gate.id)}
                          >
                            ➕ Chọn
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Danh sách vé đã chọn */}
              {cartData && cartData.items && cartData.items.length > 0 && (
                <div className="modern-cart-box">
                  <h4>🛒 Vé đã chọn</h4>
                  <table className="modern-cart-table">
                    <thead>
                      <tr>
                        <th>Loại</th>
                        <th>Tên</th>
                        <th>SL</th>
                        <th>Giá</th>
                        <th style={{ textAlign: "right" }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartData.items.map((item) => (
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
                          </td>
                          <td>{item.quantity}</td>
                          <td>{item.price.toLocaleString()}đ</td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn-qty-minus"
                              onClick={() => handleUpdateQty(item.id, "minus")}
                            >
                              −
                            </button>
                            <button
                              className="btn-qty-plus"
                              onClick={() => handleUpdateQty(item.id, "plus")}
                              style={{ marginLeft: "4px" }}
                            >
                              +
                            </button>
                            <button
                              className="btn-qty-delete"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Cột phải: Thông tin thanh toán & Khuyến mãi */}
            <div className="col-lg-5 mb-4">
              <div
                className="modern-cart-box"
                style={{ position: "sticky", top: "100px" }}
              >
                <h4> Thông tin thanh toán</h4>

                {!cartData || !cartData.items || cartData.items.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <p style={{ fontSize: "36px", marginBottom: "8px" }}>🎫</p>
                    <p style={{ fontWeight: 700, color: "#475569" }}>
                      Chưa có vé nào được chọn
                    </p>
                    <p style={{ fontSize: "13px" }}>
                      Vui lòng chọn vé ở danh sách bên cạnh để tiếp tục
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="booking-date-box">
                      <label htmlFor="booking-date">Ngày sử dụng vé</label>
                      <input
                        id="booking-date"
                        type="date"
                        value={bookingDate}
                        min={minBookingDate}
                        onChange={(event) => setBookingDate(event.target.value)}
                        required
                      />
                      <small>Vé chỉ có hiệu lực trong ngày đã chọn và khung giờ của từng loại vé.</small>
                    </div>

                    <div className="summary-row">
                      <span>Tổng tiền:</span>
                      <span>{cartData.baseTotal?.toLocaleString() || 0}đ</span>
                    </div>

                    {cartData.discount > 0 && (
                      <div className="summary-row" style={{ color: "#ef4444" }}>
                        <span>Giảm giá:</span>
                        <span>-{cartData.discount.toLocaleString()}đ</span>
                      </div>
                    )}

                    {/* 🎟️ KHU VỰC CHỌN MÃ GIẢM GIÁ (DROPDOWN) */}
                    <div className="coupon-box">
                      <label className="coupon-label">
                         Chọn mã giảm giá / Ưu đãi
                      </label>
                      <form onSubmit={handleApplyCoupon} className="coupon-form">
                        <select
                          className="modern-input coupon-input"
                          value={selectedCoupon}
                          onChange={(e) => setSelectedCoupon(e.target.value)}
                          style={{ cursor: "pointer" }}
                        >
                          <option value="">-- Chọn mã giảm giá --</option>
                          {promotions.map((promo) => {
                            const code = promo.code || promo.couponCode;
                            const isEligible =
                              !promo.minOrderValue ||
                              (cartData.baseTotal || 0) >= promo.minOrderValue;

                            return (
                              <option
                                key={promo.id || code}
                                value={code}
                                disabled={!isEligible}
                              >
                                {code} - {promo.name || promo.description || "Giảm giá"}
                                {!isEligible
                                  ? ` (Đơn từ ${promo.minOrderValue.toLocaleString()}đ)`
                                  : ""}
                              </option>
                            );
                          })}
                        </select>
                        <button
                          type="submit"
                          className="btn-coupon-apply"
                          disabled={applyingCoupon || !selectedCoupon}
                        >
                          {applyingCoupon ? "..." : "Áp dụng"}
                        </button>
                      </form>

                      {couponMessage && (
                        <p
                          className={`coupon-msg ${
                            couponMessage.type === "success"
                              ? "msg-success"
                              : "msg-error"
                          }`}
                        >
                          {couponMessage.text}
                        </p>
                      )}
                    </div>

                    <div className="summary-row total">
                      <span>Thành tiền:</span>
                      <span style={{ color: "#10b981" }}>
                        {cartData.finalTotal?.toLocaleString() || 0}đ
                      </span>
                    </div>

                    <div className="user-info-box">
                      <p className="mb-2">
                        Họ tên: <strong>{user.username}</strong>
                      </p>
                      <p className="m-0">
                        Phương thức: <strong>VNPay (Giả lập)</strong>
                      </p>
                    </div>

                    <button
                      className="btn-checkout-action"
                      onClick={handleCheckout}
                      disabled={processing || cartData.finalTotal <= 0 || !bookingDate}
                    >
                      {processing ? "Đang xử lý..." : " Xác nhận đặt vé"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;