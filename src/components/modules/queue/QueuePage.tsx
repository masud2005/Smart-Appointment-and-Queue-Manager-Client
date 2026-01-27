import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAssignFromQueueMutation, useGetWaitingQueueQuery } from '@/api/queue.api';
import { useGetStaffQuery } from '@/api/staff.api';
import type { QueueAssignPayload } from '@/types/api';
import { Clock, Loader2, AlertCircle, Zap } from 'lucide-react';

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
      setStaffId('');
      await refetch();
    } catch (e) {
      setError('Assignment failed.');
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
          <h1 className="text-4xl font-bold bg-linear-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Queue Management</h1>
          <p className="text-gray-600 mt-2">Efficiently manage waiting appointments and assign to available staff.</p>
        </div>
        {(isLoading || isAssigning) && <Loader2 className="h-5 w-5 animate-spin text-orange-600" />}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
      >
        <motion.div 
          className="lg:col-span-1 bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 backdrop-blur-xl p-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              className="text-2xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ⚡ Quick Assign
            </motion.h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="h-6 w-6 text-orange-600" />
            </motion.div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Staff</label>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full rounded-lg border-2 border-orange-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/50"
              >
                <option value="">Choose staff</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.serviceType})
                  </option>
                ))}
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
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                onClick={handleAssign} 
                disabled={isAssigning || isStaffLoading} 
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-lg transition-all text-lg py-6"
              >
                {isAssigning ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Assign Earliest
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="lg:col-span-2 bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 backdrop-blur-xl p-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Waiting Queue</h2>
            <motion.span 
              className="text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {waiting.length} waiting
            </motion.span>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
            </div>
          ) : waiting.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No waiting appointments.</p>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div className="space-y-3">
                {waiting.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    className="border-2 border-orange-100 rounded-xl p-5 flex items-center justify-between hover:shadow-lg hover:border-orange-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition duration-300 backdrop-blur-sm bg-white/50 group"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex-1">
                      <motion.div 
                        className="flex items-center gap-3 mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <motion.span 
                          className="text-2xl font-bold text-orange-600 bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          #{item.queuePosition ?? '-'}
                        </motion.span>
                        <div>
                          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">{item.dateTime}</p>
                          <p className="text-lg font-bold text-gray-900">{item.customerName}</p>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold"
                        whileHover={{ scale: 1.05 }}
                      >
                        📋 {item.serviceId}
                      </motion.div>
                    </div>
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Clock className="h-6 w-6 text-orange-600" />
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

export default QueuePage;
