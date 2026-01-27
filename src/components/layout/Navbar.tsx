import { useState } from 'react';
import { useAppSelector } from '@/app/hook';
import { useLogout } from '@/hooks/useLogout';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, User, Bell, Loader2, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { logout, isLoading } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="bg-indigo-600 p-2 rounded-lg shadow-md">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-base sm:text-xl font-bold text-gray-900">
                Smart Appointment
              </span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="Notifications"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              <div className="flex items-center space-x-2 sm:space-x-3 border-l border-gray-200 pl-2 sm:pl-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-full">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 max-w-[120px] truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 max-w-[120px] truncate">{user?.email}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition p-2"
                  title="Logout"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
    </>
  );
};

export default Navbar;