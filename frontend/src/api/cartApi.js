import axiosClient from './axiosClient';

const cartApi = {
  // Lấy danh sách vé cổng
  getGateTickets: () => {
    return axiosClient.get('/tickets/gate-tickets');
  },

  // Lấy thông tin giỏ hàng
  getCart: (userId) => {
    return axiosClient.get(`/tickets/cart?userId=${userId}`);
  },

  // Thêm vé cổng vào giỏ hàng
  addGate: (userId, gateTicketId) => {
    return axiosClient.post(`/tickets/cart/add?userId=${userId}`, { gateTicketId });
  },

  // Cập nhật số lượng
  updateQty: (itemId, action) => {
    return axiosClient.post('/tickets/cart/update-qty', { itemId, action });
  },

  // Xóa item khỏi giỏ hàng
  deleteItem: (itemId) => {
    return axiosClient.post('/tickets/cart/delete-item', { itemId });
  },

  // Lịch sử đơn hàng
  getOrderHistory: (userId) => {
    return axiosClient.get(`/tickets/orders/history?userId=${userId}`);
  },

  // Chi tiết đơn hàng
  getOrderDetail: (orderId, userId) => {
    return axiosClient.get(`/tickets/orders/${orderId}?userId=${userId}`);
  },

  // Thanh toán
  checkout: (userId, orderId) => {
    return axiosClient.post(`/tickets/checkout?userId=${userId}`, { orderId });
  },
};

export default cartApi;
