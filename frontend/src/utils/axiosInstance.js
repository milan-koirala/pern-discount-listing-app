import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // needed so cookies (httpOnly JWT) are included
});

// Optional: if you ever also keep a token in localStorage, send it too.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // optional
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
