import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/app/hook';
import { logout } from '@/features/auth/authSlice';
import { useLogoutMutation } from '@/api/auth.api';

/**
 * Custom hook to handle user logout
 * Calls the logout API, clears Redux state, and redirects to login page
 * @returns Object with logout function and loading state
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      // Call logout API endpoint
      await logoutMutation().unwrap();

      // Clear auth state from Redux
      dispatch(logout());

      // Redirect to login page
      navigate('/login', { replace: true });
    } catch (error: any) {
      // Even if API call fails, clear local state and redirect
      console.error('Logout error:', error);
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [logoutMutation, dispatch, navigate]);

  return { logout: handleLogout, isLoading };
};
