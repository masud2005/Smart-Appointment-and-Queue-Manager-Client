import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { useVerifyOtpMutation, useResendOtpMutation } from '@/api/auth.api';
import { useAppDispatch } from '@/app/hook';
import { setCredentials } from '@/features/auth/authSlice';
import { AlertCircle, Loader2, Mail, CheckCircle2 } from 'lucide-react';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [otpSent, setOtpSent] = useState(true);
  const email = location.state?.email || '';

  // Validate email on mount
  useEffect(() => {
    if (!email) {
      setError('Email not found. Please register again.');
    }
  }, [email]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || !otpSent) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, otpSent]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const validateOtp = (): boolean => {
    if (!otp) {
      setError('Please enter the OTP code');
      return false;
    }
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return false;
    }
    if (!/^\d+$/.test(otp)) {
      setError('OTP must contain only numbers');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    if (!validateOtp()) {
      return;
    }

    try {
      const response = await verifyOtp({
        email,
        otp,
      }).unwrap();

      if (response.success && response.data) {
        setSuccess('Email verified successfully! Redirecting to dashboard...');

        // Backend returns user data directly in data object, not nested in data.user
        const userData = response.data.user || response.data;

        // Capture access token if provided
        const token = response.data.access_token || response.data.token || response.data.accessToken || userData?.access_token || userData?.token || userData?.accessToken || null;
        
        // Dispatch credentials synchronously
        dispatch(setCredentials({
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            isVerified: userData.isVerified,
          },
          token,
        }));

        // Navigate immediately with replace to prevent back navigation
        navigate('/dashboard', { replace: true });
      } else {
        setError('OTP verification failed. Invalid response from server.');
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || 'OTP verification failed. Please try again.';
      setError(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    try {
      await resendOtp({ email }).unwrap();
      setOtp('');
      setTimeLeft(300);
      setOtpSent(true);
      setError('');
      setSuccess('OTP has been resent to your email');

      // Clear success message after 4 seconds
      setTimeout(() => {
        setSuccess('');
      }, 4000);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
    }
  };

  const canResendOtp = timeLeft <= 60 && !isResending;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
              <Mail className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            Enter the 6-digit code sent to <br />
            <span className="font-semibold text-gray-900">{email}</span>
          </p>
        </div>

        {/* OTP Verification Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* OTP Input */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                  setError('');
                }}
                placeholder="000000"
                className="w-full px-4 py-4 text-2xl text-center tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono transition"
                disabled={isVerifying}
              />
            </div>

            {/* Timer */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Code expires in:{' '}
                <span
                  className={`font-semibold ${
                    timeLeft < 60 ? 'text-red-600' : 'text-indigo-600'
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold"
              disabled={isVerifying || !otp}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
          </form>

          {/* Resend OTP */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResendOtp}
                className="text-indigo-600 font-semibold hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            </p>
            {timeLeft > 60 && (
              <p className="text-xs text-gray-500 mt-2">
                You can resend OTP in {formatTime(timeLeft - 60)}
              </p>
            )}
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
