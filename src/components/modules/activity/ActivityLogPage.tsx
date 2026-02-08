import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Activity, Zap, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useGetRecentActivityLogsQuery } from '@/api/dashboard.api';

const ActivityLogPage = () => {
  const { data, isLoading } = useGetRecentActivityLogsQuery({ range: 'THIS_MONTH' });

  const logs = useMemo(() => data?.data ?? [], [data]);

  // Enhanced action color mapping with neon/dark theme friendly colors
  const getActionStyle = (action: string) => {
    const styleMap: Record<string, {
      bg: string;
      text: string;
      border: string;
      icon: React.ElementType;
      glow: string;
    }> = {
      'QUEUE_ASSIGNED': {
        bg: 'bg-cyan-950/40',
        text: 'text-cyan-300',
        border: 'border-cyan-500/30',
        icon: Zap,
        glow: 'from-cyan-500/20 to-blue-500/10'
      },
      'APPOINTMENT_CREATED': {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-300',
        border: 'border-emerald-500/30',
        icon: Activity,
        glow: 'from-emerald-500/15 to-teal-500/10'
      },
      'APPOINTMENT_COMPLETED': {
        bg: 'bg-blue-950/40',
        text: 'text-blue-300',
        border: 'border-blue-500/30',
        icon: Activity,
        glow: 'from-blue-500/20 to-cyan-500/10'
      },
      'APPOINTMENT_CANCELLED': {
        bg: 'bg-red-950/40',
        text: 'text-red-300',
        border: 'border-red-500/30',
        icon: AlertCircle,
        glow: 'from-red-500/15 to-rose-500/10'
      },
      'STAFF_UPDATED': {
        bg: 'bg-amber-950/40',
        text: 'text-amber-300',
        border: 'border-amber-500/30',
        icon: Activity,
        glow: 'from-amber-500/15 to-yellow-500/10'
      },
      'SERVICE_CREATED': {
        bg: 'bg-purple-950/40',
        text: 'text-purple-300',
        border: 'border-purple-500/30',
        icon: Zap,
        glow: 'from-purple-500/15 to-violet-500/10'
      },
    };

    return styleMap[action] || {
      bg: 'bg-slate-800/40',
      text: 'text-slate-300',
      border: 'border-slate-600/40',
      icon: Activity,
      glow: 'from-slate-500/10 to-gray-500/5'
    };
  };

  const formatActionLabel = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* Animated background - consistent across pages */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <motion.div
          animate={{ x: [0, 130, 0], y: [0, -130, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute -top-48 -left-48 w-[550px] h-[550px] bg-cyan-500/18 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ x: [0, -110, 0], y: [0, 150, 0], scale: [1, 1.35, 1] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-15%] w-[650px] h-[650px] bg-blue-600/12 rounded-full blur-[170px]"
        />
      </div>

      <div className="relative z-10 min-h-screen p-6 lg:p-10">
        <div className="space-y-10">

          {/* Header */}
          <div className='sm:flex justify-between items-center '>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 "
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                    <Sparkles className="h-8 w-8 text-cyan-400" />
                  </div>
                  Activity Logs
                </h1>
                <p className="text-slate-400 mt-2 text-sm">Real-time tracking of system events and user actions</p>
              </div>
            </motion.div>

            <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full backdrop-blur-sm mt-5 md:mt-0 md:mb-5">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span className="text-cyan-300 font-medium text-sm tracking-wide">MONITORING</span>
            </div>
          </div>


          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-5 bg-gradient-to-br from-cyan-500/15 to-violet-500/10 rounded-3xl blur-3xl opacity-70" />

            <div className="relative bg-gradient-to-br from-slate-800/92 to-slate-900/92 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 lg:p-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                  <Activity className="h-6 w-6 text-cyan-400" />
                  Recent System Activities
                </h2>

                <span className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/60 px-4 py-2 rounded-xl text-cyan-300 text-sm font-medium">
                  {logs.length} Events
                </span>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                  <Loader2 className="h-12 w-12 animate-spin mb-4 text-cyan-400" />
                  <p className="text-lg">Loading activity logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-24 text-slate-500">
                  <Activity className="h-20 w-20 mx-auto mb-6 opacity-30" />
                  <p className="text-xl font-medium mb-2">No recent activities</p>
                  <p className="text-sm">System events will appear here as they occur</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-3 custom-scrollbar">
                  <AnimatePresence>
                    {logs.map((log, idx) => {
                      const style = getActionStyle(log.action);
                      const IconComponent = style.icon;

                      return (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.4, delay: idx * 0.06 }}
                          className={`group bg-slate-900/50 border ${style.border} rounded-2xl p-5 hover:border-cyan-500/40 transition-all backdrop-blur-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon bubble */}
                            <div className={`p-3 rounded-xl ${style.bg} border ${style.border} flex-shrink-0 transition-all group-hover:scale-110`}>
                              <IconComponent className={`h-5 w-5 ${style.text}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} border ${style.border}`}>
                                  {formatActionLabel(log.action)}
                                </span>
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" />
                                  {log.time}
                                </span>
                              </div>

                              <p className="text-sm text-slate-200 leading-relaxed break-words">
                                {log.message}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPage;