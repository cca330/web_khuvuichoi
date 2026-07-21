import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import eventsApi from "../../api/eventsApi";
import "../../styles/admin.css";

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
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sự kiện này?")) return;

    try {
      await eventsApi.delete(id);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Không thể xóa sự kiện");
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      COMING_SOON: "green",
      ONGOING: "blue",
      FINISHED: "gray", // ← sửa từ COMPLETED thành FINISHED
      CANCELLED: "red",
    };
    return (
      <span className={`badge ${colors[status] || "gray"}`}>{status}</span>
    );
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Quản lý sự kiện</h1>
          <p className="muted">Danh sách tất cả sự kiện</p>
        </div>
        <div className="top-buttons">
          <Link to="/admin/events/create" className="btn primary">
            + Thêm sự kiện
          </Link>
        </div>
      </div>

      <div className="table-wrap admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Địa điểm</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Đang tải...</td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan="7">Không có dữ liệu</td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.title}</td>
                  <td>{event.location}</td>
                  <td>
                    {new Date(event.startDatetime).toLocaleString("vi-VN")}
                  </td>
                  <td>{new Date(event.endDatetime).toLocaleString("vi-VN")}</td>
                  <td>{getStatusBadge(event.status)}</td>
                  <td>
                    <Link className="btn" to={`/admin/events/${event.id}`}>
                      Chi tiết
                    </Link>
                    <Link className="btn" to={`/admin/events/edit/${event.id}`}>
                      Sửa
                    </Link>
                    <button
                      className="btn danger"
                      onClick={() => handleDelete(event.id)}
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
    </div>
  );
};

export default Events;
