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
    // Cookies are automatically sent by the browser with withCredentials: true
    // No need to manually set token from localStorage
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
    // Handle 401 Unauthorized - let screens handle without forcing redirect
    // This prevents login/dashboard ping-pong if the backend session expires
    if (error.response?.status === 401) {
      // Do nothing here; components/guards decide what to do
    }
    return Promise.reject(error);
  }
);