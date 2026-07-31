import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  // Ưu tiên đọc từ sessionStorage (admin) trước, không có thì đọc localStorage (user thường)
  const token =
    sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;