/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  Clock,
  Settings,
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
      title: 'Settings',
      path: '/dashboard/settings',
      icon: Settings,
    },
  ];

  return (
    <>
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
