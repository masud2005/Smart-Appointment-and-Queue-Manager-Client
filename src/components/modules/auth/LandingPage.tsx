import { useAppSelector } from '@/app/hook';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  Shield,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';
import { Link } from 'react-router';

const LandingPage = () => {
  const { isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const features = [
    {
      icon: Calendar,
      title: 'Smart Appointment Booking',
      description: 'Schedule appointments instantly with real-time availability and automated reminders.',
      gradient: 'from-teal-500 to-emerald-500',
    },
    {
      icon: Clock,
      title: 'Intelligent Queue Management',
      description: 'Reduce waiting time with virtual queuing, position tracking, and SMS notifications.',
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      icon: Users,
      title: 'Staff & Service Management',
      description: 'Assign services to staff, set daily capacity, and monitor performance easily.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Get detailed reports on bookings, no-shows, revenue, and staff efficiency.',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Book Appointment',
      description: 'Customer selects service, staff, and time slot in just a few clicks.',
      icon: Calendar,
    },
    {
      step: 2,
      title: 'Join Queue (Optional)',
      description: 'If busy, join virtual queue and get real-time position updates.',
      icon: Clock,
    },
    {
      step: 3,
      title: 'Get Notified',
      description: 'Receive confirmation, reminders, and updates via SMS/Email.',
      icon: MessageSquare,
    },
    {
      step: 4,
      title: 'Complete & Review',
      description: 'Service done — staff marks complete, customer can leave feedback.',
      icon: CheckCircle,
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Rahman',
      role: 'Clinic Owner, Dhaka',
      text: 'Reduced no-shows by 65% and staff utilization improved dramatically. Best decision for our clinic!',
      avatar: 'SR',
    },
    {
      name: 'Rashed Khan',
      role: 'Salon Chain Manager',
      text: 'The queue system is a game changer. Customers love getting SMS updates instead of waiting.',
      avatar: 'RK',
    },
    {
      name: 'Nadia Islam',
      role: 'Physiotherapy Center',
      text: 'Very clean dashboard, easy to train staff. Customer satisfaction up by 40%.',
      avatar: 'NI',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-200/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-teal-600 p-2.5 rounded-xl shadow-md">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Smart Appointment
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-700 hover:text-teal-600 font-medium transition">
              Login
            </Link>
            <Button asChild className="bg-teal-600 hover:bg-teal-700 shadow-lg">
              <Link to="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-5 py-2 rounded-full mb-6 shadow-sm"
            >
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Modern Appointment & Queue Solution</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight"
            >
              Smart Scheduling for{' '}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Modern Businesses
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Reduce waiting time, automate bookings, manage staff efficiently — all in one beautiful dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <Button size="lg" className="text-lg px-10 py-7 bg-teal-600 hover:bg-teal-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all" asChild>
                <Link to="/register">
                  Start Free Trial <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-teal-200 hover:border-teal-400 hover:bg-teal-50 transition-all" asChild>
                <Link to="/login">
                  Sign In <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white/40 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to run appointments and queues like a pro
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-slate-100 transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Simple 4-step process to get started</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6 text-teal-600 font-bold text-2xl">
                    {step.step}
                  </div>
                  <step.icon className="h-10 w-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-8 w-16 h-1 bg-teal-200" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-slate-600">Trusted by clinics, salons and service businesses</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-black/5" />
            <div className="relative z-10">
              <Shield className="h-20 w-20 text-white/90 mx-auto mb-8" />
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready to Transform Your Scheduling?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
                Join thousands of businesses already saving time and improving customer experience
              </p>
              <Button size="lg" className="text-xl px-12 py-8 bg-white text-teal-700 hover:bg-slate-50 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all" asChild>
                <Link to="/register">
                  Start Your Free Trial Now <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-teal-600 p-3 rounded-xl">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold">Smart Appointment</span>
              </div>
              <p className="text-slate-400 mb-6">
                Modern appointment and queue management solution for clinics, salons, and service businesses.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Product</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/features" className="hover:text-teal-400 transition">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-teal-400 transition">Pricing</Link></li>
                <li><Link to="/demo" className="hover:text-teal-400 transition">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/about" className="hover:text-teal-400 transition">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-teal-400 transition">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-teal-400 transition">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/privacy" className="hover:text-teal-400 transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-teal-400 transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
            <p>© {new Date().getFullYear()} Smart Appointment. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;