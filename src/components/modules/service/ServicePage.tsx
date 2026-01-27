import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesQuery,
  useUpdateServiceMutation,
} from '@/api/service.api';
import type {
  CreateServicePayload,
  UpdateServicePayload,
} from '@/types/api';
import { Plus, Loader2, Pencil, Trash2 } from 'lucide-react';

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
      if (editingId === id) {
        reset();
      }
      await refetch();
    } catch (err) {
      setError('Could not delete service.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage your offered services.</p>
        </div>
        {(isLoading || isFetching) && <Loader2 className="h-5 w-5 animate-spin text-gray-500" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Service' : 'New Service'}
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
                placeholder="Consultation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                min={5}
                max={480}
                value={form.durationMinutes}
                onChange={(e) => handleChange('durationMinutes', e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff Type</label>
              <input
                type="text"
                value={form.staffType}
                onChange={(e) => handleChange('staffType', e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Doctor"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Service'}
              </Button>
              {editingId && (
                <Button variant="ghost" type="button" onClick={reset}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Service List</h2>
            <span className="text-sm text-gray-500">{services.length} items</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading services...
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No services yet. Create your first service.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-600">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Staff Type</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {services.map((svc) => (
                    <tr key={svc.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">{svc.name}</td>
                      <td className="py-3 text-gray-700">{svc.durationMinutes} min</td>
                      <td className="py-3 text-gray-700">{svc.staffType}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingId(svc.id)}
                            disabled={isUpdating}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(svc.id)}
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
      </div>
    </div>
  );
};

export default ServicePage;
