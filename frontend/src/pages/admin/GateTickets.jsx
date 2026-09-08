import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ticketsApi from "../../api/ticketsApi";
import "../../styles/admin.css";

const typeLabels = { ADULT: "Người lớn", CHILD: "Trẻ em", ALL: "Tất cả" };

export default function GateTickets() {
  const [gateTickets, setGateTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGateTickets();
  }, []);

  const fetchGateTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketsApi.getAllGateTicketsForAdmin();
      setGateTickets(response.data);
    } catch (error) {
      console.error("Error fetching gate tickets:", error);
      alert(error.response?.data?.message || "Không thể tải danh sách loại vé");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa loại vé này?")) return;

    try {
      await ticketsApi.deleteGateTicket(id);
      fetchGateTickets();
    } catch (error) {
      alert(error.response?.data?.message || "Không thể xóa loại vé");
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Quản lý loại vé</h1>
          <p className="muted">Thêm, chỉnh sửa và quản lý các loại vé cổng</p>
        </div>
        <div className="top-buttons">
          <Link to="/admin/ticket-types/create" className="btn primary">
            + Thêm loại vé
          </Link>
        </div>
      </div>

      <div className="table-wrap admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên loại vé</th>
              <th>Giá</th>
              <th>Đối tượng</th>
              <th>Sức chứa</th>
              <th>Khung giờ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">Đang tải...</td>
              </tr>
            ) : gateTickets.length === 0 ? (
              <tr>
                <td colSpan="8">Không có dữ liệu</td>
              </tr>
            ) : (
              gateTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>
                    <strong>{ticket.name}</strong>
                    {ticket.isCombo && (
                      <span className="badge blue"> COMBO</span>
                    )}
                  </td>
                  <td>{formatPrice(ticket.price)}</td>
                  <td>{typeLabels[ticket.type] || ticket.type}</td>
                  <td>
                    {ticket.admitsAdult} người lớn, {ticket.admitsChild} trẻ em
                  </td>
                  <td>
                    {ticket.validFromTime} - {ticket.validUntilTime}
                  </td>
                  <td>
                    <span
                      className={`badge ${ticket.status === "ACTIVE" ? "green" : "gray"}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      className="btn"
                      to={`/admin/ticket-types/edit/${ticket.id}`}
                    >
                      Sửa
                    </Link>
                    <button
                      className="btn danger"
                      onClick={() => handleDelete(ticket.id)}
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
}
