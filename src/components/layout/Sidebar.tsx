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
      color: 'bg-teal-600',
    },
    {
      title: 'Appointments',
      path: '/dashboard/appointments',
      icon: Calendar,
      color: 'bg-teal-600',
    },
    {
      title: 'Queue',
      path: '/dashboard/queue',
      icon: Clock,
      color: 'bg-teal-600',
    },
    {
      title: 'Services',
      path: '/dashboard/services',
      icon: Briefcase,
      color: 'bg-teal-600',
    },
    {
      title: 'Staff',
      path: '/dashboard/staff',
      icon: Users,
      color: 'bg-teal-600',
    },
    {
      title: 'Activity Logs',
      path: '/dashboard/activity-logs',
      icon: Activity,
      color: 'bg-teal-600',
    },
  ];

  return (
    <>
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-[85px] h-[calc(100vh-4rem)] w-64 bg-white/80 backdrop-blur-lg border-r border-slate-200/50 z-30 transition-transform duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto h-full scrollbar-thin">
          <div className="mb-6 p-4 bg-linear-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Quick Actions</span>
            </div>
            <p className="text-xs text-white/80">Manage your appointments efficiently</p>
          </div>

          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={`group flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${isActive
                    ? 'bg-teal-50 text-teal-600 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-r"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={`p-2 rounded-lg ${isActive ? `bg-teal-600` : 'bg-slate-100 group-hover:bg-slate-200'} transition-all duration-200`}>
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <span className={`font-medium text-sm sm:text-base ${isActive ? 'font-semibold' : ''}`}>
                    {item.title}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <div className="h-2 w-2 rounded-full bg-teal-600" />
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Profile Section at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-5 left-0 right-0 p-3 sm:p-4 border-t border-slate-200/50 bg-gray-100 backdrop-blur-sm"
        >
          <Link
            to="/dashboard/profile"
            className={`group flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${location.pathname === '/dashboard/profile'
              ? 'bg-teal-100 text-teal-600 shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
              }`}
          >
            {location.pathname === '/dashboard/profile' && (
              <motion.div
                layoutId="profileTab"
                className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-r"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className={`p-2 rounded-lg ${location.pathname === '/dashboard/profile'
              ? 'bg-teal-600'
              : 'bg-slate-100 group-hover:bg-slate-200'
              } transition-all duration-200`}>
              <User className={`h-4 w-4 shrink-0 ${location.pathname === '/dashboard/profile' ? 'text-white' : 'text-slate-600'
                }`} />
            </div>
            <span className={`font-medium text-sm sm:text-base ${location.pathname === '/dashboard/profile' ? 'font-semibold' : ''
              }`}>
              Profile
            </span>
            {location.pathname === '/dashboard/profile' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto"
              >
                <div className="h-2 w-2 rounded-full bg-teal-600" />
              </motion.div>
            )}
          </Link>
        </motion.div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
