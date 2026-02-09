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
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const statusBadge: Record<AppointmentStatus, { bg: string; text: string; border: string; gradient: string }> = {
  WAITING: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/20',
    gradient: 'from-orange-500/20 to-amber-500/20'
  },
  SCHEDULED: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
    gradient: 'from-cyan-500/20 to-blue-500/20'
  },
  COMPLETED: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    gradient: 'from-emerald-500/20 to-teal-500/20'
  },
  CANCELLED: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-600/20',
    gradient: 'from-slate-500/20 to-slate-600/20'
  },
  NO_SHOW: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    gradient: 'from-red-500/20 to-rose-500/20'
  },
};

const AppointmentPage = () => {
  const [filters, setFilters] = useState<AppointmentFilters>({});
  const { data, isLoading, refetch } = useGetAppointmentsWithDetailsQuery(filters);
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
    <div className="min-h-screen bg-[#0a0e27] p-6 space-y-8">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        {/* <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl">
              <Calendar className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                Appointments
              </h1>
              <p className="text-slate-400 mt-1 text-sm">Create, filter, and manage all appointments</p>
            </div>
          </div>
          {(isLoading || isFetching) && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-6 w-6 text-cyan-400" />
            </motion.div>
          )}
        </motion.div> */}
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-left"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Sora', sans-serif" }}>
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                <Calendar className="h-8 w-8 text-cyan-400" />
              </div>
              Appointments
            </h1>
            <p className="text-slate-400 mt-2 text-sm">Create, filter, and manage all appointments</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-700/50">
              <Clock className="h-4 w-4 text-cyan-400" />
              {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          className="relative group mb-8"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-50" />
          <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                <Filter className="h-5 w-5 text-cyan-400" />
              </div>
              <p className="text-sm font-bold text-white uppercase tracking-wider">Filter Appointments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Date</label>
                <input
                  type="date"
                  value={filters.date || ''}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
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
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Staff</label>
                <select
                  value={filters.staffId || ''}
                  onChange={(e) => handleFilterChange('staffId', e.target.value)}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
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
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/25 text-sm"
                >
                  Apply Filter
                </motion.button>
              </div>
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
            className="lg:col-span-1 relative group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 rounded-2xl blur opacity-50" />
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/20">
                  <Plus className="h-5 w-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {editingId ? 'Edit Appointment' : 'New Appointment'}
                </h2>
              </div>

              <form className="space-y-4 text-left" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Customer Name
                  </label>
                  <div className="relative group/input">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) => handleChange('customerName', e.target.value)}
                      className="w-full pl-12 pr-4 rounded-xl border border-slate-700/50 bg-slate-900/50 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Date & Time
                  </label>
                  <div className="relative group/input">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                    <input
                      type="datetime-local"
                      value={form.dateTime ? form.dateTime.slice(0, 16) : ''}
                      onChange={(e) => handleChange('dateTime', e.target.value)}
                      className="w-full pl-12 pr-4 rounded-xl border border-slate-700/50 bg-slate-900/50 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Service
                  </label>
                  <div className="relative group/input">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                    <select
                      value={form.serviceId}
                      onChange={(e) => handleChange('serviceId', e.target.value)}
                      className="w-full pl-12 pr-4 rounded-xl border border-slate-700/50 bg-slate-900/50 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                    >
                      <option value="">Select service</option>
                      {services.map((svc) => (
                        <option key={svc.id} value={svc.id}>
                          {svc.name} ({svc.durationMinutes}m)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Staff (Optional)
                  </label>
                  <div className="relative group/input">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                    <select
                      value={form.staffId}
                      onChange={(e) => handleChange('staffId', e.target.value)}
                      className="w-full pl-12 pr-4 rounded-xl border border-slate-700/50 bg-slate-900/50 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                    >
                      <option value="">Auto assign</option>
                      {staff.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <motion.div
                    className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-start gap-3 text-sm"
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <motion.div
                  className="flex items-center gap-3 pt-2"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/25 text-sm"
                  >
                    {isCreating || isUpdating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      'Save Appointment'
                    )}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-900/50 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* List */}
          <motion.div
            className="lg:col-span-2 relative group"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-50" />
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 md:p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                    <BarChart3 className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                    Appointments List
                  </h2>
                </div>
                <motion.span
                  className="text-sm font-bold text-slate-400 bg-slate-900/50 border border-slate-700/50 px-4 py-2 rounded-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  {appointments.length} items
                </motion.span>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-16 text-slate-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-2 text-cyan-400" />
                  <span className="text-slate-400">Loading appointments...</span>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20 text-slate-600" />
                  <p className="text-sm text-slate-400">No appointments yet. Create one to get started!</p>
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {appointments.map((appt, idx) => (
                      <motion.div
                        key={appt.id}
                        className="relative group/item"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{ delay: idx * 0.02 }}
                      >
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${statusBadge[appt.status].gradient} rounded-xl blur opacity-0 group-hover/item:opacity-50 transition duration-300`} />
                        <div className="relative bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group-hover/item:border-cyan-500/30 transition-all">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${statusBadge[appt.status].gradient} backdrop-blur-sm`}>
                              <User className={`h-5 w-5 ${statusBadge[appt.status].text}`} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                {renderDate(appt.dateTime)}
                              </p>
                              <p className="text-base font-bold text-white mb-2 text-left">{appt.customerName}</p>
                              <div className="flex flex-wrap gap-2">
                                <span className="text-xs px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 font-medium">
                                  {appt.service?.name || appt.serviceId}
                                </span>
                                <span className="text-xs px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 font-medium">
                                  {appt.staff?.name || 'Auto'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <motion.div
                            className="flex items-center gap-2 flex-wrap sm:flex-nowrap"
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
                              className="p-2.5 rounded-xl text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatus(appt.id, 'complete')}
                              disabled={appt.status !== 'SCHEDULED'}
                              className="p-2.5 rounded-xl text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              title="Complete"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatus(appt.id, 'noShow')}
                              disabled={appt.status !== 'SCHEDULED'}
                              className="p-2.5 rounded-xl text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              title="No Show"
                            >
                              <Clock className="h-4 w-4" />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatus(appt.id, 'cancel')}
                              disabled={appt.status === 'CANCELLED'}
                              className="p-2.5 rounded-xl text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              title="Cancel"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AppointmentPage;