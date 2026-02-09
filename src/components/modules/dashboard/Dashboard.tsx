/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAppointmentsWithDetailsQuery } from '@/api/appointment.api';
import {
  useGetDashboardSummaryQuery,
  useGetRecentActivityLogsQuery,
  useGetStaffLoadSummaryQuery,
  type DashboardQueryParams,
} from '@/api/dashboard.api';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MoreHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

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

  // Professional Color & Icon Mapping
  const stats = [
    {
      title: 'Total Appointments',
      value: summary?.totalAppointments ?? 0,
      subtitle: `In selected range`,
      icon: Calendar,
      gradient: 'from-cyan-500 to-blue-600',
      iconBg: 'from-cyan-500/10 to-blue-500/10',
      borderColor: 'border-cyan-500/20',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Completed',
      value: summary?.completed ?? 0,
      subtitle: `${(summary?.pending ?? 0) + (summary?.scheduled ?? 0)} in progress`,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Pending',
      value: summary?.pending ?? 0,
      subtitle: 'Awaiting action',
      icon: Clock,
      gradient: 'from-orange-500 to-amber-600',
      iconBg: 'from-orange-500/10 to-amber-500/10',
      borderColor: 'border-orange-500/20',
      iconColor: 'text-orange-400',
    },
    {
      title: 'Waiting Queue',
      value: summary?.waitingQueueCount ?? 0,
      subtitle: 'In queue',
      icon: Users,
      gradient: 'from-violet-500 to-purple-600',
      iconBg: 'from-violet-500/10 to-purple-500/10',
      borderColor: 'border-violet-500/20',
      iconColor: 'text-violet-400',
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
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen  p-6 space-y-8">
      <div className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Sora', sans-serif" }}>
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                <Sparkles className="h-8 w-8 text-cyan-400" />
              </div>
              Dashboard
            </h1>
            <p className="text-slate-400 mt-2 text-sm">Real-time overview of your clinic's performance</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-700/50">
              <Clock className="h-4 w-4 text-cyan-400" />
              {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </div>
          </div>
        </motion.div>

        {/* Date Range Filter */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 p-5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 mb-8"
        >
          <div className="flex items-center gap-2 text-slate-400">
            <Target className="h-4 w-4" />
            <span className="text-sm font-semibold">Filter by:</span>
          </div>
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
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm ${selectedRange === range
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800/50 border border-slate-700/50'
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
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300 `} />
                <div className={`relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border ${stat.borderColor} hover:border-cyan-500/30 transition-all duration-300 h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-400 mb-2">{stat.title}</p>
                      <h3 className="text-4xl font-bold text-white tracking-tight">
                        {stat.value}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.iconBg} backdrop-blur-sm`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {stat.subtitle}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Staff Load Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-50" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white text-left" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Staff Workload
                      </h2>
                      <p className="text-sm text-slate-400">Real-time appointment distribution</p>
                    </div>
                  </div>
                  <BarChart3 className="h-5 w-5 text-slate-600" />
                </div>

                {isStaffLoadLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                  </div>
                ) : staffLoad.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                    <Users className="h-10 w-10 mb-2 opacity-20" />
                    <p>No staff data available</p>
                  </div>
                ) : (
                  <div className="flex items-end justify-between h-56 gap-4 px-4 pt-8">
                    {staffLoad.slice(0, 6).map((staff: any) => {
                      const maxLoad = Math.max(...staffLoad.map((s: any) => Number(s.load) || 0), 1);
                      const heightPercent = ((Number(staff.load) || 0) / maxLoad) * 100;
                      return (
                        <div key={staff.id} className="flex-1 flex flex-col items-center group/bar">
                          <div className="relative w-full flex justify-center items-end h-40">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${heightPercent}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                              className="w-12 sm:w-16 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-xl shadow-lg shadow-cyan-500/25 group-hover/bar:from-cyan-400 group-hover/bar:to-blue-400 transition-all relative"
                              style={{ minHeight: '8px' }}
                            >
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                                {staff.load} Appointments
                              </div>
                            </motion.div>
                          </div>
                          <p className="text-xs font-semibold text-slate-400 mt-4 truncate max-w-[90px] group-hover/bar:text-cyan-400 transition-colors">
                            {staff.name.split(' ')[0]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Upcoming Appointments List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur opacity-50" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl">
                      <Calendar className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Upcoming Schedule
                      </h2>
                      <p className="text-sm text-slate-400">Next scheduled appointments</p>
                    </div>
                  </div>
                  <Link to={"appointments"}>
                    <button className="text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                      View All <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>

                <div>
                  {isRecentLoading ? (
                    <div className="p-12 flex justify-center">
                      <Loader2 className="animate-spin text-cyan-400 h-6 w-6" />
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">No upcoming appointments</div>
                  ) : (
                    <div className="divide-y divide-slate-700/50">
                      {appointments.slice(0, 5).map((appt: any) => (
                        <div key={appt.id} className="p-5 flex items-center gap-4 hover:bg-slate-800/30 transition-all group/item">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover/item:border-cyan-500/40 transition-all">
                            <User className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{appt.customerName}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                              <Clock className="h-3.5 w-3.5" />
                              {format(new Date(appt.dateTime), 'h:mm a')}
                            </p>
                          </div>
                          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            Scheduled
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-50" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
                    <BarChart3 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                    Status Overview
                  </h2>
                </div>

                {isSummaryLoading ? (
                  <div className="h-48 flex items-center justify-center">
                    <Loader2 className="animate-spin text-cyan-400 h-6 w-6" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="12" />
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
                        <span className="text-4xl font-bold text-white">{total}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wide font-bold mt-1">Total</span>
                      </div>
                    </div>

                    <div className="w-full mt-8 space-y-3">
                      {[
                        { label: 'Completed', value: chartData.completed, color: 'bg-teal-500' },
                        { label: 'Pending', value: chartData.pending, color: 'bg-amber-500' },
                        { label: 'Scheduled', value: chartData.scheduled, color: 'bg-blue-500' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                            <span className="text-sm text-slate-300">{item.label}</span>
                          </div>
                          <span className="font-bold text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Activity Log */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur opacity-50" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 max-h-[450px] overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl">
                      <Activity className="h-5 w-5 text-orange-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                      Recent Activity
                    </h2>
                  </div>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-orange-400 rounded-full"
                  />
                </div>

                <div className="overflow-y-auto max-h-[350px] custom-scrollbar pr-2">
                  {isActivityLoading ? (
                    <div className="py-8 flex justify-center">
                      <Loader2 className="animate-spin text-cyan-400 h-6 w-6" />
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">No recent activities</div>
                  ) : (
                    <div className="space-y-6">
                      {activities.map((log: any, index: number) => {
                        const isScheduled = log.action.includes('scheduled');
                        const isCompleted = log.action.includes('completed');

                        return (
                          <div key={log.id} className="relative flex gap-4">
                            {index !== activities.length - 1 && (
                              <div className="absolute left-[15px] top-10 bottom-[-24px] w-px bg-slate-700/50"></div>
                            )}

                            <div className={`
                              shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border-2 z-10 
                              ${isScheduled ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' :
                                isCompleted ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                  'border-orange-500/30 bg-orange-500/10 text-orange-400'}
                            `}>
                              {isScheduled ? <Calendar className="h-4 w-4" /> :
                                isCompleted ? <CheckCircle2 className="h-4 w-4" /> :
                                  <AlertCircle className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 pt-0.5">
                              <p className="text-sm text-slate-300 leading-relaxed">{log.message}</p>
                              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {log.time}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Staff Overview Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl">
                <Users className="h-6 w-6 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                Staff Availability
              </h2>
            </div>
            <Link to={"staff"}>
              <button className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                Manage Staff
              </button>
            </Link>
          </div>

          {isStaffLoadLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="animate-spin text-cyan-400 h-8 w-8" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {staffLoad.map((staff: any) => {
                const isAvailable = staff.availabilityStatus === 'AVAILABLE';
                const loadPercent = Math.min(((Number(staff.load) || 0) / 5) * 100, 100);

                return (
                  <motion.div
                    key={staff.id}
                    whileHover={{ y: -4 }}
                    className="group relative"
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${isAvailable ? 'from-emerald-500/20 to-teal-500/20' : 'from-slate-500/20 to-slate-600/20'} rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300`} />
                    <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-700/50 group-hover:border-cyan-500/30 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl font-bold flex items-center justify-center border text-sm ${isAvailable
                            ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
                            }`}>
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">{staff.name}</h3>
                            <p className="text-xs text-slate-400 capitalize">{staff.role || 'Staff'}</p>
                          </div>
                        </div>
                        <button className="text-slate-500 hover:text-slate-300 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${isAvailable
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-700/50 text-slate-500 border border-slate-700/50'
                            }`}>
                            {isAvailable ? '● Online' : '● Offline'}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            {staff.load}/5 Load
                          </span>
                        </div>

                        <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${loadPercent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;