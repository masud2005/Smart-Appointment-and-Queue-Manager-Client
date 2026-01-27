import { useAppSelector } from '@/app/hook';
import { useGetCurrentUserQuery } from '@/api/auth.api';

/**
 * Hook to check if user is authenticated on app initialization
 * This hook ensures that user authentication state persists across page refreshes
 * @deprecated Use the App.tsx auth check instead. This is kept for reference only.
 */
export const useAuthPersistence = () => {
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  useGetCurrentUserQuery(undefined, {
    skip: isInitialized || !!user, // Skip if already initialized or user exists
  });
};

