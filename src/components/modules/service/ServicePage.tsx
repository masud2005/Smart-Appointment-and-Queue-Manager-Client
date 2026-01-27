import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesQuery,
  useUpdateServiceMutation,
} from '@/api/service.api';
import type { CreateServicePayload, UpdateServicePayload } from '@/types/api';
import { Loader2, Pencil, Trash2, AlertCircle, Clock, Users } from 'lucide-react';

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
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">Services</h1>
          <p className="text-gray-600 mt-2">Create and manage your offered services efficiently.</p>
        </div>
        {(isLoading || isFetching) && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
      >
        <motion.div 
          className="lg:col-span-1 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 backdrop-blur-xl p-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {editingId ? '✏️ Edit' : '➕ New'} Service
            </motion.h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Clock className="h-6 w-6 text-blue-600" />
            </motion.div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-lg border-2 border-blue-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                placeholder="Consultation"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                min={5}
                max={480}
                value={form.durationMinutes}
                onChange={(e) => handleChange('durationMinutes', e.target.value)}
                className="w-full rounded-lg border-2 border-blue-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Staff Type</label>
              <input
                type="text"
                value={form.staffType}
                onChange={(e) => handleChange('staffType', e.target.value)}
                className="w-full rounded-lg border-2 border-blue-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                placeholder="Doctor"
              />
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
              <Button type="submit" disabled={isCreating || isUpdating} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg transition-all">
                {isCreating || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Service'}
              </Button>
              {editingId && (
                <Button variant="ghost" type="button" onClick={reset} className="text-gray-600">
                  Cancel
                </Button>
              )}
            </motion.div>
          </form>
        </motion.div>

        <motion.div 
          className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 backdrop-blur-xl p-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Services List</h2>
            <motion.span 
              className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {services.length} items
            </motion.span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No services yet. Create one!</p>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div className="space-y-3">
                {services.map((svc, idx) => (
                  <motion.div
                    key={svc.id}
                    className="border-2 border-blue-100 rounded-xl p-5 flex items-center justify-between hover:shadow-lg hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition duration-300 backdrop-blur-sm bg-white/50"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{svc.name}</h3>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                          <Clock className="h-4 w-4" /> {svc.durationMinutes} min
                        </span>
                        <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                          <Users className="h-4 w-4" /> {svc.staffType}
                        </span>
                      </div>
                    </div>
                    <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(svc.id)} disabled={isUpdating} className="hover:bg-blue-100 text-blue-600">
                          <Pencil className="h-5 w-5" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(svc.id)} disabled={isDeleting} className="hover:bg-red-100 text-red-600">
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

export default ServicePage;
