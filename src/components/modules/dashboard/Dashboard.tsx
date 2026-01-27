import { useState } from 'react';
import {
  useGetDashboardSummaryQuery,
  useGetRecentActivityLogsQuery,
  useGetStaffLoadSummaryQuery,
  type DashboardQueryParams,
} from '@/api/dashboard.api';
import { useGetAppointmentsWithDetailsQuery } from '@/api/appointment.api';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Loader2,
  TrendingUp,
  AlertCircle,
  User,
  MoreHorizontal,
  ArrowRight,
  Activity,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';

type DateRange = 'ALL' | 'TODAY' | 'THIS_WEEKEND' | 'THIS_MONTH' | 'THIS_YEAR';

const Dashboard = () => {
  const [selectedRange, setSelectedRange] = useState<DateRange>('TODAY');

  const queryParams: DashboardQueryParams = { range: selectedRange };

  const { data: summaryData, isLoading: isSummaryLoading } = useGetDashboardSummaryQuery(queryParams);
  const { data: activityData, isLoading: isActivityLoading } = useGetRecentActivityLogsQuery({ ...queryParams, limit: 8 });
  const { data: staffLoadData, isLoading: isStaffLoadLoading } = useGetStaffLoadSummaryQuery(queryParams);
  const { data: recentAppointments, isLoading: isRecentLoading } = useGetAppointmentsWithDetailsQuery({ status: 'SCHEDULED' });

  const summary = summaryData?.data;
  const staffLoad = staffLoadData?.data ?? [];
  const activities = activityData?.data ?? [];
  const appointments = recentAppointments?.data ?? [];

  // Professional Color & Icon Mapping - Using actual backend data
  const stats = [
    {
      title: 'Total Appointments',
      value: summary?.totalAppointments ?? 0,
      subtitle: `In selected range`,
      icon: Calendar,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-100',
    },
    {
      title: 'Completed',
      value: summary?.completed ?? 0,
      subtitle: `${(summary?.pending ?? 0) + (summary?.scheduled ?? 0)} in progress`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: 'Pending',
      value: summary?.pending ?? 0,
      subtitle: 'Awaiting action',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      title: 'Waiting Queue',
      value: summary?.waitingQueueCount ?? 0,
      subtitle: 'In queue',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
  ];

  const chartData = {
    completed: summary?.completed ?? 0,
    pending: summary?.pending ?? 0,
    scheduled: summary?.scheduled ?? 0,
    inQueue: summary?.waitingQueueCount ?? 0,
  };
  const total = chartData.completed + chartData.pending + chartData.scheduled;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-8 font-sans text-slate-800">

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-teal-600" />
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Overview of your clinic's performance.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Clock className="h-4 w-4" />
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </div>
        </div>
      </motion.div>

      {/* Date Range Filter */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <span className="text-sm font-semibold text-slate-600">Filter by:</span>
        <div className="flex flex-wrap gap-2">
          {(['TODAY', 'THIS_WEEKEND', 'THIS_MONTH', 'THIS_YEAR', 'ALL'] as const).map((range) => {
            const labels: Record<DateRange, string> = {
              TODAY: 'Today',
              THIS_WEEKEND: 'This Weekend',
              THIS_MONTH: 'This Month',
              THIS_YEAR: 'This Year',
              ALL: 'All Time',
            };

            return (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${selectedRange === range
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {labels[range]}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`bg-white rounded-xl p-6 border ${stat.border} shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-slate-400">
                {stat.subtitle}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (Charts) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Staff Load Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-teal-500" />
                  Staff Workload
                </h2>
                <p className="text-sm text-slate-500">Real-time appointment distribution</p>
              </div>
            </div>

            {isStaffLoadLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
              </div>
            ) : staffLoad.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <Users className="h-10 w-10 mb-2 opacity-20" />
                <p>No staff data available</p>
              </div>
            ) : (
              <div className="flex items-end justify-between h-56 gap-4 px-4 pt-8 border-b border-slate-100">
                {staffLoad.slice(0, 6).map((staff: any) => {
                  const maxLoad = Math.max(...staffLoad.map((s: any) => Number(s.load) || 0), 1);
                  const heightPercent = ((Number(staff.load) || 0) / maxLoad) * 100;
                  return (
                    <div key={staff.id} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full flex justify-center items-end h-40">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="w-10 sm:w-14 bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all relative"
                          style={{ minHeight: '4px' }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {staff.load} Appts
                          </div>
                        </motion.div>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mt-3 truncate max-w-[80px]">
                        {staff.name.split(' ')[0]}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Upcoming Appointments List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Upcoming Schedule</h2>
                <p className="text-sm text-slate-500">Next scheduled appointments</p>
              </div>
              <button className="text-sm font-medium text-teal-600 hover:text-teal-800 flex items-center gap-1 transition-colors">
                View All <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="p-0">
              {isRecentLoading ? (
                <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-teal-500" /></div>
              ) : appointments.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No upcoming appointments</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {appointments.slice(0, 5).map((appt: any) => (
                    <div key={appt.id} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{appt.customerName}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(appt.dateTime), 'h:mm a')}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
                        Scheduled
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">

          {/* Status Donut Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-6">Status Overview</h2>

            {isSummaryLoading ? (
              <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-teal-500" /></div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                    {total > 0 && (
                      <>
                        <circle
                          cx="50" cy="50" r="40" fill="none" stroke="#14b8a6" strokeWidth="12" strokeLinecap="round"
                          strokeDasharray={`${(chartData.completed / total) * 251.2} 251.2`}
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round"
                          strokeDasharray={`${(chartData.pending / total) * 251.2} 251.2`}
                          strokeDashoffset={`-${(chartData.completed / total) * 251.2}`}
                        />
                        <circle
                          cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round"
                          strokeDasharray={`${(chartData.scheduled / total) * 251.2} 251.2`}
                          strokeDashoffset={`-${((chartData.completed + chartData.pending) / total) * 251.2}`}
                        />
                      </>
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800">{total}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total</span>
                  </div>
                </div>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                      <span className="text-slate-600">Completed</span>
                    </div>
                    <span className="font-semibold text-slate-900">{chartData.completed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-slate-600">Pending</span>
                    </div>
                    <span className="font-semibold text-slate-900">{chartData.pending}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span className="text-slate-600">Scheduled</span>
                    </div>
                    <span className="font-semibold text-slate-900">{chartData.scheduled}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Activity Log */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-h-[400px] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <Activity className="h-4 w-4 text-slate-400" />
            </div>

            {isActivityLoading ? (
              <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-teal-500" /></div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">No recent activities</div>
            ) : (
              <div className="space-y-6">
                {activities.map((log: any, index: number) => {
                  const isScheduled = log.action.includes('scheduled');
                  const isCompleted = log.action.includes('completed');

                  return (
                    <div key={log.id} className="relative flex gap-4">
                      {/* Timeline line */}
                      {index !== activities.length - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-[-24px] w-px bg-slate-100"></div>
                      )}

                      <div className={`
                                        shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white
                                        ${isScheduled ? 'border-teal-100 text-teal-600' :
                          isCompleted ? 'border-emerald-100 text-emerald-600' : 'border-slate-100 text-slate-500'}
                                    `}>
                        {isScheduled ? <Calendar className="h-3.5 w-3.5" /> :
                          isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                            <AlertCircle className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm text-slate-800 leading-snug">{log.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{log.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Staff Overview Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Staff Availability</h2>
          <button className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Manage Staff</button>
        </div>

        {isStaffLoadLoading ? (
          <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-teal-500" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {staffLoad.map((staff: any) => {
              const isAvailable = staff.availabilityStatus === 'AVAILABLE';
              return (
                <div key={staff.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center border border-slate-200 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{staff.name}</h3>
                        <p className="text-xs text-slate-500 capitalize">{staff.role || 'Staff'}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600"><MoreHorizontal className="h-4 w-4" /></button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {isAvailable ? 'Online' : 'Offline'}
                      </span>
                      <span className="text-xs font-medium text-slate-600">{staff.load}/5 Load</span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${Math.min(((Number(staff.load) || 0) / 5) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;