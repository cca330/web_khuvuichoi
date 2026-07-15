import axiosClient from './axiosClient';

const eventsApi = {
  // Lấy tất cả events
  getAll: () => {
    return axiosClient.get('/events');
  },

  // Lấy event theo id
  getById: (id) => {
    return axiosClient.get(`/events/${id}`);
  },

  // Lấy schedules theo event
  getSchedules: (eventId) => {
    return axiosClient.get(`/events/${eventId}/schedules`);
  },

  // Tạo event mới
  create: (data) => {
    return axiosClient.post('/events', data);
  },

  // Tạo schedule mới
  createSchedule: (data) => {
    return axiosClient.post('/events/schedules', data);
  },

  // Cập nhật event
  update: (id, data) => {
    return axiosClient.put(`/events/${id}`, data);
  },

  // Cập nhật schedule
  updateSchedule: (id, data) => {
    return axiosClient.put(`/events/schedules/${id}`, data);
  },

  // Xóa event
  delete: (id) => {
    return axiosClient.delete(`/events/${id}`);
  },

  // Xóa schedule
  deleteSchedule: (id) => {
    return axiosClient.delete(`/events/schedules/${id}`);
  },
};

export default eventsApi;
