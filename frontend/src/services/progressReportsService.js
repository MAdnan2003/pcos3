// frontend/src/services/progressReportsService.js
import axios from 'axios';

// ✅ Vite uses import.meta.env, NOT process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get progress reports based on time range
export const getProgressReports = async (timeRange = '30') => {
  try {
    const response = await api.get('/progress-reports', {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching progress reports:', error);
    throw error.response?.data || error;
  }
};

// Export report as PDF
export const exportReport = async (timeRange = '30') => {
  try {
    const response = await api.get('/progress-reports/export', {
      params: { timeRange },
      responseType: 'blob'
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `progress-report-${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    console.error('Error exporting report:', error);
    throw error.response?.data || error;
  }
};

// Get specific metric data
export const getMetricData = async (metricType, timeRange = '30') => {
  try {
    const response = await api.get(`/progress-reports/metric/${metricType}`, {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${metricType} data:`, error);
    throw error.response?.data || error;
  }
};

export default {
  getProgressReports,
  exportReport,
  getMetricData,
};
