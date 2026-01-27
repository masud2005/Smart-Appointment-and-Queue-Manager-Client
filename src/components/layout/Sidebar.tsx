import { Link, useLocation } from 'react-router';
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
    <aside className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
