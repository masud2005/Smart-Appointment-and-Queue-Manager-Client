import { useAppSelector } from '@/app/hook';
import {
  useGetDashboardSummaryQuery,
  useGetRecentActivityLogsQuery,
  useGetStaffLoadSummaryQuery,
} from '@/api/dashboard.api';
import { useGetAppointmentsWithDetailsQuery } from '@/api/appointment.api';
import { Calendar, Clock, CheckCircle, Activity, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: summaryData, isLoading: isSummaryLoading } = useGetDashboardSummaryQuery();
  const { data: activityData, isLoading: isActivityLoading } = useGetRecentActivityLogsQuery(8);
  const { data: staffLoadData, isLoading: isStaffLoadLoading } = useGetStaffLoadSummaryQuery();
  const { data: recentAppointments, isLoading: isRecentLoading } = useGetAppointmentsWithDetailsQuery({ status: 'SCHEDULED' });

  const summary = summaryData?.data;
  const staffLoad = staffLoadData?.data ?? [];
  const activities = activityData?.data ?? [];
  const appointments = recentAppointments?.data ?? [];

  const stats = [
    {
      title: 'Total Appointments',
      value: summary?.totalAppointmentsToday ?? 0,
      icon: Calendar,
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'In Queue',
      value: summary?.waitingQueueCount ?? 0,
      icon: Clock,
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Completed',
      value: summary?.completedToday ?? 0,
      icon: CheckCircle,
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Scheduled',
      value: summary?.scheduledToday ?? 0,
      icon: Activity,
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
        <p className="text-indigo-100">Here's what's happening with your appointments today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                {(isSummaryLoading) && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upcoming / Scheduled</h2>
            {isRecentLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          </div>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No scheduled appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 6).map((appt) => (
                <div key={appt.id} className="border border-gray-100 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition">
                  <div>
                    <p className="text-sm text-gray-500">{new Date(appt.dateTime).toLocaleString()}</p>
                    <p className="text-lg font-semibold text-gray-900">{appt.customerName}</p>
                    <p className="text-sm text-gray-600">Service: {appt.service?.name || appt.serviceId}</p>
                    <p className="text-sm text-gray-600">Staff: {appt.staff?.name || 'Auto-assigned'}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">{appt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            {isActivityLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          </div>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No activity yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((log) => (
                <div key={log.id} className="border border-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{log.time}</p>
                  <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                  <p className="text-sm text-gray-700">{log.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Staff Load</h2>
          {isStaffLoadLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
        </div>
        {staffLoad.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No staff load data.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-600">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Load</th>
                  <th className="pb-3">Availability</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffLoad.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="py-3 text-gray-700">{s.load}</td>
                    <td className="py-3 text-gray-700">{s.availabilityStatus}</td>
                    <td className="py-3 text-gray-700">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
