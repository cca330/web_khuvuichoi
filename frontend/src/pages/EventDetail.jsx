import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";
import eventsApi from "../api/eventsApi";
import { getImageUrl } from "../utils/imageUtils";
import "../styles/home.css"; // Chuyển sang dùng chung file style với trang chủ & games

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hiệu ứng cuộn trang lặp lại chuyên nghiệp
  useEffect(() => {
    if (!loading && event) {
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
  }, [loading, event, images, schedules]);

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const response = await eventsApi.getById(id);
      setEvent(response.data);

      // Fetch images
      try {
        const imagesRes = await eventsApi.getImages(id);
        setImages(imagesRes.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }

      // Fetch schedules
      try {
        const schedulesRes = await eventsApi.getSchedules(id);
        setSchedules(schedulesRes.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    } catch (error) {
      console.error("Error fetching event detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      COMING_SOON: "Sắp diễn ra",
      ONGOING: "Đang diễn ra",
      COMPLETED: "Đã kết thúc",
      CANCELLED: "Đã hủy",
    };
    return labels[status] || status;
  };

  const getStatusBadgeClass = (status) => {
    const colors = {
      COMING_SOON: "status-coming",
      ONGOING: "status-ongoing",
      COMPLETED: "status-completed",
      CANCELLED: "status-cancelled",
    };
    return colors[status] || "status-completed";
  };

  if (loading) {
    return <div className="loading">Đang tải chi tiết sự kiện...</div>;
  }

  if (!event) {
    return (
      <div className="event-detail-error">
        <div className="error-content">
          <h4>Không tìm thấy sự kiện!</h4>
          <Link to="/events" className="btn-modern-back">
            Quay lại trang sự kiện
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      {/* ─── BANNER SỰ KIỆN HOÀNH TRÁNG (Đồng bộ trang chủ) ─── */}
      <section className="event-detail-hero">
        <div
          className="event-hero-bg"
          style={{
            backgroundImage: `url(${getImageUrl(event.thumbnail) || "/img/banner.png"})`,
          }}
        >
          <div className="event-hero-overlay"></div>
          <div className="container event-hero-content">
            <span
              className={`event-status-badge ${getStatusBadgeClass(event.status)}`}
            >
              {getStatusLabel(event.status)}
            </span>
            <h1 className="event-hero-title">{event.title}</h1>
            <div className="event-hero-meta">
              <span className="meta-item">
                <FaMapMarkerAlt /> {event.location}
              </span>
              <span className="meta-item">
                <FaCalendarAlt />{" "}
                {new Date(event.startDatetime).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NỘI DUNG CHI TIẾT SỰ KIỆN ─── */}
      <section className="event-content-section spad">
        <div className="container">
          <div className="row">
            {/* Cột trái: Thông tin chính và mô tả */}
            <div className="col-lg-8 scroll-reveal mb-5 mb-lg-0">
              <div className="event-main-card">
                <h3 className="section-subtitle">Chi tiết chương trình</h3>
                <p className="event-description-text">{event.description}</p>

                {/* Grid thời gian chi tiết */}
                <div className="event-time-grid">
                  <div className="time-box">
                    <FaClock className="icon-start" />
                    <div>
                      <span>Thời gian bắt đầu</span>
                      <strong>
                        {new Date(event.startDatetime).toLocaleString("vi-VN")}
                      </strong>
                    </div>
                  </div>
                  <div className="time-box">
                    <FaClock className="icon-end" />
                    <div>
                      <span>Thời gian kết thúc</span>
                      <strong>
                        {new Date(event.endDatetime).toLocaleString("vi-VN")}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bộ sưu tập ảnh sự kiện */}
              <div className="event-gallery-section mt-5 scroll-reveal">
                <h3 className="section-subtitle">Hình ảnh sự kiện</h3>
                {images.length === 0 ? (
                  <div className="empty-box">
                    <p>
                      Hình ảnh thực tế về sự kiện sẽ được cập nhật liên tục.
                    </p>
                  </div>
                ) : (
                  <div className="event-images-grid">
                    {images.map((img, index) => (
                      <div key={index} className="event-image-card">
                        <img
                          src={getImageUrl(img.image)}
                          alt={`Event Gallery ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cột phải: Lịch trình chương trình */}
            <div className="col-lg-4 scroll-reveal">
              <div className="event-schedule-card">
                <h3 className="schedule-title">Lịch trình chi tiết</h3>
                {schedules.length === 0 ? (
                  <div className="empty-box-small">
                    <p>Lịch trình chi tiết đang được cập nhật...</p>
                  </div>
                ) : (
                  <div className="timeline-flow">
                    {schedules.map((schedule, idx) => (
                      <div key={schedule.id} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-time">
                            {new Date(schedule.scheduleTime).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                          <h4 className="timeline-heading">{schedule.title}</h4>
                          <p className="timeline-desc">
                            {schedule.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nút điều hướng */}
              <div className="event-actions mt-4">
                <Link to="/events" className="btn-event-back-modern">
                  <FaArrowLeft /> Quay lại danh sách
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetail;
