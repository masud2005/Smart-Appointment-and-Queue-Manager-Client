import {
  useGetDashboardSummaryQuery,
  useGetRecentActivityLogsQuery,
  useGetStaffLoadSummaryQuery,
} from '@/api/dashboard.api';
import { useGetAppointmentsWithDetailsQuery } from '@/api/appointment.api';
import { useGetStaffQuery } from '@/api/staff.api';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle,
  Users,
  Loader2,
  TrendingUp,
  AlertCircle,
  User,
  MoreVertical,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { data: summaryData, isLoading: isSummaryLoading } = useGetDashboardSummaryQuery();
  const { data: activityData, isLoading: isActivityLoading } = useGetRecentActivityLogsQuery(8);
  const { data: staffLoadData, isLoading: isStaffLoadLoading } = useGetStaffLoadSummaryQuery();
  const { data: recentAppointments, isLoading: isRecentLoading } = useGetAppointmentsWithDetailsQuery({ status: 'SCHEDULED' });
  const { data: allStaffData } = useGetStaffQuery();

  const summary = summaryData?.data;
  const staffLoad = staffLoadData?.data ?? [];
  const activities = activityData?.data ?? [];
  const appointments = recentAppointments?.data ?? [];
  const allStaff = allStaffData?.data ?? [];

  const pendingCount = (summary?.totalAppointmentsToday ?? 0) - (summary?.completedToday ?? 0);
  const activeStaffCount = allStaff.filter((s: any) => s.status === 'ACTIVE').length;
  const onLeaveCount = allStaff.filter((s: any) => s.status !== 'ACTIVE').length;

  const stats = [
    {
      title: 'Total Appointments',
      value: summary?.totalAppointmentsToday ?? 0,
      subtitle: 'Today',
      icon: Calendar,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Completed',
      value: summary?.completedToday ?? 0,
      subtitle: `${pendingCount} pending`,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Waiting Queue',
      value: summary?.waitingQueueCount ?? 0,
      subtitle: 'Awaiting assignment',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Active Staff',
      value: activeStaffCount,
      subtitle: `${onLeaveCount} on leave`,
      icon: Users,
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  const chartData = {
    scheduled: summary?.scheduledToday ?? 0,
    completed: summary?.completedToday ?? 0,
    inQueue: summary?.waitingQueueCount ?? 0,
  };
  const total = chartData.scheduled + chartData.completed + chartData.inQueue;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 min-h-screen animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Welcome back! Here's what's happening today</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Activity className="h-5 w-5" />
          Quick Actions
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2 sm:mb-3 truncate">{stat.title}</p>
                  <h3 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{stat.subtitle}</p>
                </div>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`bg-linear-to-br ${stat.gradient} p-2 sm:p-3 rounded-xl shrink-0 shadow-lg`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Staff Load
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">Today's appointment distribution</p>
            </div>
          </div>

          {isStaffLoadLoading ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-indigo-400" />
            </div>
          ) : staffLoad.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">No staff data</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-end justify-between h-40 sm:h-48 gap-2 sm:gap-4">
                {staffLoad.slice(0, 4).map((staff: any) => {
                  const maxLoad = Math.max(...staffLoad.map((s: any) => Number(s.load) || 0), 1);
                  const heightPercent = ((Number(staff.load) || 0) / maxLoad) * 100;
                  return (
                    <motion.div
                      key={staff.id}
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      transition={{ delay: 0.1 }}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full flex items-end justify-center h-32 sm:h-40">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-12 sm:w-16 bg-linear-to-t from-indigo-600 via-purple-500 to-pink-500 rounded-t-xl transition-all duration-300 relative group shadow-lg"
                          style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                            {staff.load} appointments
                          </div>
                        </motion.div>
                      </div>
                      <p className="text-xs font-medium text-slate-700 text-center truncate w-full">
                        {staff.name.split(' ')[0]}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <p className="text-xs text-slate-500">0</p>
                <p className="text-xs text-slate-500">Appointments</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Appointment Status</h2>
              <p className="text-xs sm:text-sm text-slate-500">Today's breakdown</p>
            </div>
          </div>

          {isSummaryLoading ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-indigo-400" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="20" />

                  {total > 0 && (
                    <>
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#blueGradient)"
                        strokeWidth="20"
                        strokeDasharray={`${(chartData.scheduled / total) * 251.2} 251.2`}
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#greenGradient)"
                        strokeWidth="20"
                        strokeDasharray={`${(chartData.completed / total) * 251.2} 251.2`}
                        strokeDashoffset={`-${(chartData.scheduled / total) * 251.2}`}
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#amberGradient)"
                        strokeWidth="20"
                        strokeDasharray={`${(chartData.inQueue / total) * 251.2} 251.2`}
                        strokeDashoffset={`-${((chartData.scheduled + chartData.completed) / total) * 251.2}`}
                      />
                    </>
                  )}
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                    <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {total}
                    </p>
                    <p className="text-xs text-slate-500">Total</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 shadow-sm"></div>
                  <p className="text-sm font-medium text-slate-700">Scheduled ({chartData.scheduled})</p>
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 shadow-sm"></div>
                  <p className="text-sm font-medium text-slate-700">Completed ({chartData.completed})</p>
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-linear-to-r from-amber-500 to-orange-500 shadow-sm"></div>
                  <p className="text-sm font-medium text-slate-700">In Queue ({chartData.inQueue})</p>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Upcoming Appointments</h2>
              <p className="text-xs sm:text-sm text-slate-500">Today's schedule</p>
            </div>
            <button className="text-xs sm:text-sm text-indigo-600 hover:text-purple-600 font-medium flex items-center gap-1 transition-colors">
              View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>

          {isRecentLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-indigo-400" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-30" />
              <p className="text-xs sm:text-sm">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 4).map((appt: any, index: number) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group cursor-pointer"
                >
                  <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-slate-900 truncate">{appt.customerName}</p>
                    <p className="text-xs sm:text-sm text-slate-500">{format(new Date(appt.dateTime), 'HH:mm')}</p>
                  </div>
                  <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-indigo-100 to-purple-100 text-indigo-700 whitespace-nowrap">
                    Scheduled
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Activity Log</h2>
              <p className="text-xs sm:text-sm text-slate-500">Recent actions</p>
            </div>
            <button className="text-xs sm:text-sm text-indigo-600 hover:text-purple-600 font-medium flex items-center gap-1 transition-colors">
              View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>

          {isActivityLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-indigo-400" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-30" />
              <p className="text-xs sm:text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((log: any, index: number) => {
                const getIconColor = () => {
                  if (log.action.includes('scheduled'))
                    return { icon: Calendar, gradient: 'from-blue-500 to-cyan-500' };
                  if (log.action.includes('completed'))
                    return { icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500' };
                  if (log.action.includes('added'))
                    return { icon: Clock, gradient: 'from-amber-500 to-orange-500' };
                  return { icon: AlertCircle, gradient: 'from-slate-500 to-gray-500' };
                };
                const { icon: Icon, gradient } = getIconColor();

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br ${gradient} rounded-full flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-slate-900 wrap-break-word">{log.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{log.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 p-4 sm:p-6 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Staff Overview</h2>
            <p className="text-xs sm:text-sm text-slate-500">Current capacity and availability</p>
          </div>
          <button className="text-xs sm:text-sm text-indigo-600 hover:text-purple-600 font-medium flex items-center gap-1 w-fit transition-colors">
            Manage Staff <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>

        {isStaffLoadLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-indigo-400" />
          </div>
        ) : staffLoad.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-500">No staff data</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffLoad.map((staff: any, index: number) => {
              const isAvailable = staff.availabilityStatus === 'AVAILABLE';
              return (
                <motion.div
                  key={staff.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="border border-slate-200 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shrink-0 shadow-md">
                        {staff.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base text-slate-900 truncate">{staff.name}</h3>
                        <p className="text-xs text-slate-500 capitalize">{staff.status.toLowerCase()}</p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 shrink-0">
                      <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      isAvailable
                        ? 'bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isAvailable ? 'Available' : 'Not Available'}
                  </span>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                      <span className="text-slate-600">Today's Load</span>
                      <span className="font-semibold text-slate-900">{staff.load} / 5</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(((Number(staff.load) || 0) / 5) * 100, 100)}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="bg-linear-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
