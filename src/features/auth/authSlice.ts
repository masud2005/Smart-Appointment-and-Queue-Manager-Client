import { createSlice } from '@reduxjs/toolkit';
import { setAuthToken } from '@/lib/axios';

interface User {
  id: string;
  name: string | null;
  email: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean; 
  otpEmail: string | null;
}

// Load user from localStorage if available
const loadUserFromStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

// Load token from localStorage
const loadTokenFromStorage = (): string | null => {
  try {
    return localStorage.getItem('access_token');
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  token: loadTokenFromStorage(),
  isLoading: false,
  isInitialized: false,
  otpEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: { payload: { user: User; token?: string | null } }) => {
      state.user = action.payload.user;
      state.token = action.payload.token ?? state.token ?? null;
      state.isInitialized = true;

      // Persist user to localStorage
      try {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      } catch (error) {
        console.error('Failed to save user to localStorage:', error);
      }

      // Persist token and set header if provided
      if (action.payload.token) {
        setAuthToken(action.payload.token);
      } else if (state.token) {
        // If no new token provided but we have existing token, ensure it's set
        setAuthToken(state.token);
      }
    },
    setOtpEmail: (state, action: { payload: string }) => {
      state.otpEmail = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.otpEmail = null;
      state.isInitialized = true;
      // Clear user and token from storage
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      } catch (error) {
        console.error('Failed to remove user from localStorage:', error);
      }

      // Clear Authorization header
      setAuthToken(null);
    },
    setLoading: (state, action: { payload: boolean }) => {
      state.isLoading = action.payload;
    },
    setInitialized: (state, action: { payload: boolean }) => {
      state.isInitialized = action.payload;
    },
    // New action to restore auth state from localStorage
    restoreAuthState: (state) => {
      const storedUser = loadUserFromStorage();
      const storedToken = loadTokenFromStorage();
      
      if (storedUser && storedToken) {
        state.user = storedUser;
        state.token = storedToken;
        setAuthToken(storedToken);
      }
      state.isInitialized = true;
    },
  },
});

export const { setCredentials, setOtpEmail, logout, setLoading, setInitialized, restoreAuthState } = authSlice.actions;
export default authSlice.reducer;
