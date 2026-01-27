import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertCircle,
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
          <h1 className="text-4xl font-bold text-teal-600">Appointments</h1>
          <p className="text-gray-600 mt-2">Create, filter, and manage appointments with ease.</p>
        </div>
        {(isLoading || isFetching) && <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />}
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg border border-indigo-100 p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={filters.date || ''}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            className="w-full rounded-lg border-2 border-indigo-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full rounded-lg border-2 border-indigo-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/50"
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
          <label className="block text-sm font-bold text-gray-700 mb-2">Staff</label>
          <select
            value={filters.staffId || ''}
            onChange={(e) => handleFilterChange('staffId', e.target.value)}
            className="w-full rounded-lg border-2 border-indigo-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/50"
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
          <Button onClick={() => refetch()} className="w-full bg-gradient-to-r teal-600">Apply</Button>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        {/* Form */}
        <motion.div 
          className="lg:col-span-1 bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-sm border border-indigo-100 backdrop-blur-xl p-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              className="text-2xl font-bold bg-teal-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {editingId ? '✏️ Edit Appointment' : '➕ New Appointment'}
            </motion.h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Calendar className="h-6 w-6 text-indigo-600" />
            </motion.div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                className="w-full rounded-lg border-2 border-indigo-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/50"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date & Time</label>
              <input
                type="datetime-local"
                value={form.dateTime ? form.dateTime.slice(0, 16) : ''}
                onChange={(e) => handleChange('dateTime', e.target.value)}
                className="w-full rounded-lg border-2 border-indigo-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Service</label>
              <select
                value={form.serviceId}
                onChange={(e) => handleChange('serviceId', e.target.value)}
                className="w-full rounded-lg border-2 border-indigo-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/50"
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
              <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Staff (optional)</label>
              <select
                value={form.staffId}
                onChange={(e) => handleChange('staffId', e.target.value)}
                className="w-full rounded-lg border-2 border-indigo-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/50"
              >
                <option value="">Auto assign</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button type="submit" disabled={isCreating || isUpdating} className="w-full bg-gradient-to-r teal-600 hover:shadow-lg transition-all">
                {isCreating || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Appointment'}
              </Button>
              {editingId && (
                <Button variant="ghost" type="button" onClick={() => setEditingId(null)} className="text-gray-600">
                  Cancel
                </Button>
              )}
            </motion.div>
          </form>
        </motion.div>

        {/* List */}
        <motion.div 
          className="lg:col-span-2 bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-sm border border-indigo-100 backdrop-blur-xl p-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-teal-600 bg-clip-text text-transparent">Appointments List</h2>
            <motion.span 
              className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {appointments.length} items
            </motion.span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No appointments yet. Create one!</p>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div className="space-y-3">
                {appointments.map((appt, idx) => (
                  <motion.div
                    key={appt.id}
                    className="border-2 border-indigo-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-lg hover:border-indigo-200 hover:bg-gradient-to-r hover:from-indigo-50 to-purple-50 transition duration-300 backdrop-blur-sm bg-white/50"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="bg-gradient-to-br teal-600 p-4 rounded-xl shadow-lg"
                        whileHover={{ scale: 1.05 }}
                      >
                        <UserRound className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <motion.p 
                          className="text-xs font-bold text-indigo-600 uppercase tracking-wide"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {renderDate(appt.dateTime)}
                        </motion.p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{appt.customerName}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm">
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                            {appt.service?.name || appt.serviceId}
                          </span>
                          <span className="bg-blue-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                            {appt.staff?.name || 'Auto'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.div 
                      className="flex items-center gap-2 flex-wrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${statusBadge[appt.status]}`}>
                        {appt.status}
                      </span>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(appt)} className="hover:bg-blue-100 text-teal-600">
                          <Pencil className="h-5 w-5" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="sm" onClick={() => handleStatus(appt.id, 'complete')} disabled={appt.status !== 'SCHEDULED'} className="hover:bg-green-100 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="sm" onClick={() => handleStatus(appt.id, 'noShow')} disabled={appt.status !== 'SCHEDULED'} className="hover:bg-yellow-100 text-yellow-600">
                          <Clock className="h-5 w-5" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="sm" onClick={() => handleStatus(appt.id, 'cancel')} disabled={appt.status === 'CANCELLED'} className="hover:bg-red-100 text-red-600">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentPage;
