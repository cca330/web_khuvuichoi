import axiosClient from "./axiosClient";

const gamesApi = {
  // Lấy tất cả games
  getAll: () => {
    return axiosClient.get("/games");
  },

  // Tìm kiếm game
  search: (keyword) => {
    return axiosClient.get("/games/search", { params: { keyword } });
  },

  // Lấy game theo loại vé cổng
  getByGate: (type) => {
    return axiosClient.get(`/games/gate/${type}`);
  },

  // Lấy game theo id
  getById: (id) => {
    return axiosClient.get(`/games/${id}`);
  },

  // Lấy thống kê feedback
  getStats: (id) => {
    return axiosClient.get(`/games/${id}/stats`);
  },

  // Lấy feedbacks
  getFeedbacks: (id) => {
    return axiosClient.get(`/games/${id}/feedbacks`);
  },

  createFeedback: (id, data) => {
    return axiosClient.post(`/games/${id}/feedbacks`, data);
  },

  updateFeedback: (gameId, feedbackId, data) => {
    return axiosClient.put(`/games/${gameId}/feedbacks/${feedbackId}`, data);
  },

  deleteFeedback: (gameId, feedbackId) => {
    return axiosClient.delete(`/games/${gameId}/feedbacks/${feedbackId}`);
  },

  // Tạo game mới
  create: (data) => {
    return axiosClient.post("/games", data);
  },

  // Cập nhật game
  update: (id, data) => {
    return axiosClient.put(`/games/${id}`, data);
  },

  // Xóa game
  delete: (id) => {
    return axiosClient.delete(`/games/${id}`);
  },

  // Đóng game
  close: (id) => {
    return axiosClient.put(`/games/${id}/close`);
  },

  // Mở lại game
  open: (id) => {
    return axiosClient.put(`/games/${id}/open`);
  },
};

export default gamesApi;
