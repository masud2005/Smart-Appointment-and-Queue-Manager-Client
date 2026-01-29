// Auth utility functions for better state management

export const clearAuthStorage = () => {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  } catch (error) {
    console.error('Failed to clear auth storage:', error);
  }
};

export const getStoredAuthData = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  } catch (error) {
    console.error('Failed to get stored auth data:', error);
    return { user: null, token: null };
  }
};

export const isValidAuthData = (user: any, token: string | null) => {
  return user && token && user.id && user.email;
};