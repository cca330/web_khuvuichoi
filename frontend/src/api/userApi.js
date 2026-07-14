import axiosClient from './axiosClient';

const userApi = {
  getAll: (status) => {
    const params = status && status !== 'all' ? { status } : {};
    return axiosClient.get('/users', { params });
  },
  getById: (id) => axiosClient.get(`/users/${id}`),
  updateStatus: (id, status) => axiosClient.patch(`/users/${id}/status`, { status }),
};

export default userApi;