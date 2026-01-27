import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAssignFromQueueMutation, useGetWaitingQueueQuery } from '@/api/queue.api';
import { useGetStaffQuery } from '@/api/staff.api';
import type { QueueAssignPayload } from '@/types/api';
import { Clock, Loader2, Users } from 'lucide-react';

const QueuePage = () => {
  const { data, isLoading, refetch } = useGetWaitingQueueQuery();
  const { data: staffData, isLoading: isStaffLoading } = useGetStaffQuery();
  const [assignFromQueue, { isLoading: isAssigning }] = useAssignFromQueueMutation();
  const [staffId, setStaffId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const waiting = useMemo(() => data?.data ?? [], [data]);
  const staff = useMemo(() => staffData?.data ?? [], [staffData]);

  const handleAssign = async () => {
    if (!staffId) {
      setError('Select a staff member to assign.');
      return;
    }
    setError(null);
    try {
      const payload: QueueAssignPayload = { staffId };
      await assignFromQueue(payload).unwrap();
      await refetch();
    } catch (e) {
      setError('Assignment failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue</h1>
          <p className="text-gray-600">Manage waiting appointments and assign to staff.</p>
        </div>
        {(isLoading || isAssigning) && <Loader2 className="h-5 w-5 animate-spin text-gray-500" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Assign</h2>
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Staff</label>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose staff</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.serviceType})
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button onClick={handleAssign} disabled={isAssigning || isStaffLoading} className="w-full">
              {isAssigning ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assign Earliest'}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Waiting List</h2>
            <span className="text-sm text-gray-500">{waiting.length} waiting</span>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading queue...
            </div>
          ) : waiting.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No waiting appointments.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {waiting.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-100 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition"
                >
                  <div>
                    <p className="text-sm text-gray-500">#{item.queuePosition ?? '-'} · {item.dateTime}</p>
                    <p className="text-lg font-semibold text-gray-900">{item.customerName}</p>
                    <p className="text-sm text-gray-600">Service: {item.serviceId}</p>
                  </div>
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueuePage;
