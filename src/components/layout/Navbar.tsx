import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/app/hook';
import { useLogout } from '@/hooks/useLogout';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, User, Bell, Loader2, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { logout, isLoading } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 120 }}
        className="fixed top-0 left-0 right-0 bg-gradient-to-b from-slate-900/95 to-slate-950/90 backdrop-blur-2xl border-b border-slate-700/50 z-50 shadow-2xl"
      >
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Logo + Mobile toggle */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2.5 text-cyan-400 hover:bg-cyan-950/40 rounded-xl transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              <Link to="/" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/20 shadow-cyan-500/30"
                >
                  <Calendar className="h-7 w-7 text-white" />
                </motion.div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                    SmartFlow <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">HQ</span>
                  </span>
                  <p className="text-xs text-slate-400">Dashboard Management</p>
                </div>
              </Link>
            </div>

            {/* Right - Actions + User */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Notification Bell */}
              {/* <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 text-cyan-400 hover:bg-cyan-950/40 rounded-xl transition-all"
              >
                <Bell className="h-6 w-6" />
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-red-500/40"
                />
              </motion.button> */}

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 hover:bg-slate-800/50 rounded-xl p-2 transition-all"
                >
                  <div className="p-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20">
                    <User className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white truncate max-w-[140px]">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-slate-400 truncate max-w-[140px]">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-700/50">
                        <p className="font-medium text-white truncate">{user?.name}</p>
                        <p className="text-sm text-slate-400 truncate">{user?.email}</p>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800/60 transition-all"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-5 w-5" />
                          Profile Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          disabled={isLoading}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-950/40 transition-all disabled:opacity-50"
                        >
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <LogOut className="h-5 w-5" />
                          )}
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile sidebar toggle overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;