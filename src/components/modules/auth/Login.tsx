import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLoginMutation } from '@/api/auth.api';
import { useAppDispatch } from '@/app/hook';
import { setCredentials } from '@/features/auth/authSlice';
import { Calendar, Mail, Lock, AlertCircle, Loader2, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';
import { 
  Shield,
  Zap,
  Users
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
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
      const response = await login(formData).unwrap();

      if (response.success && response.data) {
        setSuccess('Login successful! Redirecting...');

        const userData = response.data.user || response.data;
        const token =
          (response.data as any).access_token ||
          (response.data as any).token ||
          (response.data as any).accessToken ||
          null;

        dispatch(
          setCredentials({
            user: {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              isVerified: userData.isVerified,
            },
            token,
          })
        );

        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setSuccess('');

    const demoCredentials = {
      email: 'masud.softvenceomega@gmail.com',
      password: 'Masud12@',
    };

    try {
      const response = await login(demoCredentials).unwrap();

      if (response.success && response.data) {
        setSuccess('Demo login successful! Redirecting...');

        const userData = response.data.user || response.data;
        const token =
          (response.data as any).access_token ||
          (response.data as any).token ||
          (response.data as any).accessToken ||
          null;

        dispatch(
          setCredentials({
            user: {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              isVerified: userData.isVerified,
            },
            token,
          })
        );

        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1200);
      }
    } catch (err: any) {
      setError('Demo login failed. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
        
        {/* Gradient orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-48 -left-48 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Side - Branding & Features */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block space-y-12"
            >
              {/* Logo and heading */}
              <div className="space-y-6">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full backdrop-blur-sm"
                >
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  <span className="text-cyan-300 font-medium text-sm tracking-wide">SMART QUEUE SYSTEM</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="text-6xl lg:text-7xl font-bold leading-[1.1]"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                    Appointment
                  </span>
                  <br />
                  <span className="text-white">Management</span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Simplified
                  </span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="text-slate-400 text-lg leading-relaxed max-w-lg"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Transform your workflow with intelligent queue management. 
                  Real-time insights, seamless scheduling, and enterprise-grade security.
                </motion.p>
              </div>

              {/* Feature cards */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: Shield, label: 'JWT + OTP Auth', value: '99.9%', metric: 'Secure' },
                  { icon: Zap, label: 'Fast Response', value: '1.8s', metric: 'Avg Time' },
                  { icon: Users, label: 'Active Users', value: '2.4k+', metric: 'Daily' },
                  { icon: Calendar, label: 'Appointments', value: '15k+', metric: 'Monthly' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 + idx * 0.1 }}
                    className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 rounded-2xl transition-all duration-300" />
                    <div className="relative">
                      <item.icon className="h-8 w-8 text-cyan-400 mb-3" />
                      <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1.2 }}
                className="flex items-center gap-8 pt-4"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-slate-900" />
                    ))}
                  </div>
                  <span className="text-slate-400 text-sm ml-2">2,400+ teams</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <span className="text-slate-400 text-sm ml-2">4.9/5</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-md mx-auto lg:mx-0"
            >
              <div className="relative">
                {/* Glow effect behind card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 lg:p-10">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Welcome Back
                      </h2>
                      <Link 
                        to="/register" 
                        className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                    <p className="text-slate-400 text-sm">Sign in to access your dashboard</p>
                  </div>

                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-start gap-3"
                    >
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <span className="text-sm">{error}</span>
                    </motion.div>
                  )}

                  {/* Success message */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                      <span className="text-sm">{success}</span>
                    </motion.div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email field */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border ${
                            validationErrors.email 
                              ? 'border-red-500/50 focus:border-red-500' 
                              : 'border-slate-700/50 focus:border-cyan-500'
                          } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                          placeholder="you@example.com"
                          disabled={isLoading}
                        />
                      </div>
                      {validationErrors.email && (
                        <p className="text-red-400 text-sm flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4" />
                          {validationErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Password field */}
                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border ${
                            validationErrors.password 
                              ? 'border-red-500/50 focus:border-red-500' 
                              : 'border-slate-700/50 focus:border-cyan-500'
                          } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                          placeholder="••••••••"
                          disabled={isLoading}
                        />
                      </div>
                      {validationErrors.password && (
                        <p className="text-red-400 text-sm flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4" />
                          {validationErrors.password}
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Signing in...
                          </span>
                        ) : (
                          'Sign In'
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 hover:border-cyan-500/30 text-slate-300 hover:text-white py-3.5 rounded-xl transition-all duration-300"
                        onClick={handleDemoLogin}
                        disabled={isLoading}
                      >
                        Try Demo Account
                      </Button>
                    </div>
                  </form>

                  {/* Footer link */}
                  <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                    <Link
                      to="/"
                      className="text-sm text-slate-400 hover:text-cyan-400 inline-flex items-center gap-2 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Add Google Fonts */}
      {/* <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style> */}
    </div>
  );
};

export default Login;