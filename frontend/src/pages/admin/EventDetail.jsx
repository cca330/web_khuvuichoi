import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import eventsApi from "../../api/eventsApi";
import { getImageUrl } from "../../utils/imageUtils";
import "../../styles/admin.css";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [scheduleForm, setScheduleForm] = useState({
    scheduleTime: "",
    title: "",
    description: "",
    sortOrder: 1,
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventRes, schedulesRes] = await Promise.allSettled([
        eventsApi.getById(id),
        eventsApi.getSchedules(id),
      ]);

      if (eventRes.status === "fulfilled") setEvent(eventRes.value.data);
      if (schedulesRes.status === "fulfilled")
        setSchedules(schedulesRes.value.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      await eventsApi.createSchedule({
        eventId: parseInt(id),
        scheduleTime: scheduleForm.scheduleTime,
        title: scheduleForm.title,
        description: scheduleForm.description,
        sortOrder: parseInt(scheduleForm.sortOrder) || 1,
      });
      setScheduleForm({
        scheduleTime: "",
        title: "",
        description: "",
        sortOrder: 1,
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Không thể thêm lịch trình");
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Xóa mục lịch trình này?")) return;
    try {
      await eventsApi.deleteSchedule(scheduleId);
      fetchData();
    } catch (err) {
      alert("Không thể xóa lịch trình");
    }
  };

  if (loading) return <div className="container">Đang tải...</div>;
  if (!event) return <div className="container">Không tìm thấy sự kiện</div>;

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>{event.title}</h1>
          <p className="muted">Chi tiết sự kiện ID {event.id}</p>
        </div>
        <div className="top-buttons">
          <Link to={`/admin/events/edit/${event.id}`} className="btn primary">
            Sửa
          </Link>
          <button className="btn" onClick={() => navigate("/admin/events")}>
            Quay lại
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-row">
          <strong>Mô tả:</strong> {event.description || "Chưa có"}
        </div>
        <div className="detail-row">
          <strong>Địa điểm:</strong> {event.location || "Chưa có"}
        </div>
        <div className="detail-row">
          <strong>Thời gian:</strong>{" "}
          {new Date(event.startDatetime).toLocaleString("vi-VN")} →{" "}
          {new Date(event.endDatetime).toLocaleString("vi-VN")}
        </div>
        <div className="detail-row">
          <strong>Trạng thái:</strong> {event.status}
        </div>

        {event.images?.length > 0 && (
          <div className="detail-row">
            <strong>Ảnh:</strong>
            <div className="image-list">
              {event.images.map((img) => (
                <img
                  key={img.id}
                  src={getImageUrl(img.image)}
                  alt={event.title}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <h3 className="section-subtitle">Lịch trình sự kiện</h3>

      <div className="table-wrap admin-table">
        <table>
          <thead>
            <tr>
              <th>Thứ tự</th>
              <th>Giờ</th>
              <th>Tiêu đề</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan="5">Chưa có lịch trình nào</td>
              </tr>
            ) : (
              schedules.map((s) => (
                <tr key={s.id}>
                  <td>{s.sortOrder}</td>
                  <td>{s.scheduleTime}</td>
                  <td>{s.title}</td>
                  <td>{s.description}</td>
                  <td>
                    <button
                      className="btn danger"
                      onClick={() => handleDeleteSchedule(s.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h3 className="section-subtitle">Thêm mục lịch trình mới</h3>
      <form onSubmit={handleAddSchedule} className="form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Giờ (HH:mm:ss) *</label>
            <input
              type="time"
              step="1"
              value={scheduleForm.scheduleTime}
              onChange={(e) =>
                setScheduleForm({
                  ...scheduleForm,
                  scheduleTime: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Thứ tự</label>
            <input
              type="number"
              min="1"
              value={scheduleForm.sortOrder}
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, sortOrder: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tiêu đề *</label>
          <input
            type="text"
            value={scheduleForm.title}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, title: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            rows={2}
            value={scheduleForm.description}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, description: e.target.value })
            }
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary">
            Thêm lịch trình
          </button>
        </div>
      </form>
    </div>
  );
}
