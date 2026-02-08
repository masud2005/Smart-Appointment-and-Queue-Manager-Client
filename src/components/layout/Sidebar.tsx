import { Link, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  Clock,
  Activity,
  Sparkles,
  User,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Appointments',
      path: '/dashboard/appointments',
      icon: Calendar,
    },
    {
      title: 'Queue',
      path: '/dashboard/queue',
      icon: Clock,
    },
    {
      title: 'Services',
      path: '/dashboard/services',
      icon: Briefcase,
    },
    {
      title: 'Staff',
      path: '/dashboard/staff',
      icon: Users,
    },
    {
      title: 'Activity Logs',
      path: '/dashboard/activity-logs',
      icon: Activity,
    },
  ];

  return (
    <>
      <motion.aside
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed left-0 top-[4.5rem] lg:top-[5rem] h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)] w-72 
          bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 
          backdrop-blur-xl border-r border-slate-700/40 z-30 
          transition-all duration-500 lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        {/* Subtle animated background glow */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: ['-10%', '10%', '-10%'],
              y: ['-15%', '15%', '-15%'],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: ['10%', '-10%', '10%'],
              y: ['10%', '-10%', '10%'],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl"
          />
        </div> */}

        <div className="relative z-10 h-full flex flex-col">
          <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-transparent">
            {/* Branding / Quick Action Card */}
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="mb-8 p-5 bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/70 
                  border border-cyan-500/20 rounded-xl text-white shadow-lg shadow-cyan-500/5 
                  backdrop-blur-md group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                    Smart Queue
                  </span>
                </div>
                <p className="text-sm text-cyan-100/70 group-hover:text-cyan-100 transition-colors">
                  Effortless Appointment Flow
                </p>
              </motion.div>
            </Link>

            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.06, duration: 0.5 }}
                >
                  <Link
                    to={item.path}
                    className={`group relative flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-cyan-600/20 via-cyan-500/15 to-blue-600/10 text-cyan-300 shadow-lg shadow-cyan-500/10 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800/40 hover:border-slate-700/60 hover:shadow-md hover:shadow-cyan-500/5'
                      }`}
                  >
                    {/* Active indicator bar */}
                    {/* {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )} */}

                    {/* Icon container */}
                    <div
                      className={`p-3 rounded-xl transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-800/60 group-hover:bg-slate-700/70'
                        }`}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-300'
                          }`}
                      />
                    </div>

                    <span
                      className={`font-medium text-base transition-all ${isActive ? 'text-cyan-100 font-semibold' : 'group-hover:text-cyan-200'
                        }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.title}
                    </span>

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="p-5 border-t border-slate-700/50 bg-gradient-to-t from-slate-950/80 to-transparent"
          >
            <Link
              to="/dashboard/profile"
              className={`group relative flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300
                ${location.pathname === '/dashboard/profile'
                  ? 'bg-gradient-to-r from-cyan-600/20 via-cyan-500/15 to-blue-600/10 text-cyan-300 shadow-lg shadow-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800/40 hover:border-slate-700/60 hover:shadow-md hover:shadow-cyan-500/5'
                }`}
            >
              {/* {location.pathname === '/dashboard/profile' && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )} */}

              <div
                className={`p-3 rounded-xl transition-all duration-300 ${location.pathname === '/dashboard/profile'
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800/60 group-hover:bg-slate-700/70'
                  }`}
              >
                <User
                  className={`h-5 w-5 shrink-0 transition-colors ${location.pathname === '/dashboard/profile' ? 'text-white' : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                />
              </div>

              <span
                className={`font-medium text-base transition-all ${location.pathname === '/dashboard/profile' ? 'text-cyan-100 font-semibold' : 'group-hover:text-cyan-200'
                  }`}
              >
                Profile
              </span>

              {location.pathname === '/dashboard/profile' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                />
              )}
            </Link>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;