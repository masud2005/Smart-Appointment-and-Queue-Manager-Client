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
  MinusCircle,
  MonitorSmartphone,
  ShieldAlert,
  Sparkles,
  Star,
  UserCog,
  Users,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

const LandingPage = () => {
  const { isInitialized } = useAppSelector((state) => state.auth);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
          className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
        />
      </div>

      {/* --- 1. Navigation --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-500/25">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              SmartFlow <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">HQ</span>
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#logic" className="hover:text-cyan-400 transition">Engine</a>
            <a href="#logs" className="hover:text-cyan-400 transition">Activity</a>
            <a href="#faq" className="hover:text-cyan-400 transition">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-cyan-400 transition hidden sm:block">
              Demo Login
            </Link>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl px-6 shadow-lg shadow-cyan-500/25">
              <Link to="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* --- 2. Hero Section --- */}
      <header className="relative pt-40 pb-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-sm"
              >
                <Zap className="w-4 h-4" /> AI-Powered Assignment Technology
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.05] mb-8" style={{ fontFamily: "'Sora', sans-serif" }}>
                Never Lose a{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Customer
                </span>
                <br />
                to Wait Times
              </h1>

              <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
                Intelligent appointment engine that handles staff capacity, detects scheduling conflicts,
                and manages virtual waiting queues automatically.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl text-lg font-semibold shadow-xl shadow-cyan-500/25">
                  Start Managing Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 border-slate-700 hover:bg-slate-800/50 rounded-xl text-lg font-semibold">
                  Watch Demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-slate-900 flex items-center justify-center text-xs font-bold">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-slate-400 text-sm">Trusted by</p>
                    <p className="text-white font-bold">500+ Businesses</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-slate-400 text-sm ml-2">4.9/5 Rating</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl" />

                {/* Dashboard card */}
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold flex items-center gap-2 text-white">
                      <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                      Staff Load Today
                    </h4>
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-xs bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1 rounded-full font-bold"
                    >
                      ● Live
                    </motion.span>
                  </div>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                          DF
                        </div>
                        <span className="font-semibold text-white">Dr. Farhan</span>
                      </div>
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                        5 / 5 Booked
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                          NR
                        </div>
                        <span className="font-semibold text-white">Nurse Riya</span>
                      </div>
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg">
                        3 / 5 Available
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-6 p-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-center shadow-lg"
                    >
                      <p className="text-xs text-cyan-100 uppercase tracking-widest font-bold mb-2">
                        In Waiting Queue
                      </p>
                      <p className="text-4xl font-black text-white">04 Patients</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* --- 3. Core Features --- */}
      <section id="features" className="relative py-32 bg-slate-900/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                The Logic-Driven{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Engine
                </span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Built to follow your business rules, ensuring efficiency and zero booking errors.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                className={`group relative bg-gradient-to-br ${feature.color} backdrop-blur-sm border ${feature.borderColor} rounded-3xl p-8 hover:border-cyan-500/40 transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 rounded-3xl transition-all duration-300" />
                <div className="relative">
                  <div className={`w-16 h-16 bg-slate-900/50 ${feature.iconColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. Logic Deep Dive --- */}
      <section id="logic" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-8 leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                Smart Logic that{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Prevents Chaos
                </span>
              </h2>

              <div className="space-y-6 mt-12">
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
                    className={`flex gap-5 p-6 rounded-2xl ${item.bgColor} border ${item.borderColor} backdrop-blur-sm`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-slate-900/50 flex items-center justify-center ${item.iconColor} shrink-0`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white mb-2">{item.title}</h4>
                      <p className="text-slate-400 text-sm italic">{item.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-10 rounded-3xl shadow-2xl">
                <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-l-4 border-red-500 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <span className="font-bold text-xs uppercase tracking-widest text-red-400">
                      Action Blocked
                    </span>
                  </div>
                  <p className="font-bold text-xl text-white mb-3">
                    Booking Overlap Detected
                  </p>
                  <p className="text-sm text-slate-400 mb-6">
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
                <Sparkles className="absolute top-6 right-6 text-cyan-500/10 w-32 h-32" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 5. Activity Log Stream --- */}
      <section id="logs" className="relative py-32 bg-slate-900/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 md:p-14 shadow-2xl">
                <div className="flex items-center gap-5 mb-12">
                  <div className="p-5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl">
                    <HistoryIcon className="text-cyan-400 w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                      Live Activity Log
                    </h2>
                    <p className="text-slate-400">
                      Trace every queue movement and staff assignment instantly.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
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
                      className="flex items-center gap-4 bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl hover:border-cyan-500/30 transition-all group"
                    >
                      <span className={`text-xs font-bold bg-${log.color}-500/10 border border-${log.color}-500/20 text-${log.color}-400 px-4 py-2 rounded-xl shrink-0`}>
                        {log.time}
                      </span>
                      <p className="text-sm font-medium text-slate-300 flex-1">
                        {log.text}
                      </p>
                      <log.icon className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 6. Comparison Section --- */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              Why SmartQueue{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Pro?
              </span>
            </h2>
            <p className="text-slate-400 text-lg">
              The difference between organized growth and daily chaos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl">
              <div className="p-12 bg-slate-900/50 border-r border-slate-700/50">
                <h3 className="text-2xl font-bold mb-10 text-slate-500">Traditional Booking</h3>
                <ul className="space-y-6">
                  {[
                    'High risk of double-booking',
                    'Overworked staff members (No limits)',
                    'No trail of changes or assignments',
                    'Manual queue management'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 text-slate-400 font-medium">
                      <MinusCircle className="text-red-400/50 w-6 h-6 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-12 bg-gradient-to-br from-slate-800 to-slate-900">
                <h3 className="text-2xl font-bold mb-10 text-cyan-400">SmartQueue Pro</h3>
                <ul className="space-y-6">
                  {[
                    'Automated Conflict Detection',
                    'Staff Load Balance (Max 5/day)',
                    'One-click Queue-to-Staff Engine',
                    'Real-time Activity Tracking'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 text-white font-medium">
                      <CheckCircle className="text-cyan-400 w-6 h-6 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 7. Multi-Device Section --- */}
      <section className="relative py-32 bg-gradient-to-br from-cyan-600 to-blue-700">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <MonitorSmartphone className="w-20 h-20 mx-auto mb-10 text-cyan-200" />
            <h2 className="text-4xl md:text-6xl font-bold mb-8 italic tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              Manage Anywhere.
              <br />
              Any Device.
            </h2>
            <p className="text-cyan-100 max-w-2xl mx-auto text-xl mb-14 leading-relaxed">
              Fully responsive web interface. Manage appointments from your desktop or
              track staff load on the go with your smartphone.
            </p>
            <div className="flex flex-wrap justify-center gap-12 text-cyan-200/60 font-bold tracking-widest text-sm">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-200 rounded-full" />
                MOBILE FRIENDLY
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-200 rounded-full" />
                TABLET OPTIMIZED
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-200 rounded-full" />
                DESKTOP POWER
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 8. FAQ Section --- */}
      <section id="faq" className="relative py-32 bg-slate-900/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </motion.div>

          <div className="space-y-4">
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
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left font-bold text-white hover:text-cyan-400 transition-colors"
                >
                  {faq.q}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${activeFaq === i ? 'rotate-180 text-cyan-400' : ''}`}
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
                      <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-slate-700/50 pt-4">
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
      <footer className="relative py-24 bg-gradient-to-br from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6">
          {/* CTA Section */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8" style={{ fontFamily: "'Sora', sans-serif" }}>
                Ready to automate{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  your queue?
                </span>
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 h-16 px-10 rounded-xl text-lg shadow-xl shadow-cyan-500/25">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800/50 h-16 px-10 rounded-xl text-lg">
                  Contact Sales
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          <div className="grid md:grid-cols-4 gap-12 pt-16 border-t border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SmartQueue</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Advanced appointment and capacity management for modern businesses.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-cyan-400 transition">Features</a></li>
                <li><a href="#logic" className="hover:text-cyan-400 transition">Engine</a></li>
                <li><a href="#logs" className="hover:text-cyan-400 transition">Activity Logs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link to="/about" className="hover:text-cyan-400 transition">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-cyan-400 transition">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link to="/privacy" className="hover:text-cyan-400 transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-cyan-400 transition">Terms of Use</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} SmartFlow HQ. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Google Fonts */}
      {/* <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style> */}
    </div>
  );
};

export default LandingPage;