import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesQuery,
  useUpdateServiceMutation,
} from '@/api/service.api';
import type { CreateServicePayload, UpdateServicePayload } from '@/types/api';
import { Loader2, Pencil, Trash2, AlertCircle, Clock, Users, Plus } from 'lucide-react';

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
  };

  const handleChange = (field: keyof ServiceFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'durationMinutes' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: CreateServicePayload | UpdateServicePayload = {
      name: form.name.trim(),
      durationMinutes: form.durationMinutes,
      staffType: form.staffType.trim(),
    };

    if (!payload.name || !payload.staffType || !payload.durationMinutes) {
      setError('All fields are required.');
      return;
    }

    try {
      if (editingId) {
        await updateService({ id: editingId, body: payload });
      } else {
        await createService(payload as CreateServicePayload);
      }
      reset();
      await refetch();
    } catch (err) {
      setError('Could not save service.');
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteService(id);
      if (editingId === id) reset();
      await refetch();
    } catch (err) {
      setError('Could not delete service.');
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
            <Users className="h-8 w-8 text-teal-600" />
            Services
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Create and manage your offered services efficiently</p>
        </div>
        {(isLoading || isFetching) && <Loader2 className="h-5 w-5 animate-spin text-teal-600" />}
      </motion.div>

      {/* Main Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
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
              {editingId ? 'Edit Service' : 'New Service'}
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Service Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-all"
                placeholder="e.g., Consultation"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Duration (Minutes)</label>
              <input
                type="number"
                min={5}
                max={480}
                value={form.durationMinutes}
                onChange={(e) => handleChange('durationMinutes', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Staff Type</label>
              <select
                value={form.staffType}
                onChange={(e) => handleChange('staffType', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-all"
              >
                <option value="">Select staff type</option>
                {STAFF_SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
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
                  'Save Service'
                )}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={reset}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </motion.div>
          </form>
        </motion.div>

        {/* Services List */}
        <motion.div 
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Services List</h2>
            <motion.span 
              className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {services.length} items
            </motion.span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading services...
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No services yet. Create one to get started!</p>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div className="space-y-3">
                {services.map((svc, idx) => (
                  <motion.div
                    key={svc.id}
                    className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md hover:border-slate-300 transition-all bg-white group"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -10, opacity: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    whileHover={{ scale: 1.005 }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 mb-2 text-left">{svc.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {svc.durationMinutes}m
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-medium flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {svc.staffType}
                        </span>
                      </div>
                    </div>

                    <motion.div 
                      className="flex items-center gap-1 ml-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditingId(svc.id)}
                        disabled={isUpdating}
                        className="p-2 rounded-lg text-teal-600 hover:bg-teal-50 disabled:opacity-30 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </motion.button>

                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(svc.id)}
                        disabled={isDeleting}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30 transition-colors"
                        title="Delete"
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

export default ServicePage;
