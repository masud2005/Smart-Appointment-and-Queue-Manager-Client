import config from '@/config';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true, // This enables automatic cookie handling
});

// Helper to set or clear Authorization header + persist token
export const setAuthToken = (token: string | null | undefined) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      localStorage.setItem('access_token', token);
    } catch {
      /* ignore */
    }
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    try {
      localStorage.removeItem('access_token');
    } catch {
      /* ignore */
    }
  }
};

// Restore persisted token on app start
try {
  const persistedToken = localStorage.getItem('access_token');
  if (persistedToken) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${persistedToken}`;
  }
} catch {
  /* ignore */
}

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Ensure token is always set from localStorage if available
    const token = localStorage.getItem('access_token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },
  function onRejected(error) {
    // Handle 401 Unauthorized - clear auth state on token expiry
    if (error.response?.status === 401) {
      // Clear localStorage auth data
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      } catch {
        /* ignore */
      }
      
      // Clear axios auth header
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      // Only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && !currentPath.includes('/')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);