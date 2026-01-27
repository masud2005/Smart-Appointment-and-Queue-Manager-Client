import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Activity, Clock, User, FileText } from 'lucide-react';
import { useState, useMemo } from 'react';

// Mock activity logs data structure
interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  performedBy: string;
  resourceType: string;
}

const ActivityLogPage = () => {
  // Mock data - in production, fetch from API
  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      action: 'Created',
      description: 'New appointment scheduled for John Doe',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      performedBy: 'Admin',
      resourceType: 'Appointment',
    },
    {
      id: '2',
      action: 'Updated',
      description: 'Staff member Farhan capacity updated to 10',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      performedBy: 'Admin',
      resourceType: 'Staff',
    },
    {
      id: '3',
      action: 'Deleted',
      description: 'Service "Consultation" removed from system',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      performedBy: 'Admin',
      resourceType: 'Service',
    },
    {
      id: '4',
      action: 'Completed',
      description: 'Appointment for Sarah completed successfully',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      performedBy: 'Staff',
      resourceType: 'Appointment',
    },
  ]);

  const isLoading = false;
  const logs = useMemo(() => activityLogs, [activityLogs]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Created':
        return 'bg-teal-100 text-teal-700';
      case 'Updated':
        return 'bg-slate-200 text-slate-700';
      case 'Deleted':
        return 'bg-red-100 text-red-700';
      case 'Completed':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'Appointment':
        return '📅';
      case 'Staff':
        return '👥';
      case 'Service':
        return '🏥';
      default:
        return '📋';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex items-center justify-between"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-4xl font-bold text-teal-600">
            Activity Logs
          </h1>
          <p className="text-gray-600 mt-2">Track all system activities and changes</p>
        </div>
        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-teal-600" />}
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
      >
        {[
          { label: 'Total Activities', value: logs.length, icon: Activity, color: 'bg-teal-100 border-teal-200' },
          { label: 'Created', value: logs.filter(l => l.action === 'Created').length, icon: FileText, color: 'bg-teal-100 border-teal-200' },
          { label: 'Updated', value: logs.filter(l => l.action === 'Updated').length, icon: Clock, color: 'bg-slate-100 border-slate-200' },
          { label: 'Deleted', value: logs.filter(l => l.action === 'Deleted').length, icon: Activity, color: 'bg-red-100 border-red-200' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              className={`${stat.color} rounded-2xl shadow-sm border backdrop-blur-sm p-6 text-slate-900`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2 text-teal-600">{stat.value}</p>
                </div>
                <Icon className="h-10 w-10 text-slate-400" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Activity Logs */}
      <motion.div 
        className="bg-white rounded-2xl shadow-sm border border-slate-200 backdrop-blur-sm p-6"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-600">
            Recent Activities
          </h2>
          <motion.span 
            className="text-sm font-semibold text-teal-600 bg-teal-50 px-4 py-2 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            {logs.length} logs
          </motion.span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No activity logs yet.</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div className="space-y-3">
              {logs.map((log, idx) => (
                <motion.div
                  key={log.id}
                  className="border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-teal-200 transition duration-300 backdrop-blur-sm bg-white/70"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <motion.div 
                      className="text-3xl mt-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      {getResourceIcon(log.resourceType)}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <motion.span 
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getActionColor(log.action)}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {log.action}
                        </motion.span>
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                          {log.resourceType}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-gray-900 mb-2">{log.description}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{log.performedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(log.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ActivityLogPage;
