import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useGetStaffQuery,
  useGetStaffWithLoadQuery,
  useUpdateStaffMutation,
} from '@/api/staff.api';
import type {
  CreateStaffPayload,
  Staff,
  StaffAvailability,
  StaffWithLoad,
  UpdateStaffPayload,
} from '@/types/api';
import { Loader2, Pencil, Trash2, AlertCircle, Users } from 'lucide-react';

interface StaffFormState {
  name: string;
  serviceType: string;
  dailyCapacity: number;
  availabilityStatus: StaffAvailability;
}

const initialForm: StaffFormState = {
  name: '',
  serviceType: '',
  dailyCapacity: 5,
  availabilityStatus: 'AVAILABLE',
};

const StaffPage = () => {
  const { data: staffData, isLoading, isFetching, refetch } = useGetStaffQuery();
  const { data: loadData, isLoading: isLoadLoading } = useGetStaffWithLoadQuery();
  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const [form, setForm] = useState<StaffFormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const staff = useMemo(() => staffData?.data ?? [], [staffData]);
  const staffLoad = useMemo(() => loadData?.data ?? [], [loadData]);

  const reset = () => {
    setEditingId(null);
    setForm(initialForm);
    setError(null);
  };

  const handleChange = (field: keyof StaffFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'dailyCapacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: CreateStaffPayload | UpdateStaffPayload = {
      name: form.name.trim(),
      serviceType: form.serviceType.trim(),
      dailyCapacity: form.dailyCapacity,
      availabilityStatus: form.availabilityStatus,
    };

    if (!payload.name || !payload.serviceType || !payload.dailyCapacity) {
      setError('All fields are required.');
      return;
    }

    try {
      if (editingId) {
        await updateStaff({ id: editingId, body: payload });
      } else {
        await createStaff(payload as CreateStaffPayload);
      }
      reset();
      await refetch();
    } catch (err) {
      setError('Could not save staff.');
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteStaff(id);
      if (editingId === id) reset();
      await refetch();
    } catch (err) {
      setError('Could not delete staff.');
    }
  };

  const startEdit = (s: Staff) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      serviceType: s.serviceType,
      dailyCapacity: s.dailyCapacity,
      availabilityStatus: s.availabilityStatus,
    });
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
          <h1 className="text-4xl font-bold text-teal-600">Staff Management</h1>
          <p className="text-gray-600 mt-2">Manage staff members and optimize their capacity.</p>
        </div>
        {(isLoading || isFetching || isLoadLoading) && (
          <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
        )}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
      >
        <motion.div 
          className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 backdrop-blur-xl p-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {editingId ? '✏️ Edit' : '➕ New'} Staff
            </motion.h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Users className="h-6 w-6 text-teal-600" />
            </motion.div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-lg border-2 border-emerald-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                placeholder="Farhan"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Service Type</label>
              <input
                type="text"
                value={form.serviceType}
                onChange={(e) => handleChange('serviceType', e.target.value)}
                className="w-full rounded-lg border-2 border-emerald-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                placeholder="Doctor"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Daily Capacity</label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.dailyCapacity}
                onChange={(e) => handleChange('dailyCapacity', e.target.value)}
                className="w-full rounded-lg border-2 border-emerald-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Availability</label>
              <select
                value={form.availabilityStatus}
                onChange={(e) => handleChange('availabilityStatus', e.target.value as StaffAvailability)}
                className="w-full rounded-lg border-2 border-emerald-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
              >
                <option value="AVAILABLE">Available</option>
                <option value="ON_LEAVE">On Leave</option>
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
              <Button type="submit" disabled={isCreating || isUpdating} className="w-full bg-teal-600 hover:shadow-lg transition-all">
                {isCreating || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Staff'}
              </Button>
              {editingId && (
                <Button variant="ghost" type="button" onClick={reset} className="text-gray-600">
                  Cancel
                </Button>
              )}
            </motion.div>
          </form>
        </motion.div>

        <motion.div className="lg:col-span-2 space-y-6">
          <motion.div 
            className="bg-white rounded-2xl shadow-sm border border-slate-200 backdrop-blur-xl p-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Staff List</h2>
              <motion.span 
                className="text-sm font-semibold text-teal-600 bg-slate-50 px-4 py-2 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                {staff.length} members
              </motion.span>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
              </div>
            ) : staff.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>No staff yet. Add your first member!</p>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div className="space-y-3">
                  {staff.map((s, idx) => (
                    <motion.div
                      key={s.id}
                      className="border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:shadow-lg hover:border-slate-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition duration-300 backdrop-blur-sm bg-white/50"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{s.name}</h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">{s.serviceType}</span>
                          <span className={`px-3 py-1 rounded-full font-medium ${
                            s.availabilityStatus === 'AVAILABLE' 
                              ? 'bg-emerald-100 text-slate-700' 
                              : 'bg-orange-100 text-slate-700'
                          }`}>
                            {s.availabilityStatus}
                          </span>
                          <span className="bg-blue-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                            Capacity: {s.dailyCapacity}
                          </span>
                        </div>
                      </div>
                      <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="ghost" size="sm" onClick={() => startEdit(s)} disabled={isUpdating} className="hover:bg-green-100 text-green-600">
                            <Pencil className="h-5 w-5" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} disabled={isDeleting} className="hover:bg-red-100 text-red-600">
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

          <motion.div 
            className="bg-white rounded-2xl shadow-sm border border-slate-200 backdrop-blur-xl p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Daily Load</h2>
              <motion.span 
                className="text-sm font-semibold text-teal-600 bg-slate-50 px-4 py-2 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                {staffLoad.length} staff
              </motion.span>
            </div>
            {isLoadLoading ? (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
              </div>
            ) : staffLoad.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No staff load data.</div>
            ) : (
              <AnimatePresence>
                <motion.div className="space-y-3">
                  {staffLoad.map((s: StaffWithLoad, idx: number) => {
                    const loadPercentage = (s.currentLoad / s.dailyCapacity) * 100;
                    return (
                      <motion.div
                        key={s.id}
                        className="border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-slate-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition duration-300 backdrop-blur-sm bg-white/50"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-bold text-gray-900">{s.name}</h4>
                          <motion.div
                            className={`px-4 py-2 rounded-full text-sm font-bold ${
                              s.isAtCapacity 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-green-100 text-green-700'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring' }}
                          >
                            {s.isAtCapacity ? '🔴 At Capacity' : '🟢 Available'}
                          </motion.div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              loadPercentage >= 80 
                                ? 'bg-red-600' 
                                : loadPercentage >= 50
                                ? 'bg-gradient-to-r from-yellow-600 to-orange-600'
                                : 'bg-gradient-to-r from-green-600 to-emerald-600'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${loadPercentage}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-3 text-sm font-semibold">
                          <span className="text-gray-700">{s.currentLoad} / {s.dailyCapacity} slots</span>
                          <span className="text-teal-600">+{s.availableSlots} available</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StaffPage;
