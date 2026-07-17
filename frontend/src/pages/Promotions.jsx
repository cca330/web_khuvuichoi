import React, { useState, useEffect } from "react";
import { FaCopy, FaCheckCircle, FaPercentage } from "react-icons/fa";
import promotionsApi from "../api/promotionsApi";
import "../styles/promotions.css";

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Hiệu ứng cuộn trang mượt mà
  useEffect(() => {
    if (!loading && promotions.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
            } else {
              if (entry.boundingClientRect.top > 0) {
                entry.target.classList.remove("reveal-visible");
              }
            }
          });
        },
        { threshold: 0.1 },
      );

      const elements = document.querySelectorAll(".scroll-reveal");
      elements.forEach((el) => observer.observe(el));
      return () => elements.forEach((el) => observer.unobserve(el));
    }
  }, [loading, promotions]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionsApi.getAll();
      const activePromotions = response.data.filter(
        (p) => p.status === "ACTIVE",
      );
      setPromotions(activePromotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setToastMessage(`Đã sao chép mã ưu đãi: ${code}`);
    setShowToast(true);

    // Tự động ẩn Toast sau 2.5 giây
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách khuyến mãi...</div>;
  }

  return (
    <div className="promotions-page-modern">
      {/* ─── BANNER KHUYẾN MÃI HOÀNH TRÁNG (Đồng bộ, chống đè Header) ─── */}
      <section className="promotions-hero-section">
        <div
          className="promotions-hero-bg"
          style={{ backgroundImage: "url('/img/banner.png')" }}
        >
          <div className="promotions-hero-overlay"></div>
          <div className="container promotions-hero-content">
            <span className="promotions-hero-tagline">Siêu ưu đãi cực hời</span>
            <h2 className="promotions-hero-title">Khuyến Mãi Đang Áp Dụng</h2>
            <p className="promotions-hero-desc">
              Săn ngay các mã giảm giá hấp dẫn để tận hưởng trọn vẹn niềm vui
              giải trí tiết kiệm tại HG Playground!
            </p>
          </div>
        </div>
      </section>

      {/* ─── DANH SÁCH VOUCHER ─── */}
      <section className="promotions-list-section">
        <div className="container text-center">
          <h3 className="promotions-section-title">
            Các Ưu Đãi Đang Hoạt Động
          </h3>

          {promotions.length === 0 ? (
            <div className="modern-no-promos scroll-reveal">
              <div className="no-promos-icon">🎟️</div>
              <h4>Hiện chưa có khuyến mãi nào hoạt động</h4>
              <p>
                Các chương trình ưu đãi hấp dẫn sắp được ra mắt. Bạn nhớ quay
                lại sớm nhé!
              </p>
            </div>
          ) : (
            <div className="promotions-grid text-left">
              {promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="modern-promo-card scroll-reveal"
                >
                  <div className="promo-card-header">
                    <span className="promo-code-title">{promotion.code}</span>
                    <span className="promo-status-badge">Đang áp dụng</span>
                  </div>

                  <div className="promo-card-body">
                    <div className="promo-discount-badge">
                      <span className="promo-discount-value">
                        {promotion.discount}%
                      </span>
                      <span className="promo-discount-label">GIẢM GIÁ</span>
                    </div>

                    <div className="promo-info-details">
                      <div className="promo-info-item">
                        Áp dụng cho:{" "}
                        <strong>
                          {promotion.scopeNames || "Tất cả loại vé"}
                        </strong>
                      </div>
                      <div className="promo-info-item">
                        Hạn sử dụng:{" "}
                        <strong>
                          {new Date(promotion.endDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="promo-card-footer">
                    <button
                      className="btn-promo-copy"
                      onClick={() => handleCopyCode(promotion.code)}
                    >
                      <FaCopy /> Sao chép mã
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── THÔNG BÁO TOAST POPUP (Đẹp hơn hàm alert mặc định) ─── */}
      <div className={`copy-toast ${showToast ? "show" : ""}`}>
        <FaCheckCircle /> {toastMessage}
      </div>
    </div>
  );
};

export default Promotions;
