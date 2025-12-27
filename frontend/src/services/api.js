import axios from "axios";

/**
 * =========================
 * API BASE URL (VITE SAFE)
 * =========================
 */
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * =========================
 * AXIOS INSTANCE
 * =========================
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * =========================
 * REQUEST INTERCEPTOR
 * Attach JWT token
 * =========================
 */
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

/**
 * =========================
 * RESPONSE INTERCEPTOR
 * Handle auth errors
 * =========================
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Let App.jsx handle redirect via auth state
    }
    return Promise.reject(error);
  }
);

/* =========================
   AUTH API
========================= */
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getCurrentUser: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data)
};

/* =========================
   ENVIRONMENTAL API
========================= */
export const environmentalAPI = {
  getCurrent: () => api.get("/environmental/current"),
  getHistorical: (days = 7) =>
    api.get(`/environmental/historical?days=${days}`),
  getForecast: () => api.get("/environmental/forecast"),
  getAnalytics: (days = 30) =>
    api.get(`/environmental/analytics?days=${days}`)
};

/* =========================
   ALERT API
========================= */
export const alertAPI = {
  getAlerts: (params = {}) => api.get("/alerts", { params }),
  markAsRead: (alertId) => api.put(`/alerts/${alertId}/read`),
  markAllAsRead: () => api.put("/alerts/read-all"),
  dismissAlert: (alertId) => api.delete(`/alerts/${alertId}`),
  getStats: (days = 30) =>
    api.get(`/alerts/stats?days=${days}`)
};

/* =========================
   ADDITIONAL SERVICES
========================= */

export const symptomService = {
  saveSymptoms: (symptomData) => api.post("/symptoms", symptomData),
  getLatest: () => api.get("/symptoms/latest")
};

export const fashionService = {
  getRecommendations: () => api.get("/fashion/recommendations"),
  saveRecommendation: (data) => api.post("/fashion/save", data)
};

export const bodyProfileService = {
  createProfile: (data) => api.post("/body-profile", data),
  getProfile: () => api.get("/body-profile")
};

export default api;
