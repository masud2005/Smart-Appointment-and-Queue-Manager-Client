import { useEffect, useRef } from 'react';
import './App.css';
import AppRoutes from './routes/Routes';
import { useAppDispatch, useAppSelector } from './app/hook';
import { setCredentials, setInitialized } from './features/auth/authSlice';
import { axiosInstance } from './lib/axios';
import AuthErrorBoundary from './components/debug/AuthErrorBoundary';

function App() {
  const dispatch = useAppDispatch();
  const { isInitialized, user } = useAppSelector((state) => state.auth);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // If user exists (from localStorage), mark as initialized and skip auth check
    if (user && !isInitialized) {
      dispatch(setInitialized(true));
      return;
    }

    // Don't check auth if already initialized
    if (isInitialized) {
      return;
    }

    const checkAuth = async () => {
      try {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        // Call profile/me endpoint to verify if user is authenticated via cookies
        const response = await axiosInstance.get('/profile/me', {
          signal: abortControllerRef.current.signal,
        });

        // Backend returns user data in response.data.data
        if (response.data?.success && response.data?.data) {
          // Handle both nested user object and direct user data
          const userData = response.data.data.user || response.data.data;
          
          // Only dispatch if we have valid user data with required fields
          if (userData.id && userData.email) {
            dispatch(setCredentials({
              user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                isVerified: userData.isVerified ?? false,
              },
              // Profile/me typically doesn't return token; keep existing
            }));
          } else {
            dispatch(setInitialized(true));
          }
        } else {
          dispatch(setInitialized(true));
        }
      } catch (error) {
        // User is not authenticated or session expired (ignore AbortError)
        if (!(error instanceof Error && error.name === 'AbortError')) {
          dispatch(setInitialized(true));
        }
      }
    };

    checkAuth();

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [dispatch, isInitialized, user]);

  return (
    <AuthErrorBoundary>
      <AppRoutes />
    </AuthErrorBoundary>
  );
}

export default App;
