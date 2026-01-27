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
import { Loader2, Pencil, Trash2, AlertCircle, Users, Plus, Check } from 'lucide-react';

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
  const [createStaff, { isLoading: isCreateLoading, error: createError }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: isUpdateLoading, error: updateError }] = useUpdateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();

  const [formData, setFormData] = useState<StaffFormState>(initialForm);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const staffMembers = useMemo(() => staffData?.data ?? [], [staffData]);
  const staffLoad = useMemo(() => loadData?.data ?? [], [loadData]);

  const handleCancel = () => {
    setEditingStaff(null);
    setFormData(initialForm);
  };

  const handleSubmit = async () => {
    const payload: CreateStaffPayload | UpdateStaffPayload = {
      name: formData.name.trim(),
      serviceType: formData.serviceType,
      dailyCapacity: formData.dailyCapacity,
      availabilityStatus: formData.availabilityStatus,
    };

    if (!payload.name || !payload.serviceType || !payload.dailyCapacity) {
      return;
    }

    try {
      if (editingStaff) {
        await updateStaff({ id: editingStaff.id, body: payload });
      } else {
        await createStaff(payload as CreateStaffPayload);
      }
      handleCancel();
      await refetch();
    } catch (err) {
      console.error('Error saving staff:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStaff(id);
      if (editingStaff?.id === id) handleCancel();
      await refetch();
    } catch (err) {
      console.error('Error deleting staff:', err);
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
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-8 font-sans text-slate-800">
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Staff Management</h1>
          </div>
          <p className="text-slate-600 text-left">Manage your staff members and their daily capacity</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Plus className="w-4 h-4 text-teal-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingStaff ? 'Edit Staff' : 'Add Staff Member'}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter staff name"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Service Type</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-10 transition-all"
                  >
                    <option value="">Select service type</option>
                    {STAFF_SERVICE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Daily Capacity</label>
                  <input
                    type="number"
                    value={formData.dailyCapacity}
                    onChange={(e) => setFormData({ ...formData, dailyCapacity: parseInt(e.target.value, 10) || 0 })}
                    placeholder="Enter daily capacity"
                    min="1"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Availability Status</label>
                  <div className="flex items-center gap-8 mt-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, availabilityStatus: 'AVAILABLE' })}
                      className={`flex items-center gap-3 group focus:outline-none transition-all ${formData.availabilityStatus === 'AVAILABLE' ? 'scale-105' : ''
                        }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all border-2 ${formData.availabilityStatus === 'AVAILABLE'
                          ? 'bg-emerald-100 border-emerald-500'
                          : 'bg-slate-100 border-slate-300 group-hover:border-slate-400'
                          }`}
                      >
                        <Check
                          className={`w-4 h-4 ${formData.availabilityStatus === 'AVAILABLE' ? 'text-emerald-600' : 'text-transparent'
                            }`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${formData.availabilityStatus === 'AVAILABLE' ? 'text-emerald-700' : 'text-slate-600'
                          }`}
                      >
                        Available
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, availabilityStatus: 'ON_LEAVE' })}
                      className={`flex items-center gap-3 group focus:outline-none transition-all ${formData.availabilityStatus === 'ON_LEAVE' ? 'scale-105' : ''
                        }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all border-2 ${formData.availabilityStatus === 'ON_LEAVE'
                          ? 'bg-red-100 border-red-500'
                          : 'bg-slate-100 border-slate-300 group-hover:border-slate-400'
                          }`}
                      >
                        <Check
                          className={`w-4 h-4 ${formData.availabilityStatus === 'ON_LEAVE' ? 'text-red-600' : 'text-transparent'
                            }`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${formData.availabilityStatus === 'ON_LEAVE' ? 'text-red-700' : 'text-slate-600'
                          }`}
                      >
                        On Leave
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isCreateLoading || isUpdateLoading}
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isCreateLoading || isUpdateLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : editingStaff ? (
                      'Update Staff'
                    ) : (
                      'Add Staff'
                    )}
                  </button>

                  {editingStaff && (
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {(createError || updateError) ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">
                      {(createError as any)?.data?.message ||
                        (updateError as any)?.data?.message ||
                        'An error occurred'}
                    </p>
                  </motion.div>
                ) : null}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Staff Members</h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                </div>
              ) : !staffMembers || staffMembers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-slate-500"
                >
                  <Users className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-center">No staff members added yet</p>
                  <p className="text-sm text-slate-400 mt-1">Create your first staff member using the form</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {staffMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{member.name}</h3>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="inline-block px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-medium">
                              {member.serviceType}
                            </span>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${member.availabilityStatus === 'AVAILABLE'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                              {member.availabilityStatus}
                            </span>
                            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                              Capacity: {member.dailyCapacity}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-700 hover:text-teal-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-700 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Daily Load</h2>

              {isLoadLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                </div>
              ) : !staffLoad || staffLoad.length === 0 ? (
                <div className="text-center text-slate-500 h-40 flex items-center justify-center">
                  <p>No staff load data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {staffLoad.map((staff) => {
                    const percentage = (staff.currentLoad / staff.dailyCapacity) * 100;
                    let barColor = 'bg-emerald-500';
                    let textColor = 'text-emerald-700';
                    let bgColor = 'bg-emerald-50';

                    if (percentage >= 80) {
                      barColor = 'bg-red-500';
                      textColor = 'text-red-700';
                      bgColor = 'bg-red-50';
                    } else if (percentage >= 50) {
                      barColor = 'bg-amber-500';
                      textColor = 'text-amber-700';
                      bgColor = 'bg-amber-50';
                    }

                    return (
                      <motion.div
                        key={staff.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-slate-900">{staff.name}</h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                            {staff.currentLoad}/{staff.dailyCapacity}
                          </div>
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className={`h-full ${barColor}`}
                          />
                        </div>

                        <div className="mt-2 text-xs text-slate-600">
                          Available: {Math.max(0, staff.dailyCapacity - staff.currentLoad)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;