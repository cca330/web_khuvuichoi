import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import eventsApi from "../api/eventsApi";
import "../styles/events.css"; // Import file CSS riêng biệt vừa tạo

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Hiệu ứng cuộn trang lặp lại chuyên nghiệp
  useEffect(() => {
    if (!loading && events.length > 0) {
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
  }, [loading, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsApi.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
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
    return <div className="loading">Đang tải danh sách sự kiện...</div>;
  }

  return (
    <div className="events-page-modern">
      {/* ─── BANNER SỰ KIỆN HOÀNH TRÁNG (Sửa lỗi đè chữ lên Menu) ─── */}
      <section className="events-hero-section">
        <div
          className="events-hero-bg"
          style={{ backgroundImage: "url('/img/banner.png')" }}
        >
          <div className="events-hero-overlay"></div>
          <div className="container events-hero-content">
            <span className="events-hero-tagline">Sự kiện đặc biệt</span>
            <h2 className="events-hero-title">Sự Kiện Tại HG Playground</h2>
            <p className="events-hero-desc">
              Đừng bỏ lỡ các sự kiện lễ hội hoành tráng và các chương trình ưu
              đãi đặc sắc sắp tới!
            </p>
          </div>
        </div>
      </section>

      {/* ─── DANH SÁCH SỰ KIỆN CHÍNH ─── */}
      <section className="events-list-section">
        <div className="container text-center">
          <h3 className="events-section-title">Danh Sách Sự Kiện</h3>

          {events.length === 0 ? (
            <div className="modern-no-events scroll-reveal">
              <div className="no-events-icon">📅</div>
              <h4>Hiện chưa có sự kiện nào!</h4>
              <p>
                Hãy quay lại sau để xem các chương trình và sự kiện mới nhất từ
                chúng tôi.
              </p>
            </div>
          ) : (
            <div className="row text-left justify-content-start">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="col-md-6 col-lg-4 mb-4 d-flex scroll-reveal"
                >
                  <div className="modern-event-card">
                    <div className="event-card-img-wrap">
                      <img
                        src={event.thumbnail || "/img/default-event.jpg"}
                        alt={event.title}
                        className="event-card-img"
                      />
                      <span
                        className={`event-card-status ${getStatusBadgeClass(event.status)}`}
                      >
                        {getStatusLabel(event.status)}
                      </span>
                    </div>

                    <div className="event-card-body">
                      <h4 className="event-card-title">{event.title}</h4>
                      <p className="event-card-desc">
                        {event.description
                          ? `${event.description.substring(0, 90)}...`
                          : "HG Playground liên tục tổ chức các sự kiện hoành tráng..."}
                      </p>

                      <div className="event-card-meta">
                        <div className="meta-row">
                          <FaMapMarkerAlt /> <span>{event.location}</span>
                        </div>
                        <div className="meta-row">
                          <FaCalendarAlt />{" "}
                          <span>
                            {new Date(event.startDatetime).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/events/${event.id}`}
                        className="btn-modern-event-detail"
                      >
                        Xem chi tiết <i className="fa fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
