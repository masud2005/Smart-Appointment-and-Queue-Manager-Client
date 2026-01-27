import { useMemo, useState } from 'react';
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
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';

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
      if (editingId === id) {
        reset();
      }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-gray-600">Manage staff members and their capacity.</p>
        </div>
        {(isLoading || isFetching || isLoadLoading) && (
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Staff' : 'New Staff'}
            </h2>
            <Plus className="h-5 w-5 text-indigo-600" />
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Farhan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
              <input
                type="text"
                value={form.serviceType}
                onChange={(e) => handleChange('serviceType', e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Doctor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Capacity</label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.dailyCapacity}
                onChange={(e) => handleChange('dailyCapacity', e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                value={form.availabilityStatus}
                onChange={(e) => handleChange('availabilityStatus', e.target.value as StaffAvailability)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="AVAILABLE">Available</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Staff'}
              </Button>
              {editingId && (
                <Button variant="ghost" type="button" onClick={reset}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Staff List</h2>
              <span className="text-sm text-gray-500">{staff.length} items</span>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading staff...
              </div>
            ) : staff.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>No staff yet. Add your first staff member.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-600">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Service Type</th>
                      <th className="pb-3">Daily Capacity</th>
                      <th className="pb-3">Availability</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {staff.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">{s.name}</td>
                        <td className="py-3 text-gray-700">{s.serviceType}</td>
                        <td className="py-3 text-gray-700">{s.dailyCapacity}</td>
                        <td className="py-3 text-gray-700">{s.availabilityStatus}</td>
                        <td className="py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(s)}
                              disabled={isUpdating}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(s.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Daily Load</h2>
              <span className="text-sm text-gray-500">{staffLoad.length} staff</span>
            </div>
            {isLoadLoading ? (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading load...
              </div>
            ) : staffLoad.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No staff load data.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-600">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Load</th>
                      <th className="pb-3">Available Slots</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {staffLoad.map((s: StaffWithLoad) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">{s.name}</td>
                        <td className="py-3 text-gray-700">
                          {s.currentLoad} / {s.dailyCapacity}
                        </td>
                        <td className="py-3 text-gray-700">{s.availableSlots}</td>
                        <td className="py-3 text-gray-700">
                          {s.isAtCapacity ? 'At Capacity' : 'Available'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
