import axiosClient from './axiosClient';

const promotionsApi = {
  // Lấy tất cả promotions
  getAll: () => {
    return axiosClient.get('/promotions');
  },

  // Lấy các promotion đang hoạt động và còn trong thời gian áp dụng
  getActivePromotions: async () => {
    const response = await axiosClient.get('/promotions');
    const today = new Date().toISOString().split('T')[0];

    const activePromotions = (response.data || []).filter((promotion) => {
      return (
        promotion.status === 'ACTIVE' &&
        today >= String(promotion.startDate).slice(0, 10) &&
        today <= String(promotion.endDate).slice(0, 10)
      );
    });

    return { ...response, data: activePromotions };
  },

  // Lấy promotion theo id
  getById: (id) => {
    return axiosClient.get(`/promotions/${id}`);
  },

  // Lấy danh sách gate tickets cho phạm vi áp dụng
  getGateTickets: () => {
    return axiosClient.get('/promotions/gate-tickets');
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
    return axiosClient.delete(`/promotions/${id}/disable`);
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
