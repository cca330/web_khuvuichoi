import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventsApi from '../api/eventsApi';
import '../styles/style1.css';

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
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'COMING_SOON': 'green',
      'ONGOING': 'blue',
      'COMPLETED': 'gray',
      'CANCELLED': 'red'
    };
    return colors[status] || 'gray';
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="events-page">
      {/* Banner */}
      <section className="hero">
        <div className="hero__item">
          <div className="hero__text">
            <span>Sự kiện đặc biệt</span>
            <h2>Sự Kiện Tại HG Playground</h2>
            <p>Đừng bỏ lỡ các sự kiện hấp dẫn!</p>
          </div>
        </div>
      </section>

      {/* Danh sách sự kiện */}
      <section className="events-list">
        <div className="container">
          <h2 className="text-center">Danh Sách Sự Kiện</h2>

          {events.length === 0 ? (
            <div className="no-events">
              <h4>Hiện chưa có sự kiện nào</h4>
              <p>Hãy quay lại sau để xem các sự kiện mới.</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img
                      src={event.thumbnail || '/img/default-event.jpg'}
                      alt={event.title}
                    />
                    <span className={`badge ${getStatusBadge(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-location">
                      <i className="fa fa-map-marker-alt"></i>
                      {event.location}
                    </p>
                    <div className="event-dates">
                      <div className="date-item">
                        <span>Bắt đầu:</span>
                        <strong>{new Date(event.startDatetime).toLocaleString('vi-VN')}</strong>
                      </div>
                      <div className="date-item">
                        <span>Kết thúc:</span>
                        <strong>{new Date(event.endDatetime).toLocaleString('vi-VN')}</strong>
                      </div>
                    </div>
                    <p className="event-description">
                      {event.description?.substring(0, 150)}...
                    </p>
                    <Link to={`/events/${event.id}`} className="btn-detail">
                      Chi tiết
                    </Link>
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
