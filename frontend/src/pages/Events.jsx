import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaArrowRight } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import eventsApi from "../api/eventsApi";
import { getImageUrl } from "../utils/imageUtils";
import "../styles/events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsApi.getAll();
      setEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      COMING_SOON: "SẮP DIỄN RA",
      ONGOING: "ĐANG DIỄN RA",
      COMPLETED: "ĐÃ KẾT THÚC",
      CANCELLED: "ĐÃ HỦY",
    };
    return labels[status] || "SẮP DIỄN RA";
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      COMING_SOON: "status-mint",
      ONGOING: "status-orange",
      COMPLETED: "status-grey",
      CANCELLED: "status-red",
    };
    return classes[status] || "status-mint";
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return "08:00 - T7 TUẦN NÀY";
    try {
      const date = new Date(dateString);
      const timeStr = date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const dayOfWeek = `T${date.getDay() + 1 === 1 ? "CN" : date.getDay() + 1}`;
      return `${timeStr} - ${dayOfWeek} TUẦN NÀY`;
    } catch {
      return "08:00 - T7 TUẦN NÀY";
    }
  };

  if (loading) {
    return (
      <div className="timeline-loading">
        <div className="timeline-spinner"></div>
        <p>Đang tải danh sách sự kiện...</p>
      </div>
    );
  }

  return (
    <div className="events-timeline-page">
      {/* ─── BANNER TRÒ CHƠI HOÀNH TRÁNG (ĐỒNG BỘ Y HỆT TRANG GAMES) ─── */}
<section className="events-hero-section">
  <div
    className="events-hero-bg"
    style={{ backgroundImage: "url('/img/banner.png')" }}
  >
    <div className="events-hero-overlay"></div>
    <div className="container events-hero-content">
      <span className="events-hero-tagline">
        <HiSparkles style={{ marginRight: 6, color: "#FFD700" }} /> Chuyến Phiêu Lưu Kỳ Thú
      </span>
      <h2 className="events-hero-title">
        Hành Trình Sự Kiện HG Playground
      </h2>
      <p className="events-hero-desc">
        Khám phá chuỗi lễ hội hoành tráng, workshop sáng tạo và các hoạt động giải trí bất tận!
      </p>
    </div>
  </div>
</section>

      {/* ─── TIMELINE BODY ─── */}
      <div className="container events-body-container">
        <h2 className="timeline-main-title">LỄ HỘI CHUỖI SỰ KIỆN</h2>

        {events.length === 0 ? (
          <div className="empty-events-box">
            <p>Hiện chưa có sự kiện nào được đăng tải.</p>
          </div>
        ) : (
          <div className="timeline-container">
            <div className="timeline-vertical-line"></div>

            <div className="timeline-items">
              {events.map((event, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={event.id}
                    className={`timeline-item ${
                      isEven ? "layout-left-img" : "layout-right-img"
                    }`}
                  >
                    <div className="timeline-connector-dashed"></div>

                    {/* KHỐI HÌNH ẢNH */}
                    <div className="timeline-media-block">
                      <div className="timeline-img-card">
                        <img
                          src={
                            getImageUrl(event.thumbnail) ||
                            "/img/default-event.jpg"
                          }
                          alt={event.title}
                        />
                        <div className="badge-time-yellow">
                          <FaClock style={{ marginRight: 4 }} />
                          {formatEventDate(event.startDatetime)}
                        </div>
                      </div>
                    </div>

                    {/* KHỐI THÔNG TIN */}
                    <div className="timeline-text-block">
                      <h3 className="event-item-title">
                        <Link to={`/events/${event.id}`}>{event.title}</Link>
                      </h3>

                      {event.location && (
                        <div className="event-item-location">
                          <FaMapMarkerAlt className="loc-icon" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      <p className="event-item-desc">
                        {event.description
                          ? `${event.description.substring(0, 110)}...`
                          : "Tham gia trải nghiệm chuỗi hoạt động giải trí bùng nổ sắc màu..."}
                      </p>

                      <div className="event-status-row">
                        <span className="status-label-text">Trạng thái:</span>
                        <span
                          className={`status-badge ${getStatusBadgeClass(
                            event.status
                          )}`}
                        >
                          {getStatusLabel(event.status)}
                        </span>
                      </div>

                      <Link
                        to={`/events/${event.id}`}
                        className="btn-event-detail"
                      >
                        <span>Chi tiết</span>
                        <FaArrowRight className="arrow-icon" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;