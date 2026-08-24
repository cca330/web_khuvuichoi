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

  // Tính trạng thái thật dựa theo thời gian hiện tại, không đọc thẳng event.status
  const getRealStatus = (event) => {
    if (event.status === "CANCELLED") return "CANCELLED";

    const now = new Date();
    const start = new Date(event.startDatetime);
    const end = new Date(event.endDatetime);

    if (now < start) return "COMING_SOON";
    if (now >= start && now <= end) return "ONGOING";
    return "COMPLETED";
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

  // Hiển thị đúng ngày giờ thật của sự kiện, không gắn cứng "tuần này"
  const formatEventDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const timeStr = date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const dateStr = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `${timeStr} - ${dateStr}`;
    } catch {
      return "";
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
              <HiSparkles style={{ marginRight: 6, color: "#FFD700" }} /> Chuyến
              Phiêu Lưu Kỳ Thú
            </span>
            <h2 className="events-hero-title">
              Hành Trình Sự Kiện HG Playground
            </h2>
            <p className="events-hero-desc">
              Khám phá chuỗi lễ hội hoành tráng, workshop sáng tạo và các hoạt
              động giải trí bất tận!
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
                const realStatus = getRealStatus(event);

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
                            realStatus,
                          )}`}
                        >
                          {getStatusLabel(realStatus)}
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
