import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRegisterMutation } from '@/api/auth.api';
import { useAppDispatch } from '@/app/hook';
import { setOtpEmail } from '@/features/auth/authSlice';
import { 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft, 
  Shield,
  Sparkles,
  Zap,
  Users,
  Trophy,
  TrendingUp
} from 'lucide-react';

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

  const renderFieldError = (fieldName: keyof typeof validationErrors) => {
    return validationErrors[fieldName] ? (
      <p className="text-red-400 text-sm mt-2 flex items-center gap-1.5">
        <AlertCircle className="h-4 w-4" />
        {validationErrors[fieldName]}
      </p>
    ) : null;
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
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-48 -right-48 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, 80, 0],
            y: [0, -100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -left-48 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Side - Register Form */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-md mx-auto lg:mx-0 order-2 lg:order-1"
            >
              <div className="relative">
                {/* Glow effect behind card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 lg:p-10">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Create Account
                      </h2>
                      <Link 
                        to="/login" 
                        className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors"
                      >
                        Sign In
                      </Link>
                    </div>
                    <p className="text-slate-400 text-sm">Start your journey today</p>
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
                    {/* Name field */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                        Full Name
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border ${
                            validationErrors.name 
                              ? 'border-red-500/50 focus:border-red-500' 
                              : 'border-slate-700/50 focus:border-cyan-500'
                          } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                          placeholder="John Doe"
                          disabled={isLoading}
                        />
                      </div>
                      {renderFieldError('name')}
                    </div>

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
                      {renderFieldError('email')}
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
                      {renderFieldError('password')}
                      <p className="text-xs text-slate-500">Min 8 chars with uppercase, lowercase & number</p>
                    </div>

                    {/* Confirm Password field */}
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border ${
                            validationErrors.confirmPassword 
                              ? 'border-red-500/50 focus:border-red-500' 
                              : 'border-slate-700/50 focus:border-cyan-500'
                          } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                          placeholder="••••••••"
                          disabled={isLoading}
                        />
                      </div>
                      {renderFieldError('confirmPassword')}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-500 to-cyan-600 hover:from-violet-600 hover:to-cyan-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating account...
                          </span>
                        ) : (
                          'Create Account'
                        )}
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

            {/* Right Side - Branding & Features */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block space-y-12 order-1 lg:order-2"
            >
              {/* Logo and heading */}
              <div className="space-y-6">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-full backdrop-blur-sm"
                >
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  <span className="text-violet-300 font-medium text-sm tracking-wide">JOIN THE REVOLUTION</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="text-6xl lg:text-7xl font-bold leading-[1.1]"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  <span className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-transparent">
                    Transform
                  </span>
                  <br />
                  <span className="text-white">Your Business</span>
                  <br />
                  <span className="bg-gradient-to-r from-violet-400 to-cyan-500 bg-clip-text text-transparent">
                    Today
                  </span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="text-slate-400 text-lg leading-relaxed max-w-lg"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Join thousands of professionals who trust our platform for seamless 
                  appointment scheduling and queue management.
                </motion.p>
              </div>

              {/* Benefits list */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="space-y-4"
              >
                {[
                  { icon: Shield, title: 'OTP-Verified Security', desc: 'Bank-level encryption for all your data' },
                  { icon: Zap, title: 'Lightning Fast Setup', desc: 'Get started in under 60 seconds' },
                  { icon: Users, title: 'Team Collaboration', desc: 'Manage staff and schedules effortlessly' },
                  { icon: Trophy, title: 'Premium Support', desc: '24/7 dedicated customer assistance' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 + idx * 0.1 }}
                    className="group flex items-start gap-4 p-4 bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30 rounded-2xl hover:border-violet-500/30 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.2 }}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { value: '4.8k+', label: 'Happy Users' },
                  { value: '48s', label: 'Avg Signup' },
                  { value: '99.9%', label: 'Uptime' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.3 + idx * 0.1 }}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-5 text-center backdrop-blur-sm"
                  >
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Trust badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1.5 }}
                className="flex items-center gap-3 text-slate-400 text-sm"
              >
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span>Trusted by 2,400+ businesses worldwide</span>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Add Google Fonts */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>
    </div>
  );
};

export default Register;