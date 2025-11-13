import API from './api';

const authService = {
  // Register
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (otp) => {
    const response = await API.post('/auth/verify-otp', { otp });
    return response.data;
  },

  // Resend OTP
  resendOTP: async () => {
    const response = await API.post('/auth/resend-otp');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await API.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await API.put(`/auth/reset-password/${token}`, { password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await API.put('/auth/update-profile', userData);
    return response.data;
  },

  // Update password
  updatePassword: async (passwords) => {
    const response = await API.put('/auth/update-password', passwords);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;