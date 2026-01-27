import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/app/hook';
import { Calendar, Clock, Users, CheckCircle, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

const LandingPage = () => {
  const { isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Calendar,
      title: 'Easy Appointment Booking',
      description: 'Schedule appointments with a few clicks and manage them efficiently.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Clock,
      title: 'Smart Queue Management',
      description: 'Intelligent queue system to minimize waiting times and improve efficiency.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Manage your team, assign services, and track their performance.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: CheckCircle,
      title: 'Real-time Updates',
      description: 'Get instant notifications and updates on appointment status.',
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-white/20"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="bg-teal-600 p-2 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-teal-600 bg-clip-text text-transparent">
                Smart Appointment
              </span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="hover:bg-teal-50">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-teal-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-sm transition-all duration-200">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-linear-to-r teal-100 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Trusted by 10,000+ Businesses</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-slate-900">Manage Appointments &</span>
            <br />
            <span className="text-teal-600">
              Queue Smarter
            </span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Streamline your appointment scheduling and queue management with our
            intelligent platform. Save time, reduce wait times, and improve
            customer satisfaction.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-7 bg-teal-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200">
                Start Free Trial <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-7 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200">
                Sign In <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-slate-600">
            Everything you need to manage appointments and queues effectively
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-white/20 group"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`bg-linear-to-br ${feature.gradient} w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-sm`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <Shield className="h-16 w-16 text-white mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses already using our platform
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="text-lg px-10 py-7 bg-white text-indigo-600 hover:bg-slate-50 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 font-bold"
              >
                Create Your Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="bg-slate-900 text-white py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-teal-600 p-2 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Smart Appointment</span>
            </div>
            <p className="text-slate-400">&copy; 2026 Smart Appointment. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
