import axios from "axios";

// Detect API base URL: Use VITE_API_URL in production or default to localhost in development
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
  }
  return "http://localhost:5000";
};

export const API_BASE_URL = getBaseURL();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s timeout to gracefully allow Render free-tier instance wakeups
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Automatically attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Friendly error logging and handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED" || error.message?.includes("Network Error")) {
      console.warn("⚠️ API timeout/network issue. If on Render free tier, backend may take 30-50s to wake up from idle.");
    }
    return Promise.reject(error);
  }
);

export default api;
