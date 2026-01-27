import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRegisterMutation } from '@/api/auth.api';
import { useAppDispatch } from '@/app/hook';
import { setOtpEmail } from '@/features/auth/authSlice';
import { Calendar, Mail, Lock, User, AlertCircle, Loader2, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase & number';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      }).unwrap();

      if (response.success) {
        setSuccess('Registration successful! Redirecting to OTP...');
        dispatch(setOtpEmail(formData.email.trim()));

        setTimeout(() => {
          navigate('/verify-otp', {
            replace: true,
            state: { email: formData.email.trim() },
          });
        }, 1500);
      }
    } catch (err: any) {
      setError(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    // Demo login from Register page also redirects to dashboard
    const demoCredentials = {
      email: 'masud.softvenceomega@gmail.com',
      password: 'Masud12@',
    };

    try {
      // We can call login mutation here if you want demo from register too
      // But for simplicity, just redirect with message
      setSuccess('Demo account selected! Redirecting...');
      setTimeout(() => {
        navigate('/login'); // or directly login with demo creds if you want
      }, 1500);
    } catch {
      setError('Something went wrong with demo login.');
    }
  };

  const renderFieldError = (fieldName: keyof typeof validationErrors) => {
    return validationErrors[fieldName] ? (
      <p className="text-red-600 text-sm mt-2 flex items-center">
        <AlertCircle className="h-4 w-4 mr-1.5" />
        {validationErrors[fieldName]}
      </p>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1fcfc] via-white to-[#e6f7f5] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-0 w-64 h-64 bg-teal-200/40 blur-3xl rounded-full" />
        <div className="absolute right-0 top-10 w-72 h-72 bg-emerald-200/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 left-12 w-80 h-80 bg-cyan-200/25 blur-3xl rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left - Register Form (opposite side) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white/95 backdrop-blur-lg border border-white/60 shadow-2xl rounded-3xl p-8 lg:p-10 order-2 lg:order-1"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-slate-500">Start your journey</p>
                <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
              </div>
              <Link to="/login" className="text-teal-600 font-medium hover:text-teal-700 transition">
                Already a member?
              </Link>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl flex items-start gap-3"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-sm">{success}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-5 py-3.5 border rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white/80 ${
                      validationErrors.name ? 'border-red-400' : 'border-slate-200'
                    }`}
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>
                {renderFieldError('name')}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-5 py-3.5 border rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white/80 ${
                      validationErrors.email ? 'border-red-400' : 'border-slate-200'
                    }`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
                {renderFieldError('email')}
              </div>

              {/* Password & Confirm */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-5 py-3.5 border rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white/80 ${
                        validationErrors.password ? 'border-red-400' : 'border-slate-200'
                      }`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                  {renderFieldError('password')}
                  <p className="text-xs text-slate-500 mt-2">Min 8 chars with uppercase, lowercase & number</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-5 py-3.5 border rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white/80 ${
                        validationErrors.confirmPassword ? 'border-red-400' : 'border-slate-200'
                      }`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                  {renderFieldError('confirmPassword')}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-2xl shadow-md hover:shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50 py-3 rounded-2xl transition-all"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  Try Demo Account
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <Link
                to="/"
                className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Home
              </Link>
            </div>
          </motion.div>

          {/* Right - Promotional Section (opposite side) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hidden lg:block bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 text-white rounded-3xl shadow-2xl p-10 lg:p-12 relative overflow-hidden order-1 lg:order-2"
          >
            <div className="absolute right-8 top-8 bg-white/20 rounded-full p-4">
              <Shield className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 p-4 rounded-2xl shadow-lg">
                <Calendar className="h-10 w-10" />
              </div>
              <div>
                <p className="text-white/80 text-base">Smart Appointment</p>
                <h3 className="text-2xl font-semibold">Queue & Schedule Manager</h3>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Join now and take control of your schedule
            </h1>
            <p className="text-white/85 mb-8 text-lg">
              Perfect for clinics, salons, consultants — manage everything from one powerful dashboard.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'OTP-verified secure registration',
                'Staff scheduling & queue management',
                'Beautiful UI + real-time updates',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-white/25 p-1.5">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-base text-white/95">{item}</span>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/15 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-sm text-white/80">Avg. signup time</p>
                <p className="text-3xl font-bold">48s</p>
              </div>
              <div className="bg-white/15 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-sm text-white/80">Happy customers</p>
                <p className="text-3xl font-bold">4.8k+</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;