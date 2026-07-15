import axiosClient from './axiosClient';

const promotionsApi = {
  // Lấy tất cả promotions
  getAll: () => {
    return axiosClient.get('/promotions');
  },

  // Lấy promotion theo id
  getById: (id) => {
    return axiosClient.get(`/promotions/${id}`);
  },

  // Tạo promotion mới
  create: (data) => {
    return axiosClient.post('/promotions', data);
  },

  // Cập nhật promotion
  update: (id, data) => {
    return axiosClient.put(`/promotions/${id}`, data);
  },

  // Vô hiệu hóa promotion
  disable: (id) => {
    return axiosClient.put(`/promotions/${id}/disable`);
  },

  // Áp dụng promotion
  apply: (data) => {
    return axiosClient.post('/promotions/apply', data);
  },

  // Lấy thống kê
  getStats: () => {
    return axiosClient.get('/promotions/stats');
  },
};

export default promotionsApi;
