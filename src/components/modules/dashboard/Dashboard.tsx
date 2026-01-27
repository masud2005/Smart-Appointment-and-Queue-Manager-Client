import {
  useGetDashboardSummaryQuery,
  useGetRecentActivityLogsQuery,
  useGetStaffLoadSummaryQuery,
} from '@/api/dashboard.api';
import { useGetAppointmentsWithDetailsQuery } from '@/api/appointment.api';
import { useGetStaffQuery } from '@/api/staff.api';
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
  ArrowRight
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

  // Calculate stats
  const pendingCount = (summary?.totalAppointmentsToday ?? 0) - (summary?.completedToday ?? 0);
  const activeStaffCount = allStaff.filter(s => (s as any).status === 'ACTIVE').length;
  const onLeaveCount = allStaff.filter(s => (s as any).status !== 'ACTIVE').length;

  const stats = [
    {
      title: 'Total Appointments',
      value: summary?.totalAppointmentsToday ?? 0,
      subtitle: 'Today',
      icon: Calendar,
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-100',
    },
    {
      title: 'Completed',
      value: summary?.completedToday ?? 0,
      subtitle: `${pendingCount} pending`,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
    },
    {
      title: 'Waiting Queue',
      value: summary?.waitingQueueCount ?? 0,
      subtitle: 'Awaiting assignment',
      icon: Clock,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
    {
      title: 'Active Staff',
      value: activeStaffCount,
      subtitle: `${onLeaveCount} on leave`,
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
  ];

  // Calculate chart data for appointment status
  const chartData = {
    scheduled: summary?.scheduledToday ?? 0,
    completed: summary?.completedToday ?? 0,
    inQueue: summary?.waitingQueueCount ?? 0,
  };
  const total = chartData.scheduled + chartData.completed + chartData.inQueue;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back! Here's what's happening today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-xl border ${stat.borderColor} p-6 hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-3">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff Load Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Staff Load</h2>
              <p className="text-sm text-gray-500">Today's appointment distribution</p>
            </div>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>

          {isStaffLoadLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : staffLoad.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No staff data</div>
          ) : (
            <div className="space-y-4">
              {/* Bar Chart */}
              <div className="flex items-end justify-between h-48 gap-4">
                {staffLoad.slice(0, 4).map((staff) => {
                  const maxLoad = Math.max(...staffLoad.map(s => Number(s.load) || 0), 1);
                  const heightPercent = ((Number(staff.load) || 0) / maxLoad) * 100;
                  return (
                    <div key={staff.id} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end justify-center h-40">
                        <div
                          className="w-16 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-300 hover:from-emerald-600 hover:to-emerald-500 relative group"
                          style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                            {staff.load} appointments
                          </div>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-gray-700 text-center">
                        {staff.name.split(' ')[0]}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <p className="text-xs text-gray-500">0</p>
                <p className="text-xs text-gray-500">Appointments</p>
              </div>
            </div>
          )}
        </div>

        {/* Appointment Status Donut Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Appointment Status</h2>
              <p className="text-sm text-gray-500">Today's breakdown</p>
            </div>
          </div>

          {isSummaryLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-8">
              {/* Donut Chart */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="20"
                  />

                  {total > 0 && (
                    <>
                      {/* Scheduled (Blue) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="20"
                        strokeDasharray={`${(chartData.scheduled / total) * 251.2} 251.2`}
                        strokeDashoffset="0"
                      />
                      {/* Completed (Green) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="20"
                        strokeDasharray={`${(chartData.completed / total) * 251.2} 251.2`}
                        strokeDashoffset={`-${(chartData.scheduled / total) * 251.2}`}
                      />
                      {/* In Queue (Amber) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="20"
                        strokeDasharray={`${(chartData.inQueue / total) * 251.2} 251.2`}
                        strokeDashoffset={`-${((chartData.scheduled + chartData.completed) / total) * 251.2}`}
                      />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Scheduled ({chartData.scheduled})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Completed ({chartData.completed})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">In Queue ({chartData.inQueue})</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Appointments & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
              <p className="text-sm text-gray-500">Today's schedule</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {isRecentLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 4).map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{appt.customerName}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(appt.dateTime), 'HH:mm')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Scheduled
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Activity Log</h2>
              <p className="text-sm text-gray-500">Recent actions</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {isActivityLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((log) => {
                const getIconColor = () => {
                  if (log.action.includes('scheduled')) return { icon: Calendar, bg: 'bg-blue-100', color: 'text-blue-600' };
                  if (log.action.includes('completed')) return { icon: CheckCircle, bg: 'bg-green-100', color: 'text-green-600' };
                  if (log.action.includes('added')) return { icon: Clock, bg: 'bg-amber-100', color: 'text-amber-600' };
                  return { icon: AlertCircle, bg: 'bg-gray-100', color: 'text-gray-600' };
                };
                const { icon: Icon, bg, color } = getIconColor();

                return (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 ${bg} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{log.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Staff Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Staff Overview</h2>
            <p className="text-sm text-gray-500">Current capacity and availability</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            Manage Staff
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {isStaffLoadLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : staffLoad.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No staff data</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffLoad.map((staff) => {
              const isAvailable = staff.availabilityStatus === 'AVAILABLE';
              return (
                <div
                  key={staff.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{staff.name}</h3>
                        <p className="text-xs text-gray-500 capitalize">{staff.status.toLowerCase()}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isAvailable
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                    }`}>
                    {isAvailable ? 'Available' : 'Not Available'}
                  </span>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Today's Load</span>
                      <span className="font-semibold text-gray-900">{staff.load} / 5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(((Number(staff.load) || 0) / 5) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;