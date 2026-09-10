import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaUsers,
  FaTicketAlt,
  FaGamepad,
  FaArrowLeft,
  FaComments,
} from "react-icons/fa";
import gamesApi from "../api/gamesApi";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUtils";
import "../styles/gameDetail.css";

const GameDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ total: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [editingRating, setEditingRating] = useState(5);
  const [editingContent, setEditingContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteFeedbackId, setDeleteFeedbackId] = useState(null);

  const reviewsPerPage = 10;

  useEffect(() => {
    fetchGameDetail();
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [id, feedbacks.length]);

  const fetchGameDetail = async () => {
    try {
      setLoading(true);
      const response = await gamesApi.getById(id);
      setGame(response.data);

      try {
        const feedbacksRes = await gamesApi.getFeedbacks(id);
        const fbData = feedbacksRes.data || [];
        setFeedbacks(fbData);

        const total = fbData.length;
        const avgRating =
          total > 0
            ? (fbData.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1)
            : "0.0";
        setStats({ total, avgRating });
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    } catch (error) {
      console.error("Error fetching game detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar key={i} className={`star-icon ${i < rating ? "filled" : ""}`} />
      ));
  };

  const currentUserReview = feedbacks.find(
    (feedback) => Number(feedback.userId) === Number(user?.id),
  );
  const otherFeedbacks = feedbacks.filter(
    (feedback) => Number(feedback.userId) !== Number(user?.id),
  );
  const totalReviewPages = Math.ceil(otherFeedbacks.length / reviewsPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalReviewPages, 1));
  const visibleFeedbacks = otherFeedbacks.slice(
    (safeCurrentPage - 1) * reviewsPerPage,
    safeCurrentPage * reviewsPerPage,
  );

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    const content = reviewContent.trim();

    if (!user) {
      setReviewMessage("Vui lòng đăng nhập để gửi đánh giá.");
      return;
    }
    if (!content) {
      setReviewMessage("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewMessage("");
      await gamesApi.createFeedback(id, {
        rating: reviewRating,
        content,
      });
      setReviewContent("");
      setReviewMessage("Đánh giá của bạn đã được gửi.");
      await fetchGameDetail();
    } catch (error) {
      setReviewMessage(
        error.response?.data?.message || "Không thể gửi đánh giá lúc này.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const startEditingReview = (feedback) => {
    setEditingFeedbackId(feedback.id);
    setEditingRating(feedback.rating);
    setEditingContent(feedback.content);
    setReviewMessage("");
  };

  const cancelEditingReview = () => {
    setEditingFeedbackId(null);
    setEditingContent("");
    setEditingRating(5);
  };

  const handleUpdateReview = async (event) => {
    event.preventDefault();
    const content = editingContent.trim();

    if (!content) {
      setReviewMessage("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewMessage("");
      await gamesApi.updateFeedback(id, editingFeedbackId, {
        rating: editingRating,
        content,
      });
      cancelEditingReview();
      setReviewMessage("Đánh giá đã được cập nhật.");
      await fetchGameDetail();
    } catch (error) {
      setReviewMessage(
        error.response?.data?.message || "Không thể cập nhật đánh giá lúc này.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (feedbackId) => {
    try {
      setReviewSubmitting(true);
      setReviewMessage("");
      await gamesApi.deleteFeedback(id, feedbackId);
      setReviewMessage("Đánh giá đã được xóa.");
      await fetchGameDetail();
    } catch (error) {
      setReviewMessage(
        error.response?.data?.message || "Không thể xóa đánh giá lúc này.",
      );
    } finally {
      setReviewSubmitting(false);
      setDeleteFeedbackId(null);
    }
  };

  if (loading) {
    return (
      <div className="gdetail-loading-screen">
        <div className="spinner"></div>
        <p>Đang tải thông tin trò chơi...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="gdetail-error-screen">
        <h2>Không tìm thấy trò chơi!</h2>
        <Link to="/games" className="btn-gdetail-back">
          <FaArrowLeft /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  const images = game.images && game.images.length > 0 ? game.images : [];
  const heroBgImage =
    images.length > 0 ? getImageUrl(images[0].image) : "/img/banner.png";

  return (
    <div className="gdetail-page-modern">
      {/* ─── BANNER TRÒ CHƠI HOÀNH TRÁNG (Tương tự Events) -─── */}
      <section className="gdetail-hero-section">
        <div
          className="gdetail-hero-bg"
          style={{ backgroundImage: `url('${heroBgImage}')` }}
        >
          <div className="gdetail-hero-overlay"></div>
          <div className="container gdetail-hero-content">
            <span className="gdetail-hero-tagline">
              {game.category || "Trò chơi đặc sắc"}
            </span>
            <h1 className="gdetail-hero-title">{game.name}</h1>
            <p className="gdetail-hero-desc">
              {game.description ||
                "Trải nghiệm những khoảnh khắc tuyệt vời và kịch tính nhất tại HG Playground!"}
            </p>
          </div>
        </div>
      </section>

      {/* ─── NỘI DUNG CHI TIẾT VÀ BỘ ẢNH ─── */}
      <section className="gdetail-content-section">
        <div className="container">
          {/* Nút quay lại & Badge trạng thái */}
          <div className="gdetail-top-actions">
            <Link to="/games" className="btn-gdetail-back">
              <FaArrowLeft /> Quay lại Danh Sách Trò Chơi
            </Link>
            <span
              className={`gdetail-status-badge ${game.status === "OPEN" ? "status-open" : "status-closed"}`}
            >
              {game.status === "OPEN" ? "Đang mở cửa" : "Đang bảo trì / Đóng"}
            </span>
          </div>

          {/* Grid thông tin chính */}
          <div className="gdetail-main-card">
            <div className="row">
              {/* Cột trái: Media / Gallery */}
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="gdetail-gallery-wrap">
                  <div className="gdetail-main-img-box">
                    {images.length > 0 ? (
                      <img
                        src={getImageUrl(images[activeImgIndex]?.image)}
                        alt={game.name}
                        className="gdetail-main-img"
                      />
                    ) : (
                      <div className="gdetail-no-img">Chưa có hình ảnh</div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="gdetail-thumbs-list">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`thumb-item ${activeImgIndex === idx ? "active" : ""}`}
                          onClick={() => setActiveImgIndex(idx)}
                        >
                          <img
                            src={getImageUrl(img.image)}
                            alt={`Thumb ${idx}`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cột phải: Thông số chi tiết */}
              <div className="col-lg-6">
                <div className="gdetail-info-box">
                  <h2 className="gdetail-info-title">{game.name}</h2>
                  <p className="gdetail-info-desc">
                    {game.description ||
                      "Chưa có mô tả chi tiết cho trò chơi này."}
                  </p>

                  <div className="gdetail-specs-grid">
                    <div className="spec-item">
                      <FaUsers className="spec-icon" />
                      <div>
                        <span className="spec-label">Độ tuổi phù hợp</span>
                        <span className="spec-value">
                          {game.recommendedAge}+ tuổi
                        </span>
                      </div>
                    </div>

                    <div className="spec-item">
                      <FaTicketAlt className="spec-icon" />
                      <div>
                        <span className="spec-label">Loại vé áp dụng</span>
                        <span className="spec-value highlight">
                          {game.allowedTicket || "Tất cả vé"}
                        </span>
                      </div>
                    </div>

                    <div className="spec-item">
                      <FaGamepad className="spec-icon" />
                      <div>
                        <span className="spec-label">Thể loại</span>
                        <span className="spec-value">{game.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── KHỐI THỐNG KÊ ─── */}
          <div className="row my-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="gdetail-stat-card">
                <div className="stat-icon-wrap icon-blue">
                  <FaComments />
                </div>
                <div>
                  <span className="stat-title">Tổng số lượt đánh giá</span>
                  <h3 className="stat-number">{stats.total}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="gdetail-stat-card">
                <div className="stat-icon-wrap icon-yellow">
                  <FaStar />
                </div>
                <div>
                  <span className="stat-title">Điểm đánh giá trung bình</span>
                  <h3 className="stat-number">
                    {stats.avgRating} <small>/ 5.0</small>
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* ─── DANH SÁCH ĐÁNH GIÁ CỦA KHÁCH HÀNG ─── */}
          <div className="gdetail-reviews-card">
            <h3 className="gdetail-section-title">Đánh giá từ du khách</h3>

            <div className="gdetail-review-form">
              <h4>Chia sẻ đánh giá của bạn</h4>
              {!user ? (
                <p className="gdetail-review-note">
                  Vui lòng đăng nhập để viết đánh giá.
                </p>
              ) : currentUserReview ? (
                <div className="gdetail-own-review">
                  <p className="gdetail-review-note">
                    Bạn đã đánh giá trò chơi này rồi.
                  </p>
                  {editingFeedbackId === currentUserReview.id ? (
                    <form onSubmit={handleUpdateReview}>
                      <div
                        className="gdetail-rating-picker"
                        aria-label="Chọn số sao"
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className={
                              rating <= editingRating ? "selected" : ""
                            }
                            onClick={() => setEditingRating(rating)}
                            aria-label={`${rating} sao`}
                          >
                            <FaStar />
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="gdetail-inline-review-input"
                        value={editingContent}
                        onChange={(event) =>
                          setEditingContent(event.target.value)
                        }
                        maxLength={1000}
                        rows={4}
                      />
                      <div className="gdetail-review-form-footer">
                        <span>{editingContent.length}/1000</span>
                        <div className="gdetail-review-actions">
                          <button
                            type="button"
                            className="secondary"
                            onClick={cancelEditingReview}
                          >
                            Hủy
                          </button>
                          <button type="submit" disabled={reviewSubmitting}>
                            {reviewSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="gdetail-own-review-header">
                        <div className="review-stars">
                          {renderStars(currentUserReview.rating)}
                        </div>
                        <span className="review-date">
                          {currentUserReview.createdAt
                            ? new Date(
                                currentUserReview.createdAt,
                              ).toLocaleString("vi-VN")
                            : ""}
                        </span>
                      </div>
                      <p className="review-content">
                        {currentUserReview.content}
                      </p>
                      <div className="gdetail-review-actions">
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => startEditingReview(currentUserReview)}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            setDeleteFeedbackId(currentUserReview.id)
                          }
                          disabled={reviewSubmitting}
                        >
                          Xóa
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmitReview}>
                  <div
                    className="gdetail-rating-picker"
                    aria-label="Chọn số sao"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className={rating <= reviewRating ? "selected" : ""}
                        onClick={() => setReviewRating(rating)}
                        aria-label={`${rating} sao`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewContent}
                    onChange={(event) => setReviewContent(event.target.value)}
                    maxLength={1000}
                    placeholder="Viết cảm nhận của bạn..."
                    rows={4}
                  />
                  <div className="gdetail-review-form-footer">
                    <span>{reviewContent.length}/1000</span>
                    <button type="submit" disabled={reviewSubmitting}>
                      {reviewSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                  </div>
                </form>
              )}
              {reviewMessage && (
                <p className="gdetail-review-message">{reviewMessage}</p>
              )}
            </div>

            {otherFeedbacks.length === 0 ? (
              <div className="gdetail-no-reviews">
                <p>Chưa có đánh giá nào khác cho trò chơi này.</p>
              </div>
            ) : (
              <>
                <div className="gdetail-reviews-list">
                  {visibleFeedbacks.map((fb) => (
                    <div key={fb.id} className="gdetail-review-item">
                      <div className="review-header">
                        <div className="review-user">
                          <div>
                            <span className="username">
                              {fb.username || "Khách tham quan"}
                            </span>
                            <span className="review-date">
                              {fb.createdAt
                                ? new Date(fb.createdAt).toLocaleString("vi-VN")
                                : ""}
                            </span>
                          </div>
                        </div>
                        <div className="review-stars">
                          {renderStars(fb.rating)}
                        </div>
                      </div>
                      <p className="review-content">{fb.content}</p>
                    </div>
                  ))}
                </div>
                {totalReviewPages > 1 && (
                  <div className="gdetail-pagination">
                    <button
                      type="button"
                      disabled={safeCurrentPage === 1}
                      onClick={() => setCurrentPage(safeCurrentPage - 1)}
                    >
                      Trước
                    </button>
                    <span>
                      Trang {safeCurrentPage} / {totalReviewPages}
                    </span>
                    <button
                      type="button"
                      disabled={safeCurrentPage === totalReviewPages}
                      onClick={() => setCurrentPage(safeCurrentPage + 1)}
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {deleteFeedbackId && (
        <div
          className="gdetail-confirm-overlay"
          role="presentation"
          onClick={() => setDeleteFeedbackId(null)}
        >
          <div
            className="gdetail-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-review-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-review-title">Xóa đánh giá?</h3>
            <p>Bạn có chắc muốn xóa đánh giá này không?</p>
            <div className="gdetail-confirm-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setDeleteFeedbackId(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => handleDeleteReview(deleteFeedbackId)}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Đang xóa..." : "Xóa đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetail;
