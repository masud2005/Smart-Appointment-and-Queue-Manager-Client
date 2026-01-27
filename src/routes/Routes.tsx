import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppSelector } from '@/app/hook';
import LandingPage from '@/components/modules/auth/LandingPage';
import Login from '@/components/modules/auth/Login';
import Register from '@/components/modules/auth/Register';
import OtpVerification from '@/components/modules/auth/OtpVerification';
import Dashboard from '@/components/modules/dashboard/Dashboard';
import ServicePage from '@/components/modules/service/ServicePage';
import StaffPage from '@/components/modules/staff/StaffPage';
import AppointmentPage from '@/components/modules/appoinment/AppointmentPage';
import QueuePage from '@/components/modules/queue/QueuePage';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="inline-block">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
      <p className="mt-6 text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Protected Route Component - for authenticated users only
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  // Wait for auth check to complete before redirecting
  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Guest Route Component - for unauthenticated users only
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  // Wait for auth check to complete before redirecting
  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest Only Routes - Accessible only when not logged in */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* OTP Verification Route - Accessible only when not logged in */}
        <Route
          path="/verify-otp"
          element={
            <GuestRoute>
              <OtpVerification />
            </GuestRoute>
          }
        />

        {/* Protected Routes - Accessible only when logged in */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="services" element={<ServicePage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="appointments" element={<AppointmentPage />} />
          <Route path="queue" element={<QueuePage />} />
        </Route>

        {/* Catch all - redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
