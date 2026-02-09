import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  UpdateStaffPayload,
} from '@/types/api';
import {
  Loader2, Pencil, Trash2, AlertCircle, Users, Plus, Check, X,
  Clock, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const StaffPage = () => {
  const { data: staffData, isLoading, refetch } = useGetStaffQuery();
  const { data: loadData, isLoading: isLoadLoading } = useGetStaffWithLoadQuery();
  const [createStaff, { isLoading: isCreateLoading }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: isUpdateLoading }] = useUpdateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();

  const [formData, setFormData] = useState<StaffFormState>(initialForm);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const staffMembers = useMemo(() => staffData?.data ?? [], [staffData]);
  const staffLoad = useMemo(() => loadData?.data ?? [], [loadData]);

  const handleCancel = () => {
    setEditingStaff(null);
    setFormData(initialForm);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    const name = formData.name.trim();
    const serviceType = formData.serviceType.trim();
    const dailyCapacity = Number(formData.dailyCapacity);

    if (!name || !serviceType || !Number.isFinite(dailyCapacity) || dailyCapacity < 1) {
      setError('Please fill all required fields correctly.');
      return;
    }

    const payload: CreateStaffPayload | UpdateStaffPayload = {
      name,
      serviceType,
      dailyCapacity,
      availabilityStatus: formData.availabilityStatus,
    };

    try {
      if (editingStaff) {
        await updateStaff({ id: editingStaff.id, body: payload }).unwrap();
        setSuccess('Staff member updated successfully!');
      } else {
        await createStaff(payload as CreateStaffPayload).unwrap();
        setSuccess('Staff member added successfully!');
      }
      handleCancel();
      await refetch();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to save staff member.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    setError(null);
    setSuccess(null);
    try {
      await deleteStaff(id).unwrap();
      if (editingStaff?.id === id) handleCancel();
      setSuccess('Staff member deleted successfully');
      await refetch();
    } catch (err: any) {
      setError('Failed to delete staff member.');
    }
  };

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      serviceType: staff.serviceType,
      dailyCapacity: staff.dailyCapacity,
      availabilityStatus: staff.availabilityStatus,
    });
    setError(null);
  };

  return (
    <div className="min-h-screen  relative overflow-hidden">
      <div className="relative z-10 min-h-screen p-6 lg:p-10">
        <div className="space-y-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                  <Users className="h-8 w-8 text-cyan-400" />
                </div>
                Staff Management
              </h1>
              <p className="text-slate-400 mt-2 text-sm"> Manage team members, capacity and availability in real-time</p>
            </div>

            <div className="flex items-center gap-4">
              {(isLoading || isLoadLoading) && (
                <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
              )}
              <span className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/60 px-4 py-2 rounded-xl text-cyan-300 text-sm font-medium">
                {staffMembers.length} Members
              </span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute -inset-5rounded-3xl blur-3xl opacity-70" />

              <div className="relative bg-gradient-to-br from-slate-800/92 to-slate-900/92 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-5 lg:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    {editingStaff ? (
                      <Pencil className="h-6 w-6 text-cyan-400" />
                    ) : (
                      <Plus className="h-6 w-6 text-cyan-400" />
                    )}
                    {editingStaff ? 'Edit Staff Member' : 'Add New Staff'}
                  </h2>

                  {editingStaff && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancel}
                      className="text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                <div className="space-y-6 text-left">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Ayesha Rahman"
                      className="w-full px-5 py-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>

                  {/* Service Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Service Type</label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none"
                    >
                      <option value="" className="bg-slate-900 text-slate-400">Select type</option>
                      {STAFF_SERVICE_TYPES.map(type => (
                        <option key={type} value={type} className="bg-slate-900">
                          {type.replace(/_/g, ' ').split(' ')
                            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                            .join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Daily Capacity */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Service Type</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
                      <input
                        type="number"
                        min={1}
                        value={formData.dailyCapacity}
                        onChange={(e) => setFormData({ ...formData, dailyCapacity: parseInt(e.target.value) || 1 })}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Availability Status</label>
                    <div className="flex flex-wrap gap-6 mt-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, availabilityStatus: 'AVAILABLE' })}
                        className={`flex items-center gap-3 transition-all ${formData.availabilityStatus === 'AVAILABLE' ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${formData.availabilityStatus === 'AVAILABLE'
                          ? 'bg-emerald-500/20 border-emerald-400'
                          : 'bg-slate-700/50 border-slate-600'
                          }`}>
                          <Check className={`h-4 w-4 ${formData.availabilityStatus === 'AVAILABLE' ? 'text-emerald-400' : 'text-transparent'}`} />
                        </div>
                        <span className={`font-medium ${formData.availabilityStatus === 'AVAILABLE' ? 'text-emerald-300' : 'text-slate-400'}`}>
                          Available
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, availabilityStatus: 'ON_LEAVE' })}
                        className={`flex items-center gap-3 transition-all ${formData.availabilityStatus === 'ON_LEAVE' ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${formData.availabilityStatus === 'ON_LEAVE'
                          ? 'bg-red-500/20 border-red-400'
                          : 'bg-slate-700/50 border-slate-600'
                          }`}>
                          <Check className={`h-4 w-4 ${formData.availabilityStatus === 'ON_LEAVE' ? 'text-red-400' : 'text-transparent'}`} />
                        </div>
                        <span className={`font-medium ${formData.availabilityStatus === 'ON_LEAVE' ? 'text-red-300' : 'text-slate-400'}`}>
                          On Leave
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                      >
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        {error}
                      </motion.div>
                    )}

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                      >
                        <Zap className="h-5 w-5 shrink-0" />
                        {success}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      onClick={handleSubmit}
                      disabled={isCreateLoading || isUpdateLoading}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all"
                    >
                      {isCreateLoading || isUpdateLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Saving...
                        </span>
                      ) : editingStaff ? 'Update Staff' : 'Add Staff Member'}
                    </Button>

                    {editingStaff && (
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="px-8 py-6 border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* List + Load Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="lg:col-span-7 space-y-8"
            >
              {/* Staff List */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-3xl blur-2xl opacity-60" />

                <div className="relative bg-gradient-to-br from-slate-800/88 to-slate-900/88 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Users className="h-6 w-6 text-cyan-400" />
                    Team Members
                  </h2>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <Loader2 className="h-10 w-10 animate-spin mb-4 text-cyan-400" />
                      <p>Loading team...</p>
                    </div>
                  ) : staffMembers.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                      <Users className="h-16 w-16 mx-auto mb-4 opacity-40" />
                      <p className="text-lg">No staff members yet</p>
                      <p className="text-sm mt-2">Add team members using the form on the left</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                      <AnimatePresence>
                        {staffMembers.map((member) => (
                          <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group bg-slate-900/55 border border-slate-700/60 rounded-2xl p-5 hover:border-cyan-500/40 transition-all backdrop-blur-sm"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-white mb-2 truncate">
                                  {member.name}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/70 rounded-full text-xs text-cyan-300 border border-cyan-500/20">
                                    <Zap className="h-4 w-4" />
                                    {member.serviceType.replace(/_/g, ' ')}
                                  </div>
                                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${member.availabilityStatus === 'AVAILABLE'
                                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                                    : 'bg-red-950/40 border-red-500/30 text-red-300'
                                    }`}>
                                    <Check className="h-4 w-4" />
                                    {member.availabilityStatus}
                                  </div>
                                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/70 rounded-full text-xs text-blue-300 border border-blue-500/20">
                                    Capacity: {member.dailyCapacity}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.92 }}
                                  onClick={() => handleEdit(member)}
                                  className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-cyan-950/50 text-cyan-400 transition-colors"
                                >
                                  <Pencil className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.92 }}
                                  onClick={() => handleDelete(member.id)}
                                  className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-red-950/50 text-red-400 transition-colors"
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
              </div>

              {/* Daily Load */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-3xl blur-2xl opacity-60" />

                <div className="relative bg-gradient-to-br from-slate-800/88 to-slate-900/88 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-cyan-400" />
                    Daily Workload Overview
                  </h2>

                  {isLoadLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <Loader2 className="h-10 w-10 animate-spin mb-4 text-cyan-400" />
                      <p>Loading workload data...</p>
                    </div>
                  ) : staffLoad.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                      <Clock className="h-16 w-16 mx-auto mb-4 opacity-40" />
                      <p className="text-lg">No workload data available</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {staffLoad.map((staff) => {
                        const percentage = staff.dailyCapacity > 0
                          ? (staff.currentLoad / staff.dailyCapacity) * 100
                          : 0;

                        let barColor = 'bg-emerald-500';
                        let textColor = 'text-emerald-300';
                        let bgColor = 'bg-emerald-950/30';

                        if (percentage >= 80) {
                          barColor = 'bg-red-500';
                          textColor = 'text-red-300';
                          bgColor = 'bg-red-950/30';
                        } else if (percentage >= 50) {
                          barColor = 'bg-amber-500';
                          textColor = 'text-amber-300';
                          bgColor = 'bg-amber-950/30';
                        }

                        return (
                          <motion.div
                            key={staff.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 hover:border-cyan-500/30 transition-all"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-white truncate max-w-[60%]">
                                {staff.name}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                                {staff.currentLoad} / {staff.dailyCapacity}
                              </span>
                            </div>

                            <div className="w-full bg-slate-800/70 rounded-full h-3 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(percentage, 100)}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`h-full ${barColor} transition-all`}
                              />
                            </div>

                            <div className="mt-3 flex justify-between text-xs">
                              <span className="text-slate-400">
                                Available slots: {Math.max(0, staff.dailyCapacity - staff.currentLoad)}
                              </span>
                              <span className={textColor}>
                                {percentage.toFixed(0)}% utilized
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;