import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  User,
  AlertCircle,
  Plus,
} from 'lucide-react';

const statusBadge: Record<AppointmentStatus, { bg: string; text: string; border: string }> = {
  WAITING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  SCHEDULED: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  CANCELLED: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  NO_SHOW: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
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
      className="min-h-screen bg-gray-50/50 p-6 space-y-8 font-sans text-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-teal-600" />
            Appointments
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Create, filter, and manage your appointments</p>
        </div>
        {(isLoading || isFetching) && <Loader2 className="h-5 w-5 animate-spin text-teal-600" />}
      </motion.div>

      {/* Filters Section */}
      <motion.div 
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-sm font-semibold text-slate-600 mb-4">Filter appointments:</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Date</label>
            <input
              type="date"
              value={filters.date || ''}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-all"
            >
              <option value="">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="WAITING">Waiting</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Staff</label>
            <select
              value={filters.staffId || ''}
              onChange={(e) => handleFilterChange('staffId', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-all"
            >
              <option value="">All Staff</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <motion.button 
              onClick={() => refetch()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-teal-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all hover:shadow-md text-sm"
            >
              Apply Filter
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        {/* Form */}
        <motion.div 
          className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-teal-50">
              <Plus className="h-5 w-5 text-teal-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? 'Edit Appointment' : 'New Appointment'}
            </h2>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Customer Name</label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Date & Time</label>
              <input
                type="datetime-local"
                value={form.dateTime ? form.dateTime.slice(0, 16) : ''}
                onChange={(e) => handleChange('dateTime', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Service</label>
              <select
                value={form.serviceId}
                onChange={(e) => handleChange('serviceId', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-all"
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
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Staff (Optional)</label>
              <select
                value={form.staffId}
                onChange={(e) => handleChange('staffId', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-all"
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
                className="bg-red-50 border border-red-200 text-red-700 px-3 py-3 rounded-lg flex items-start gap-2 text-sm"
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
            
            <motion.div 
              className="flex items-center gap-2 pt-2"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <button 
                type="submit" 
                disabled={isCreating || isUpdating}
                className="flex-1 bg-teal-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 text-sm"
              >
                {isCreating || isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Appointment'
                )}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </motion.div>
          </form>
        </motion.div>

        {/* List */}
        <motion.div 
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Appointments List</h2>
            <motion.span 
              className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {appointments.length} items
            </motion.span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No appointments yet. Create one to get started!</p>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div className="space-y-3">
                {appointments.map((appt, idx) => (
                  <motion.div
                    key={appt.id}
                    className="border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-md hover:border-slate-300 transition-all bg-white group"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -10, opacity: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    whileHover={{ scale: 1.005 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-teal-50 group-hover:bg-teal-100 transition-colors">
                        <User className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                          {renderDate(appt.dateTime)}
                        </p>
                        <p className="text-sm font-bold text-slate-900">{appt.customerName}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                            {appt.service?.name || appt.serviceId}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium">
                            {appt.staff?.name || 'Auto'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="flex items-center gap-1 flex-wrap sm:flex-nowrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusBadge[appt.status].bg} ${statusBadge[appt.status].text} ${statusBadge[appt.status].border}`}>
                        {appt.status}
                      </span>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startEdit(appt)}
                        className="p-2 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatus(appt.id, 'complete')}
                        disabled={appt.status !== 'SCHEDULED'}
                        className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Complete"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatus(appt.id, 'noShow')}
                        disabled={appt.status !== 'SCHEDULED'}
                        className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="No Show"
                      >
                        <Clock className="h-4 w-4" />
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatus(appt.id, 'cancel')}
                        disabled={appt.status === 'CANCELLED'}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Cancel"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
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
