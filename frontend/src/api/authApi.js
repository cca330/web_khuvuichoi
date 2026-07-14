import axiosClient from './axiosClient';

const authApi = {
  login: (username, password) => {
    return axiosClient.post('/auth/login', { username, password });
  },
  register: (username, password, email) => {
    return axiosClient.post('/auth/register', { username, password, email });
  },
  forgotPassword: (username, email) => {
    return axiosClient.post('/auth/forgot-password', { username, email });
  },
  resetPassword: (resetToken, newPassword) => {
    return axiosClient.post('/auth/reset-password', { resetToken, newPassword });
  },
};

export default authApi;