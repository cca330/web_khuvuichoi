import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCopy, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import promotionsApi from "../api/promotionsApi";
import "../styles/promotions.css";

const Promotions = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

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

    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="promotions-page-modern">
        <div className="promotions-list-section text-center py-5">
          <p style={{ color: "#64748b", fontWeight: 600 }}>
            Đang tải danh sách khuyến mãi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="promotions-page-modern">
      {/* BANNER NẰM CỐ ĐỊNH NẰM DƯỚI HEADER */}
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

      {/* DANH SÁCH VOUCHER (CÓ HIỆU ỨNG TRƯỢT TỪ DƯỚI LÊN) */}
      <section className="promotions-list-section">
        <div className="container">
          {/* HEADER BAR CHỨA TIÊU ĐỀ VÀ NÚT QUAY LẠI TRANG THANH TOÁN */}
          <div className="promotions-header-bar">
            <div>
              <h3 className="promotions-section-title">
                Các Ưu Đãi Đang Hoạt Động
              </h3>
            </div>
            <button
              className="btn-back-booking"
              onClick={() => navigate("/booking")}
            >
              <FaArrowLeft /> Quay lại trang đặt vé
            </button>
          </div>

          {promotions.length === 0 ? (
            <div className="modern-no-promos">
              <div className="no-promos-icon">🎟️</div>
              <h4>Hiện chưa có khuyến mãi nào hoạt động</h4>
              <p>
                Các chương trình ưu đãi hấp dẫn sắp được ra mắt. Bạn nhớ quay
                lại sớm nhé!
              </p>
            </div>
          ) : (
            <div className="promotions-grid">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="modern-promo-card">
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
                        Áp dụng:{" "}
                        <strong>
                          {promotion.scopeNames || "Tất cả loại vé"}
                        </strong>
                      </div>
                      <div className="promo-info-item">
                        Hạn dùng:{" "}
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

      {/* POPUP TOAST THÔNG BÁO COPY */}
      <div className={`copy-toast ${showToast ? "show" : ""}`}>
        <FaCheckCircle /> {toastMessage}
      </div>
    </div>
  );
};

export default Promotions;
