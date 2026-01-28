import { useAppSelector } from '@/app/hook';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-teal-100 font-sans">

      {/* --- 1. Navigation --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-lg text-white">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">SmartFlow <span className="text-teal-600">HQ</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-teal-600 transition">Features</a>
            <a href="#logic" className="hover:text-teal-600 transition">Conflict Engine</a>
            <a href="#logs" className="hover:text-teal-600 transition">Activity</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold hover:text-teal-600 transition hidden sm:block">Demo Login</Link>
            <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6">
              <Link to="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* --- 2. Hero Section --- */}
      <header className="pt-40 pb-24 overflow-hidden relative">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-4 h-4" /> Smart Assignment Technology
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-8">
              Never Lose a <br />
              <span className="text-teal-600 underline decoration-slate-200">Customer</span> to Wait Times.
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
              An intelligent engine that handles staff capacity, detects scheduling conflicts, and manages virtual waiting queues automatically.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-14 px-8 bg-teal-600 hover:bg-teal-700 rounded-xl text-lg shadow-lg shadow-teal-100">
                Start Managing Free
              </Button>
              <div className="flex items-center gap-3 px-4 py-2 border border-slate-200 rounded-xl bg-slate-50/50">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                  ))}
                </div>
                <span className="text-sm text-slate-500 font-medium">Trusted by 500+ Businesses</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl shadow-teal-200/50 border-8 border-slate-800">
              <div className="bg-white rounded-2xl overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold flex items-center gap-2 text-slate-800"><LayoutDashboard className="w-4 h-4 text-teal-600" /> Staff Load Today</h4>
                  <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-full font-bold animate-pulse">Live Tracker</span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                    <span className="font-semibold text-sm">Dr. Farhan</span>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">5 / 5 Booked</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                    <span className="font-semibold text-sm">Nurse Riya</span>
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">3 / 5 Available</span>
                  </div>
                  <div className="mt-4 p-5 bg-teal-600 text-white rounded-2xl text-center shadow-lg">
                    <p className="text-xs opacity-90 uppercase tracking-widest font-bold">In Waiting Queue</p>
                    <p className="text-3xl font-black">04 Patients</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* --- 3. Core Features --- */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Logic-Driven Engine</h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-20">Built to follow your business rules, ensuring efficiency and zero booking errors.</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-teal-500 transition-all shadow-sm">
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">Conflict Detection</h3>
              <p className="text-slate-500 text-sm leading-relaxed">System instantly warns if a staff member is booked at the chosen time slot. No more double-booking headaches.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-teal-500 transition-all shadow-sm">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <ListOrdered className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">Smart Queueing</h3>
              <p className="text-slate-500 text-sm leading-relaxed">When staff reach capacity, appointments move to a chronologically ordered queue for instant assignment when free.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-teal-500 transition-all shadow-sm">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">Capacity Limits</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Set custom daily limits (e.g., max 5) per staff member. Real-time load summary keeps your team balanced.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. Logic Deep Dive (Conflict & Alerts) --- */}
      <section id="logic" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6 leading-tight">Smart Logic that <br /><span className="text-teal-600">Prevents Chaos</span></h2>
              <div className="space-y-8 mt-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0"><AlertTriangle /></div>
                  <div>
                    <h4 className="font-bold text-lg">Instant Conflict Warning</h4>
                    <p className="text-slate-500 italic">"This staff member already has an appointment at this time."</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><MinusCircle /></div>
                  <div>
                    <h4 className="font-bold text-lg">Capacity Lockdown</h4>
                    <p className="text-slate-500 italic">"Farhan already has 5 appointments today."</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="bg-white p-6 rounded-2xl border-l-8 border-red-500 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-bold text-xs uppercase tracking-widest">Action Blocked</span>
                </div>
                <p className="font-bold text-slate-800 mb-2 underline decoration-red-100">Booking Overlap Detected</p>
                <p className="text-sm text-slate-500">Pick another staff or change time to proceed.</p>
                <div className="mt-6 flex gap-2">
                  <div className="h-2 flex-1 bg-red-500 rounded-full"></div>
                  <div className="h-2 flex-1 bg-red-500 rounded-full"></div>
                  <div className="h-2 flex-1 bg-red-500 rounded-full"></div>
                  <div className="h-2 flex-1 bg-slate-200 rounded-full"></div>
                </div>
              </div>
              <Sparkles className="absolute top-4 right-4 text-white/10 w-24 h-24" />
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. Activity Log Stream (Requirement 8) --- */}
      <section id="logs" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-teal-50 rounded-2xl shadow-sm"><HistoryIcon className="text-teal-600 w-8 h-8" /></div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Live Activity Log</h2>
                <p className="text-sm text-slate-500 font-medium">Trace every queue movement and staff assignment instantly.</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { time: "11:45 AM", text: "Appointment for 'John Doe' auto-assigned to Riya.", icon: ArrowRightLeft },
                { time: "12:10 PM", text: "Appointment moved from queue to Farhan.", icon: UserCog },
                { time: "01:30 PM", text: "Staff capacity limit reached for 'Dr. Sarah'.", icon: AlertTriangle }
              ].map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100"
                >
                  <span className="text-xs font-bold text-teal-700 bg-teal-100 px-3 py-1.5 rounded-lg shrink-0">{log.time}</span>
                  <p className="text-sm font-medium text-slate-700 flex-1">{log.text}</p>
                  <log.icon className="w-4 h-4 text-slate-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- 6. Comparison Section --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Why SmartQueue Pro?</h2>
            <p className="text-slate-500">The difference between organized growth and daily chaos.</p>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
            <div className="p-12 bg-slate-50">
              <h3 className="text-xl font-bold mb-8 text-slate-400">Traditional Booking</h3>
              <ul className="space-y-6">
                <li className="flex gap-3 text-slate-500 text-sm font-medium"><MinusCircle className="text-red-300 w-5 h-5" /> High risk of double-booking</li>
                <li className="flex gap-3 text-slate-500 text-sm font-medium"><MinusCircle className="text-red-300 w-5 h-5" /> Overworked staff members (No limits)</li>
                <li className="flex gap-3 text-slate-500 text-sm font-medium"><MinusCircle className="text-red-300 w-5 h-5" /> No trail of changes or assignments</li>
              </ul>
            </div>
            <div className="p-12 bg-slate-900 text-white border-l border-slate-800">
              <h3 className="text-xl font-bold mb-8 text-teal-400">SmartQueue Pro</h3>
              <ul className="space-y-6">
                <li className="flex gap-3 text-sm font-medium"><CheckCircle className="text-teal-500 w-5 h-5" /> Automated Conflict Detection</li>
                <li className="flex gap-3 text-sm font-medium"><CheckCircle className="text-teal-500 w-5 h-5" /> Staff Load Balance (Max 5/day)</li>
                <li className="flex gap-3 text-sm font-medium"><CheckCircle className="text-teal-500 w-5 h-5" /> One-click Queue-to-Staff Engine</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- 7. Assignment Flow & Devices --- */}
      <section className="py-24 bg-teal-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <MonitorSmartphone className="w-16 h-16 mx-auto mb-8 text-teal-200" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6 italic tracking-tight">Manage Anywhere. Any Device.</h2>
          <p className="text-teal-100 max-w-2xl mx-auto text-lg mb-12">
            Fully responsive web interface. Manage appointments from your desktop or track staff load on the go with your smartphone.
          </p>
          <div className="flex justify-center gap-8 grayscale opacity-50 font-bold tracking-widest text-sm">
            <span>MOBILE FRIENDLY</span>
            <span>TABLET OPTIMIZED</span>
            <span>DESKTOP POWER</span>
          </div>
        </div>
      </section>

      {/* --- 8. FAQ Section --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How does the waiting queue work?", a: "When all staff reach their daily capacity (e.g., 5/5), new appointments move to the Waiting Queue. You can assign them manually as staff becomes available." },
              { q: "Can I customize staff services?", a: "Yes. You can manually create staff profiles, define their Service Type (Doctor, Consultant, etc.), and set their availability status." },
              { q: "Does it detect overlaps?", a: "Absolutely. If you try to book the same staff for two appointments at the same time, the system will block the action and show a warning." }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left font-bold text-slate-800"
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="p-6 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer & CTA --- */}
      <footer className="py-20 bg-slate-900 text-white rounded-t-[3rem]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to automate your queue?</h2>
          <div className="flex justify-center gap-4 mb-16">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 h-14 px-10 rounded-full text-lg">Create Free Account</Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 h-14 px-10 rounded-full text-lg">Contact Sales</Button>
          </div>
          <div className="grid md:grid-cols-4 gap-8 pt-12 border-t border-white/10 text-sm text-slate-400">
            <div className="text-left">
              <div className="text-white font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-500" /> SmartQueue
              </div>
              <p>Advanced Appointment and Capacity Management for modern businesses.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-teal-400">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-teal-400">Staff Load</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-teal-400">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-teal-400">Terms of Use</Link></li>
              </ul>
            </div>
            <div className="text-right">
              <p>© {new Date().getFullYear()} Smart Appointment. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;