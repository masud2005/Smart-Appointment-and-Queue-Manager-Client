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
    if (user && !isInitialized) {
      dispatch(setInitialized(true));
      return;
    }

    if (isInitialized) {
      return;
    }

    const checkAuth = async () => {
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const response = await axiosInstance.get('/profile/me', {
          signal: abortControllerRef.current.signal,
        });

        if (response.data?.success && response.data?.data) {
          const userData = response.data.data.user || response.data.data;
          
          if (userData.id && userData.email) {
            dispatch(setCredentials({
              user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                isVerified: userData.isVerified ?? false,
              },
            }));
          } else {
            dispatch(setInitialized(true));
          }
        } else {
          dispatch(setInitialized(true));
        }
      } catch (error) {
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
