import axiosClient from './axiosClient';

const ticketsApi = {
  // Lấy danh sách tickets
  getAll: (params) => {
    return axiosClient.get('/tickets', { params });
  },

  // Lấy thống kê tickets
  getStats: () => {
    return axiosClient.get('/tickets/stats');
  },

  // Lấy tickets theo order
  getByOrder: (orderId) => {
    return axiosClient.get(`/tickets/order/${orderId}`);
  },

  // Scan ticket
  scan: (data) => {
    return axiosClient.post('/tickets/scan', data);
  },

  // Generate tickets
  generate: (data) => {
    return axiosClient.post('/tickets/generate', data);
  },
};

export default ticketsApi;
