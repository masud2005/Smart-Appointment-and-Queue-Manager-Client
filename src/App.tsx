import { useEffect, useRef } from 'react';
import './App.css';
import AppRoutes from './routes/Routes';
import { useAppDispatch, useAppSelector } from './app/hook';
import { setCredentials, setInitialized, restoreAuthState } from './features/auth/authSlice';
import { axiosInstance } from './lib/axios';
import AuthErrorBoundary from './components/debug/AuthErrorBoundary';

function App() {
  const dispatch = useAppDispatch();
  const { isInitialized, user, token } = useAppSelector((state) => state.auth);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // If already initialized, don't run auth check again
    if (isInitialized) {
      return;
    }

    // First, try to restore auth state from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.id && userData.email) {
          // Restore from localStorage first
          dispatch(restoreAuthState());
          
          // Then verify with server
          const verifyAuth = async () => {
            try {
              if (abortControllerRef.current) {
                abortControllerRef.current.abort();
              }

              abortControllerRef.current = new AbortController();

              const response = await axiosInstance.get('/profile/me', {
                signal: abortControllerRef.current.signal,
              });

              if (response.data?.success && response.data?.data) {
                const serverUserData = response.data.data.user || response.data.data;
                
                // Update with fresh server data if different
                if (serverUserData.id && serverUserData.email) {
                  dispatch(setCredentials({
                    user: {
                      id: serverUserData.id,
                      name: serverUserData.name,
                      email: serverUserData.email,
                      isVerified: serverUserData.isVerified ?? false,
                    },
                  }));
                }
              }
            } catch (error) {
              // If server verification fails, keep localStorage data but mark as initialized
              if (!(error instanceof Error && error.name === 'AbortError')) {
                console.warn('Server verification failed, using cached auth state');
              }
            }
          };
          
          verifyAuth();
          return;
        }
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
      }
    }

    // If no valid stored auth, check with server
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
  }, [dispatch, isInitialized]);

  return (
    <AuthErrorBoundary>
      <AppRoutes />
    </AuthErrorBoundary>
  );
}

export default App;
