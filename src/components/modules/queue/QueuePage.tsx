import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssignFromQueueMutation, useGetWaitingQueueQuery } from '@/api/queue.api';
import { useGetStaffQuery } from '@/api/staff.api';
import type { QueueAssignPayload } from '@/types/api';
import { Clock, Loader2, AlertCircle, Zap, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';

const QueuePage = () => {
  const { data, isLoading, refetch } = useGetWaitingQueueQuery();
  const { data: staffData, isLoading: isStaffLoading } = useGetStaffQuery();
  const [assignFromQueue, { isLoading: isAssigning }] = useAssignFromQueueMutation();
  const [staffId, setStaffId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const waiting = useMemo(() => data?.data ?? [], [data]);
  const staff = useMemo(() => staffData?.data ?? [], [staffData]);

  const renderDateTime = (iso: string) => {
    try {
      return format(new Date(iso), 'MMM dd, yyyy, h:mm:ss a');
    } catch (e) {
      return iso;
    }
  };

  const handleAssign = async () => {
    if (!staffId) {
      setError('Select a staff member to assign.');
      return;
    }
    setError(null);
    try {
      const payload: QueueAssignPayload = { staffId };
      await assignFromQueue(payload).unwrap();
      setStaffId('');
      await refetch();
    } catch (e: any) {
      console.log(e);
      setError(e?.data?.message || "Assignment failed.");
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
            <Clock className="h-8 w-8 text-teal-600" />
            Queue Management
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Manage waiting appointments and assign to available staff</p>
        </div>
        {(isLoading || isAssigning) && <Loader2 className="h-5 w-5 animate-spin text-teal-600" />}
      </motion.div>

      {/* Main Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
      >
        {/* Quick Assign Section */}
        <motion.div
          className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-teal-50">
              <Zap className="h-5 w-5 text-teal-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Quick Assign</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Select Staff Member</label>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-all"
              >
                <option value="">Choose staff member</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.serviceType})
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

            <motion.button
              onClick={handleAssign}
              disabled={isAssigning || isStaffLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-teal-600 text-white px-4 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAssigning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Assigning...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 inline mr-2" />
                  Assign Earliest
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Waiting Queue List */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Waiting Queue</h2>
            <motion.span
              className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {waiting.length} waiting
            </motion.span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading queue...
            </div>
          ) : waiting.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No waiting appointments at the moment</p>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div className="space-y-3">
                {waiting.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    className="border border-slate-200 rounded-lg p-4 flex items-start justify-between hover:shadow-md hover:border-slate-300 transition-all bg-white group"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 10, opacity: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    whileHover={{ scale: 1.005 }}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <motion.div
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 font-bold text-teal-600 text-sm group-hover:bg-teal-100 transition-colors shrink-0"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        #{item.queuePosition ?? '-'}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col">
                          <p className="text-xs font-medium text-slate-500 mb-1 text-left">
                            {renderDateTime(item.dateTime)}
                          </p>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-slate-900">{item.customerName}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                            <Stethoscope className="h-3 w-3" />
                            {item.service?.name || 'Service'}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-medium">
                            {item.service?.durationMinutes || 0}m
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium capitalize">
                            {item.service?.staffType || 'Staff'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      className="flex items-center gap-2 ml-4"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Clock className="h-5 w-5 text-teal-600 shrink-0" />
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

export default QueuePage;