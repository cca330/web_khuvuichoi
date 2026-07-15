import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import eventsApi from '../api/eventsApi';
import '../styles/admin.css';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Error fetching images:', error);
      }

      // Fetch schedules
      try {
        const schedulesRes = await eventsApi.getSchedules(id);
        setSchedules(schedulesRes.data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    } catch (error) {
      console.error('Error fetching event detail:', error);
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

  if (!event) {
    return <div className="error">Không tìm thấy sự kiện</div>;
  }

  return (
    <div className="layout">
      <div className="content">
        <div className="container">
          <div className="header">
            <div>
              <h1>Chi tiết sự kiện</h1>
              <p className="muted">{event.title}</p>
            </div>
          </div>

          {/* Event Info Card */}
          <div className="event-card">
            <div className="event-header">
              <h2>{event.title}</h2>
              <span className={`badge ${getStatusBadge(event.status)}`}>
                {event.status}
              </span>
            </div>
            
            <div className="event-info-grid">
              <div className="info-item">
                <span>Địa điểm</span>
                <strong>{event.location}</strong>
              </div>
              <div className="info-item">
                <span>Thời gian bắt đầu</span>
                <strong>{new Date(event.startDatetime).toLocaleString('vi-VN')}</strong>
              </div>
              <div className="info-item">
                <span>Thời gian kết thúc</span>
                <strong>{new Date(event.endDatetime).toLocaleString('vi-VN')}</strong>
              </div>
            </div>

            <p className="event-description">{event.description}</p>

            {event.thumbnail && (
              <div className="event-thumbnail">
                <img src={event.thumbnail} alt={event.title} />
              </div>
            )}
          </div>

          {/* Event Images */}
          <div className="section">
            <div className="section-header">
              <h3>Ảnh sự kiện</h3>
            </div>
            {images.length === 0 ? (
              <p className="muted">Chưa có ảnh sự kiện</p>
            ) : (
              <div className="images-grid">
                {images.map((img, index) => (
                  <div key={index} className="image-item">
                    <img src={`/uploads/${img.image}`} alt={`Event image ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event Schedules */}
          <div className="section">
            <div className="section-header">
              <h3>Lịch trình</h3>
            </div>
            {schedules.length === 0 ? (
              <p className="muted">Chưa có lịch trình</p>
            ) : (
              <div className="schedules-table">
                <table>
                  <thead>
                    <tr>
                      <th>Thời gian</th>
                      <th>Tiêu đề</th>
                      <th>Mô tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr key={schedule.id}>
                        <td>{new Date(schedule.scheduleTime).toLocaleString('vi-VN')}</td>
                        <td>{schedule.title}</td>
                        <td>{schedule.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="actions">
            <Link to="/events" className="btn secondary">
              ← Quay lại
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
