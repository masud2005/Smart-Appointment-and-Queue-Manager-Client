import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Activity, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { useGetRecentActivityLogsQuery } from '@/api/dashboard.api';

const ActivityLogPage = () => {
  const { data, isLoading } = useGetRecentActivityLogsQuery({ range: 'THIS_MONTH' });
  
  const logs = useMemo(() => data?.data ?? [], [data]);

  // Map action types to colors
  const getActionColor = (action: string) => {
    const actionColorMap: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
      'QUEUE_ASSIGNED': { bg: 'bg-teal-100', text: 'text-teal-700', icon: Zap },
      'APPOINTMENT_CREATED': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: Activity },
      'APPOINTMENT_COMPLETED': { bg: 'bg-blue-100', text: 'text-blue-700', icon: Activity },
      'APPOINTMENT_CANCELLED': { bg: 'bg-red-100', text: 'text-red-700', icon: Activity },
      'STAFF_UPDATED': { bg: 'bg-amber-100', text: 'text-amber-700', icon: Activity },
      'SERVICE_CREATED': { bg: 'bg-purple-100', text: 'text-purple-700', icon: Activity },
    };
    return actionColorMap[action] || { bg: 'bg-slate-100', text: 'text-slate-700', icon: Activity };
  };

  const formatActionLabel = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-8 font-sans text-slate-800">
      <div className="">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Activity className="w-6 h-6 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Activity Logs</h1>
          </div>
          <p className="text-slate-600 text-left">Track all system activities and changes</p>
        </motion.div>

        {/* Activity Logs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activities</h2>
            <motion.span
              className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {logs.length} logs
            </motion.span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            </div>
          ) : logs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-40 text-slate-500"
            >
              <Activity className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-center">No activity logs available</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {logs.map((log, idx) => {
                  const { bg, text, icon: IconComponent } = getActionColor(log.action);
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                    >
                      {/* Action Icon */}
                      <div className={`p-2 rounded-lg flex-shrink-0 ${bg}`}>
                        <IconComponent className={`w-4 h-4 ${text}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${bg} ${text}`}>
                              {formatActionLabel(log.action)}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-medium flex-shrink-0">{log.time}</span>
                        </div>
                        <p className="text-sm text-slate-700 break-words">{log.message}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ActivityLogPage;
