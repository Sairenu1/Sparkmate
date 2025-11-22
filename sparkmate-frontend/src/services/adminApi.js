import api from './api';

export const adminApi = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all users
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Ban user
  banUser: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/ban`);
    return response;
  },

  // Unban user
  unbanUser: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/unban`);
    return response;
  },

  // Get all reports
  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },

  // Get pending reports
  getPendingReports: async () => {
    const response = await api.get('/admin/reports/pending');
    return response.data;
  },

  // Resolve report
  resolveReport: async (reportId) => {
    const response = await api.post(`/admin/reports/${reportId}/resolve`);
    return response;
  },

  // Dismiss report
  dismissReport: async (reportId) => {
    const response = await api.post(`/admin/reports/${reportId}/dismiss`);
    return response;
  },
};

