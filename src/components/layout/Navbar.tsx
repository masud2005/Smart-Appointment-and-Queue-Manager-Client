import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/app/hook';
import { useLogout } from '@/hooks/useLogout';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, User, Bell, Loader2, Menu, X, ChevronDown } from 'lucide-react';

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
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 z-50 shadow-sm"
      >
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-linear-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg"
              >
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </motion.div>
              <span className="text-base sm:text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Smart Appointment
              </span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                title="Notifications"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"
                />
              </motion.button>

              <div className="flex items-center space-x-2 sm:space-x-3 border-l border-slate-200 pl-2 sm:pl-4">
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 hover:bg-slate-100 rounded-xl p-2 transition-all duration-200"
                  >
                    <div className="bg-linear-to-br from-indigo-100 to-purple-100 p-1.5 sm:p-2 rounded-full">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 max-w-30 truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 max-w-30 truncate">{user?.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
                      >
                        <div className="p-3 border-b border-slate-100">
                          <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          disabled={isLoading}
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-none"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <LogOut className="h-4 w-4 mr-2" />
                          )}
                          Logout
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;