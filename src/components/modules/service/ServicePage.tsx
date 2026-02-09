import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesQuery,
  useUpdateServiceMutation,
} from '@/api/service.api';
import { Button } from '@/components/ui/button';
import type { CreateServicePayload, UpdateServicePayload } from '@/types/api';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Clock,
  Loader2,
  Pencil,
  Plus,
  Shield,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface ServiceFormState {
  name: string;
  durationMinutes: number;
  staffType: string;
}

const initialForm: ServiceFormState = {
  name: '',
  durationMinutes: 30,
  staffType: '',
};

const STAFF_SERVICE_TYPES = [
  'DOCTOR',
  'NURSE',
  'RECEPTIONIST',
  'TECHNICIAN',
  'RADIOLOGIST',
  'PHARMACIST',
  'LAB_TECHNICIAN',
  'PHYSIOTHERAPIST',
  'DENTIST',
  'CARDIOLOGIST',
];

const ServicePage = () => {
  const { data, isLoading, isFetching, refetch } = useGetServicesQuery();
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const [form, setForm] = useState<ServiceFormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const services = useMemo(() => data?.data ?? [], [data]);

  useEffect(() => {
    if (editingId) {
      const current = services.find((s) => s.id === editingId);
      if (current) {
        setForm({
          name: current.name,
          durationMinutes: current.durationMinutes,
          staffType: current.staffType,
        });
      }
    } else {
      setForm(initialForm);
    }
  }, [editingId, services]);

  const reset = () => {
    setEditingId(null);
    setForm(initialForm);
    setError(null);
    setSuccess(null);
  };

  const handleChange = (field: keyof ServiceFormState, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const name = form.name.trim();
    const staffType = form.staffType.trim();
    const durationMinutes = Number(form.durationMinutes);

    if (!name || !staffType || !Number.isFinite(durationMinutes) || durationMinutes < 5) {
      setError('Please fill all fields correctly (duration ≥ 5 min).');
      return;
    }

    const payload: CreateServicePayload | UpdateServicePayload = {
      name,
      durationMinutes,
      staffType,
    };

    try {
      if (editingId) {
        await updateService({ id: editingId, body: payload }).unwrap();
        setSuccess('Service updated successfully!');
      } else {
        await createService(payload as CreateServicePayload).unwrap();
        setSuccess('Service created successfully!');
      }
      reset();
      await refetch();
    } catch (err: any) {
      setError(err?.data?.message || 'Operation failed. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    setError(null);
    setSuccess(null);
    try {
      await deleteService(id).unwrap();
      if (editingId === id) reset();
      setSuccess('Service deleted successfully');
      await refetch();
    } catch (err: any) {
      setError('Could not delete service.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden pb-10">
      <div className="relative z-10 px-4 py-6 md:px-6 lg:px-10">
        <div className="space-y-8 md:space-y-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-5"
          >
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                  <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-cyan-400" />
                </div>
                Service Management
              </h1>
              <p className="text-slate-400 mt-2 text-sm md:text-base">
                Create, update and organize your appointment services
              </p>
            </div>

            <div className="flex items-center gap-4">
              {(isLoading || isFetching) && (
                <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
              )}
              <span className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/60 px-4 py-2 rounded-xl text-cyan-300 text-sm font-medium">
                {services.length} Services
              </span>
            </div>
          </motion.div>

          {/* Main Content - Form + List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 w-full"
            >
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    {editingId ? (
                      <>
                        <Pencil className="h-6 w-6 text-cyan-400" />
                        Edit Service
                      </>
                    ) : (
                      <>
                        <Plus className="h-6 w-6 text-cyan-400" />
                        Add New Service
                      </>
                    )}
                  </h2>

                  {editingId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={reset}
                      className="text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 text-left">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Service Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. General Checkup"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Duration (minutes)</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
                      <input
                        type="number"
                        min={5}
                        value={form.durationMinutes}
                        onChange={(e) => handleChange('durationMinutes', Number(e.target.value))}
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Staff Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Staff Type</label>
                    <select
                      value={form.staffType}
                      onChange={(e) => handleChange('staffType', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none"
                    >
                      <option value="" className="bg-slate-900 text-slate-400">
                        Select staff type
                      </option>
                      {STAFF_SERVICE_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-slate-900">
                          {type
                            .replace(/_/g, ' ')
                            .split(' ')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                            .join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Messages */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                      >
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        {error}
                      </motion.div>
                    )}

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                      >
                        <Shield className="h-5 w-5 shrink-0" />
                        {success}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isCreating || isUpdating}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all"
                    >
                      {isCreating || isUpdating ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Saving...
                        </span>
                      ) : editingId ? (
                        'Update Service'
                      ) : (
                        'Create Service'
                      )}
                    </Button>

                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={reset}
                        className="py-6 px-10 border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Services List Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7 w-full"
            >
              <div className="relative bg-gradient-to-br from-slate-800/85 to-slate-900/85 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Users className="h-6 w-6 text-cyan-400" />
                  All Services
                </h2>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Loader2 className="h-10 w-10 animate-spin mb-4 text-cyan-400" />
                    <p>Loading services...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-40" />
                    <p className="text-lg">No services created yet.</p>
                    <p className="text-sm mt-2">Add your first service using the form.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[60vh] md:max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                    <AnimatePresence>
                      {services.map((service, index) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className="group bg-slate-900/50 border border-slate-700/60 rounded-xl md:rounded-2xl p-4 md:p-5 hover:border-cyan-500/40 transition-all backdrop-blur-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base md:text-lg font-semibold text-white mb-2 truncate text-left">
                                {service.name}
                              </h3>
                              <div className="flex flex-wrap gap-2 md:gap-3">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/70 rounded-full text-xs md:text-sm text-cyan-300 border border-cyan-500/20">
                                  <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                  {service.durationMinutes} min
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/70 rounded-full text-xs md:text-sm text-blue-300 border border-blue-500/20">
                                  <Users className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                  {service.staffType.replace(/_/g, ' ')}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
                              <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setEditingId(service.id)}
                                disabled={isUpdating || isDeleting}
                                className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-cyan-950/40 text-cyan-400 transition-colors"
                              >
                                <Pencil className="h-5 w-5" />
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(service.id)}
                                disabled={isDeleting}
                                className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-red-950/40 text-red-400 transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.8);
        }
      `}</style>
    </div>
  );
};

export default ServicePage;