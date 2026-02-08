import { useAppSelector } from '@/app/hook';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  ArrowRightLeft,
  Calendar,
  CheckCircle,
  ChevronDown,
  History as HistoryIcon,
  LayoutDashboard,
  ListOrdered,
  Menu,
  MinusCircle,
  MonitorSmartphone,
  ShieldAlert,
  Sparkles,
  Star,
  UserCog,
  Users,
  X,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

const LandingPage = () => {
  const { isInitialized } = useAppSelector((state) => state.auth);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e27]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white selection:bg-cyan-500/20 overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-1/4 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
        />
      </div>

      {/* --- 1. Navigation --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-cyan-500/25">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              SmartFlow <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">HQ</span>
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#logic" className="hover:text-cyan-400 transition">Engine</a>
            <a href="#logs" className="hover:text-cyan-400 transition">Activity</a>
            <a href="#faq" className="hover:text-cyan-400 transition">FAQ</a>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3 sm:gap-4">
            {/* <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-cyan-400 transition hidden md:block">
              Demo Login
            </Link> */}
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl px-4 sm:px-6 text-sm sm:text-base h-9 sm:h-10 shadow-lg shadow-cyan-500/25">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-slate-800/50 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden border-t border-slate-800/50 bg-slate-900/95 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 py-4 space-y-3">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition font-medium"
                >
                  Features
                </a>
                <a
                  href="#logic"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition font-medium"
                >
                  Engine
                </a>
                <a
                  href="#logs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition font-medium"
                >
                  Activity
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition font-medium"
                >
                  FAQ
                </a>
                <div className="pt-3 border-t border-slate-800/50 space-y-2">
                  {/* <Link
                    to="/login"
                    className="block py-3 px-4 text-center rounded-lg border border-slate-700 hover:bg-slate-800/50 transition font-semibold"
                  >
                    Demo Login
                  </Link> */}
                  <Link
                    to="/register"
                    className="block py-3 px-4 text-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition font-semibold shadow-lg shadow-cyan-500/25"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- 2. Hero Section --- */}
      <header className="relative pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 sm:mb-8 backdrop-blur-sm"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" /> AI-Powered Technology
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] mb-6 sm:mb-8" style={{ fontFamily: "'Sora', sans-serif" }}>
                Never Lose a{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Customer
                </span>
                <br />
                to Wait Times
              </h1>

              <p className="text-base sm:text-lg text-slate-400 mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0">
                Intelligent appointment engine that handles staff capacity, detects scheduling conflicts,
                and manages virtual waiting queues automatically.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center lg:justify-start px-4 sm:px-0">
                <Link to={"/register"} className="h-12 flex items-center sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl text-base sm:text-lg font-semibold shadow-xl shadow-cyan-500/25 w-full sm:w-auto text-center justify-center">
                  Start Managing Free
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                <Link to={"/login"} className="h-12 flex items-center sm:h-14 px-6 sm:px-8 border-slate-700 hover:bg-slate-800/50 rounded-xl text-base sm:text-lg font-semibold w-full sm:w-auto bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 transition text-center justify-center">
                  Watch Demo
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-slate-900 flex items-center justify-center text-xs font-bold">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-slate-400 text-xs sm:text-sm">Trusted by</p>
                    <p className="text-white font-bold text-sm sm:text-base">500+ Businesses</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-slate-400 text-xs sm:text-sm ml-2">4.9/5 Rating</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl sm:rounded-3xl blur-2xl" />

                {/* Dashboard card */}
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h4 className="font-bold flex items-center gap-2 text-white text-sm sm:text-base">
                      <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                      Staff Load Today
                    </h4>
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-xs bg-red-500/20 border border-red-500/30 text-red-400 px-2 sm:px-3 py-1 rounded-full font-bold"
                    >
                      ● Live
                    </motion.span>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="p-3 sm:p-4 md:p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          DF
                        </div>
                        <span className="font-semibold text-white text-sm sm:text-base">Dr. Farhan</span>
                      </div>
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg whitespace-nowrap">
                        5 / 5
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="p-3 sm:p-4 md:p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          NR
                        </div>
                        <span className="font-semibold text-white text-sm sm:text-base">Nurse Riya</span>
                      </div>
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg whitespace-nowrap">
                        3 / 5
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl text-center shadow-lg"
                    >
                      <p className="text-xs text-cyan-100 uppercase tracking-widest font-bold mb-1 sm:mb-2">
                        In Waiting Queue
                      </p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white">04 Patients</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* --- 3. Core Features --- */}
      <section id="features" className="relative py-10 sm:py-16 md:py-24 bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                The Logic-Driven{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Engine
                </span>
              </h2>
              <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Built to follow your business rules, ensuring efficiency and zero booking errors.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: ShieldAlert,
                title: 'Conflict Detection',
                description: 'System instantly warns if a staff member is booked at the chosen time slot. No more double-booking headaches.',
                color: 'from-red-500/10 to-orange-500/10',
                borderColor: 'border-red-500/20',
                iconColor: 'text-red-400'
              },
              {
                icon: ListOrdered,
                title: 'Smart Queueing',
                description: 'When staff reach capacity, appointments move to a chronologically ordered queue for instant assignment.',
                color: 'from-cyan-500/10 to-blue-500/10',
                borderColor: 'border-cyan-500/20',
                iconColor: 'text-cyan-400'
              },
              {
                icon: Users,
                title: 'Capacity Limits',
                description: 'Set custom daily limits per staff member. Real-time load summary keeps your team balanced.',
                color: 'from-violet-500/10 to-purple-500/10',
                borderColor: 'border-violet-500/20',
                iconColor: 'text-violet-400'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative bg-gradient-to-br ${feature.color} backdrop-blur-sm border ${feature.borderColor} rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-cyan-500/40 transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 rounded-2xl sm:rounded-3xl transition-all duration-300" />
                <div className="relative">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-slate-900/50 ${feature.iconColor} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. Logic Deep Dive --- */}
      <section id="logic" className="relative py-16 sm:py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                Smart Logic that{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Prevents Chaos
                </span>
              </h2>

              <div className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
                {[
                  {
                    icon: AlertTriangle,
                    title: 'Instant Conflict Warning',
                    subtitle: '"This staff member already has an appointment at this time."',
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-500/20',
                    iconColor: 'text-red-400'
                  },
                  {
                    icon: MinusCircle,
                    title: 'Capacity Lockdown',
                    subtitle: '"Farhan already has 5 appointments today."',
                    bgColor: 'bg-orange-500/10',
                    borderColor: 'border-orange-500/20',
                    iconColor: 'text-orange-400'
                  },
                  {
                    icon: CheckCircle,
                    title: 'Auto-Assignment Success',
                    subtitle: '"Patient moved from queue to available staff."',
                    bgColor: 'bg-emerald-500/10',
                    borderColor: 'border-emerald-500/20',
                    iconColor: 'text-emerald-400'
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex gap-3 sm:gap-5 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${item.bgColor} border ${item.borderColor} backdrop-blur-sm`}
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-slate-900/50 flex items-center justify-center ${item.iconColor} shrink-0`}>
                      <item.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-base sm:text-lg text-white mb-1 sm:mb-2">{item.title}</h4>
                      <p className="text-slate-400 text-xs sm:text-sm italic break-words">{item.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl sm:rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl">
                <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-l-4 border-red-500 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                    <span className="font-bold text-xs uppercase tracking-widest text-red-400">
                      Action Blocked
                    </span>
                  </div>
                  <p className="font-bold text-lg sm:text-xl text-white mb-2 sm:mb-3">
                    Booking Overlap Detected
                  </p>
                  <p className="text-sm text-slate-400 mb-4 sm:mb-6">
                    Pick another staff or change time to proceed.
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${i <= 3 ? 'bg-red-500' : 'bg-slate-700'}`}
                      />
                    ))}
                  </div>
                </div>
                <Sparkles className="absolute top-4 right-4 sm:top-6 sm:right-6 text-cyan-500/10 w-24 h-24 sm:w-32 sm:h-32" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 5. Activity Log Stream --- */}
      <section id="logs" className="relative py-16 sm:py-24 md:py-32 bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative">
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl sm:rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-8 sm:mb-12">
                  <div className="p-3 sm:p-5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl sm:rounded-2xl">
                    <HistoryIcon className="text-cyan-400 w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                      Live Activity Log
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                      Trace every queue movement and staff assignment instantly.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {[
                    { time: "11:45 AM", text: "Appointment for 'John Doe' auto-assigned to Riya.", icon: ArrowRightLeft, color: 'cyan' },
                    { time: "12:10 PM", text: "Appointment moved from queue to Farhan.", icon: UserCog, color: 'blue' },
                    { time: "01:30 PM", text: "Staff capacity limit reached for 'Dr. Sarah'.", icon: AlertTriangle, color: 'orange' }
                  ].map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-slate-900/50 border border-slate-700/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:border-cyan-500/30 transition-all group"
                    >
                      <span className={`text-xs font-bold bg-${log.color}-500/10 border border-${log.color}-500/20 text-${log.color}-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shrink-0 inline-block`}>
                        {log.time}
                      </span>
                      <p className="text-sm font-medium text-slate-300 flex-1 break-words">
                        {log.text}
                      </p>
                      <log.icon className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 hidden sm:block" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 6. Comparison Section --- */}
      <section className="relative py-16 sm:py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-tight px-4" style={{ fontFamily: "'Sora', sans-serif" }}>
              Why SmartQueue{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Pro?
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg px-4">
              The difference between organized growth and daily chaos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid md:grid-cols-2 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl">
              <div className="p-6 sm:p-8 md:p-12 bg-slate-900/50 md:border-r border-b md:border-b-0 border-slate-700/50">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-10 text-slate-500">Traditional Booking</h3>
                <ul className="space-y-4 sm:space-y-6">
                  {[
                    'High risk of double-booking',
                    'Overworked staff members (No limits)',
                    'No trail of changes or assignments',
                    'Manual queue management'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 sm:gap-4 text-slate-400 font-medium text-sm sm:text-base">
                      <MinusCircle className="text-red-400/50 w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 sm:p-8 md:p-12 bg-gradient-to-br from-slate-800 to-slate-900">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-10 text-cyan-400">SmartQueue Pro</h3>
                <ul className="space-y-4 sm:space-y-6">
                  {[
                    'Automated Conflict Detection',
                    'Staff Load Balance (Max 5/day)',
                    'One-click Queue-to-Staff Engine',
                    'Real-time Activity Tracking'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 sm:gap-4 text-white font-medium text-sm sm:text-base">
                      <CheckCircle className="text-cyan-400 w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 7. Multi-Device Section --- */}
      <section className="relative py-16 sm:py-24 md:py-32  bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <MonitorSmartphone className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-8 sm:mb-10 text-cyan-200" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 italic tracking-tight px-4" style={{ fontFamily: "'Sora', sans-serif" }}>
              Manage Anywhere.
              <br />
              Any Device.
            </h2>
            <p className="text-cyan-100 max-w-2xl mx-auto text-base sm:text-lg md:text-xl mb-10 sm:mb-14 leading-relaxed px-4">
              Fully responsive web interface. Manage appointments from your desktop or
              track staff load on the go with your smartphone.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 text-cyan-200/60 font-bold tracking-widest text-xs sm:text-sm">
              <span className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-cyan-200 rounded-full" />
                MOBILE FRIENDLY
              </span>
              <span className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-cyan-200 rounded-full" />
                TABLET OPTIMIZED
              </span>
              <span className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-cyan-200 rounded-full" />
                DESKTOP POWER
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 8. FAQ Section --- */}
      <section id="faq" className="relative py-16 sm:py-24 md:py-32 bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4" style={{ fontFamily: "'Sora', sans-serif" }}>
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            {[
              {
                q: "How does the waiting queue work?",
                a: "When all staff reach their daily capacity (e.g., 5/5), new appointments move to the Waiting Queue. You can assign them manually as staff becomes available."
              },
              {
                q: "Can I customize staff services?",
                a: "Yes. You can manually create staff profiles, define their Service Type (Doctor, Consultant, etc.), and set their availability status."
              },
              {
                q: "Does it detect overlaps?",
                a: "Absolutely. If you try to book the same staff for two appointments at the same time, the system will block the action and show a warning."
              },
              {
                q: "Is there a mobile app?",
                a: "The platform is fully responsive and works seamlessly on all devices through your web browser. No app installation needed."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-4 sm:p-6 flex items-center justify-between text-left font-bold text-white hover:text-cyan-400 transition-colors"
                >
                  <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform ${activeFaq === i ? 'rotate-180 text-cyan-400' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-slate-400 leading-relaxed border-t border-slate-700/50 pt-3 sm:pt-4 text-sm sm:text-base">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer & CTA --- */}
      <footer className="relative py-16 sm:py-16 bg-gradient-to-br from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          {/* CTA Section */}
          <div className="text-center mb-16 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 px-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                Ready to automate{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  your queue?
                </span>
              </h2>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4">
                <Link to={"/register"}>
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 h-14 sm:h-16 px-8 sm:px-10 rounded-xl text-base sm:text-lg shadow-xl shadow-cyan-500/25 w-full sm:w-auto">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link to={"/login"}>
                  <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800/50 h-14 sm:h-16 px-8 sm:px-10 rounded-xl text-base sm:text-lg w-full sm:w-auto">
                    Login to Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 pt-12 sm:pt-16 border-t border-slate-800">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-white">SmartQueue</span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed text-left">
                Advanced appointment and capacity management for modern businesses.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 sm:space-y-3 text-slate-400 text-xs sm:text-sm">
                <li><a href="#features" className="hover:text-cyan-400 transition">Features</a></li>
                <li><a href="#logic" className="hover:text-cyan-400 transition">Engine</a></li>
                <li><a href="#logs" className="hover:text-cyan-400 transition">Activity Logs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 sm:space-y-3 text-slate-400 text-xs sm:text-sm">
                <li><Link to="/about" className="hover:text-cyan-400 transition">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-cyan-400 transition">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 sm:space-y-3 text-slate-400 text-xs sm:text-sm">
                <li><Link to="/privacy" className="hover:text-cyan-400 transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-cyan-400 transition">Terms of Use</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-800 text-center text-slate-500 text-xs sm:text-sm">
            <p>© {new Date().getFullYear()} SmartFlow HQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;