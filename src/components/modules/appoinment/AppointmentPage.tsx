import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  useCancelAppointmentMutation,
  useCompleteAppointmentMutation,
  useCreateAppointmentMutation,
  useGetAppointmentsWithDetailsQuery,
  useMarkNoShowMutation,
  useUpdateAppointmentMutation,
} from '@/api/appointment.api';
import { useGetServicesQuery } from '@/api/service.api';
import { useGetStaffQuery } from '@/api/staff.api';
import type {
  Appointment,
  AppointmentFilters,
  AppointmentStatus,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '@/types/api';
import { format } from 'date-fns';
import {
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  Pencil,
  Trash2,
  UserRound,
} from 'lucide-react';

const statusBadge: Record<AppointmentStatus, string> = {
  WAITING: 'bg-yellow-100 text-yellow-800',
  SCHEDULED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  NO_SHOW: 'bg-red-100 text-red-800',
};

const AppointmentPage = () => {
  const [filters, setFilters] = useState<AppointmentFilters>({});
  const { data, isLoading, refetch, isFetching } = useGetAppointmentsWithDetailsQuery(filters);
  const { data: servicesData } = useGetServicesQuery();
  const { data: staffData } = useGetStaffQuery();
  const [createAppointment, { isLoading: isCreating }] = useCreateAppointmentMutation();
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();
  const [completeAppointment] = useCompleteAppointmentMutation();
  const [markNoShow] = useMarkNoShowMutation();

  const [form, setForm] = useState<CreateAppointmentPayload>({
    customerName: '',
    dateTime: '',
    serviceId: '',
    staffId: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const services = useMemo(() => servicesData?.data ?? [], [servicesData]);
  const staff = useMemo(() => staffData?.data ?? [], [staffData]);
  const appointments = useMemo(() => data?.data ?? [], [data]);

  const handleFilterChange = (field: keyof AppointmentFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value || undefined }));
  };

  const handleChange = (field: keyof CreateAppointmentPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.customerName || !form.dateTime || !form.serviceId) {
      setError('Customer name, date/time, and service are required.');
      return;
    }

    try {
      if (editingId) {
        const payload: UpdateAppointmentPayload = {
          customerName: form.customerName,
          dateTime: form.dateTime,
          staffId: form.staffId || undefined,
        };
        await updateAppointment({ id: editingId, body: payload });
      } else {
        const payload: CreateAppointmentPayload = {
          customerName: form.customerName,
          dateTime: form.dateTime,
          serviceId: form.serviceId,
          staffId: form.staffId || undefined,
        };
        await createAppointment(payload);
      }
      setEditingId(null);
      setForm({ customerName: '', dateTime: '', serviceId: '', staffId: '' });
      await refetch();
    } catch (err) {
      setError('Could not save appointment.');
    }
  };

  const startEdit = (appt: Appointment) => {
    setEditingId(appt.id);
    setForm({
      customerName: appt.customerName,
      dateTime: appt.dateTime,
      serviceId: appt.serviceId,
      staffId: appt.staffId || '',
    });
  };

  const handleStatus = async (id: string, action: 'cancel' | 'complete' | 'noShow') => {
    try {
      if (action === 'cancel') await cancelAppointment(id);
      if (action === 'complete') await completeAppointment(id);
      if (action === 'noShow') await markNoShow(id);
      await refetch();
    } catch (err) {
      setError('Could not update status.');
    }
  };

  const renderDate = (iso: string) => {
    try {
      return format(new Date(iso), 'PPpp');
    } catch (e) {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Create, filter, and manage appointments.</p>
        </div>
        {(isLoading || isFetching) && <Loader2 className="h-5 w-5 animate-spin text-gray-500" />}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={filters.date || ''}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="WAITING">Waiting</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
          <select
            value={filters.staffId || ''}
            onChange={(e) => handleFilterChange('staffId', e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => refetch()} className="w-full">Apply</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Appointment' : 'New Appointment'}
            </h2>
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time (ISO)</label>
              <input
                type="datetime-local"
                value={form.dateTime ? form.dateTime.slice(0, 16) : ''}
                onChange={(e) => handleChange('dateTime', e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <select
                value={form.serviceId}
                onChange={(e) => handleChange('serviceId', e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select service</option>
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.name} ({svc.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Staff (optional)</label>
              <select
                value={form.staffId}
                onChange={(e) => handleChange('staffId', e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Auto assign</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Appointment'}
              </Button>
              {editingId && (
                <Button variant="ghost" type="button" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
            <span className="text-sm text-gray-500">{appointments.length} items</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No appointments yet. Create your first one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-sm transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <UserRound className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{renderDate(appt.dateTime)}</p>
                      <p className="text-lg font-semibold text-gray-900">{appt.customerName}</p>
                      <p className="text-sm text-gray-600">
                        Service: {appt.service?.name || appt.serviceId}
                      </p>
                      <p className="text-sm text-gray-600">
                        Staff: {appt.staff?.name || appt.staffId || 'Auto-assigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[appt.status]}`}>
                      {appt.status}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(appt)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatus(appt.id, 'complete')}
                      disabled={appt.status !== 'SCHEDULED'}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatus(appt.id, 'noShow')}
                      disabled={appt.status !== 'SCHEDULED'}
                    >
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatus(appt.id, 'cancel')}
                      disabled={appt.status === 'CANCELLED'}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
