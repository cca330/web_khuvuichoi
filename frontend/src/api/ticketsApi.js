import axiosClient from "./axiosClient";

const ticketsApi = {
  // Lấy danh sách tickets
  getAll: (params) => {
    return axiosClient.get("/tickets", { params });
  },

  getAllGateTicketsForAdmin: () => {
    return axiosClient.get("/tickets/admin/gate-tickets");
  },

  getGateTicketForAdmin: (id) => {
    return axiosClient.get(`/tickets/admin/gate-tickets/${id}`);
  },

  createGateTicket: (data) => {
    return axiosClient.post("/tickets/admin/gate-tickets", data);
  },

  updateGateTicket: (id, data) => {
    return axiosClient.put(`/tickets/admin/gate-tickets/${id}`, data);
  },

  deleteGateTicket: (id) => {
    return axiosClient.delete(`/tickets/admin/gate-tickets/${id}`);
  },

  // Lấy thống kê tickets
  getStats: () => {
    return axiosClient.get("/tickets/stats");
  },

  // Lấy tickets theo order
  getByOrder: (orderId) => {
    return axiosClient.get(`/tickets/order/${orderId}`);
  },

  getByUserOrder: (orderId) => {
    return axiosClient.get(`/tickets/orders/${orderId}/tickets`);
  },

  // Scan ticket
  scan: (data) => {
    return axiosClient.post("/tickets/scan", data);
  },

  // Generate tickets
  generate: (data) => {
    return axiosClient.post("/tickets/generate", data);
  },
};

export default ticketsApi;
