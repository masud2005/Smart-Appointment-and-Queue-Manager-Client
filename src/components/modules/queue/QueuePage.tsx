import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssignFromQueueMutation, useGetWaitingQueueQuery } from '@/api/queue.api';
import { useGetStaffQuery } from '@/api/staff.api';
import type { QueueAssignPayload } from '@/types/api';
import {
  Clock, Loader2, AlertCircle, Zap, Stethoscope, Users, Timer,
  ArrowRight, Sparkles, CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

const QueuePage = () => {
  const { data, isLoading, refetch } = useGetWaitingQueueQuery();
  const { data: staffData, isLoading: isStaffLoading } = useGetStaffQuery();
  const [assignFromQueue, { isLoading: isAssigning }] = useAssignFromQueueMutation();

  const [staffId, setStaffId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const waiting = useMemo(() => data?.data ?? [], [data]);
  const staff = useMemo(() => staffData?.data ?? [], [staffData]);

  const renderDateTime = (iso: string) => {
    try {
      return format(new Date(iso), 'MMM dd, yyyy • hh:mm a');
    } catch {
      return iso;
    }
  };

  const handleAssign = async () => {
    if (!staffId) {
      setError('Please select a staff member first.');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const payload: QueueAssignPayload = { staffId };
      await assignFromQueue(payload).unwrap();
      setSuccess('Appointment assigned successfully!');
      setStaffId('');
      await refetch();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to assign appointment.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* Animated background */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <motion.div
          animate={{ x: [0, 140, 0], y: [0, -140, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute -top-52 -left-52 w-[600px] h-[600px] bg-cyan-500/18 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{ x: [0, -120, 0], y: [0, 160, 0], scale: [1, 1.4, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-15%] right-[-20%] w-[700px] h-[700px] bg-orange-500/12 rounded-full blur-[180px]"
        />
      </div> */}

      <div className="relative z-10 min-h-screen p-6 lg:p-10">
        <div className=" space-y-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 " style={{ fontFamily: "'Sora', sans-serif" }}>
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                  <Sparkles className="h-8 w-8 text-cyan-400" />
                </div>
                Queue Management
              </h1>
              <p className="text-slate-400 mt-2 text-sm text-left"> Assign waiting patients to available staff in real-time</p>
            </div>

            <div className="flex items-center gap-4">
              {(isLoading || isAssigning || isStaffLoading) && (
                <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
              )}
              <span className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/60 px-4 py-2 rounded-xl text-cyan-300 text-sm font-medium">
                {waiting.length} Waiting
              </span>
            </div>
          </motion.div>

          {/* Header Section */}
          {/* <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                  <Sparkles className="h-8 w-8 text-cyan-400" />
                </div>
                Dashboard
              </h1>
              <p className="text-slate-400 mt-2 text-sm">Real-time overview of your clinic's performance</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-700/50">
                <Clock className="h-4 w-4 text-cyan-400" />
                {format(new Date(), 'EEEE, MMMM do, yyyy')}
              </div>
            </div>
          </motion.div> */}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                label: 'Total Waiting',
                value: waiting.length,
                color: 'cyan',
                gradient: 'from-cyan-500/20 to-blue-500/15'
              },
              {
                icon: Stethoscope,
                label: 'Available Staff',
                value: staff.filter(s => s.availabilityStatus === 'AVAILABLE').length,
                color: 'cyan',
                gradient: 'from-cyan-500/20 to-cyan-500/15'
              },
              {
                icon: Timer,
                label: 'Avg. Wait Time',
                value: waiting.length > 0 ? '~15m' : '—',
                color: 'orange',
                gradient: 'from-orange-500/20 to-amber-500/15'
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity`} />
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex items-center gap-5">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <stat.icon className={`h-7 w-7 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-8">

            {/* Quick Assign Panel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-4 relative"
            >
              <div className="absolute -inset-5 bg-gradient-to-br from-cyan-500/20 to-cyan-500/20 rounded-3xl blur-3xl opacity-70 h-fit" />
              <div className="relative bg-gradient-to-br from-slate-800/92 to-slate-900/92 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/20">
                    <Zap className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Quick Assign</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Assign to Staff</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
                      <select
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none"
                      >
                        <option value="">Select available staff</option>
                        {staff
                          .filter(s => s.availabilityStatus === 'AVAILABLE')
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} • {s.serviceType.replace(/_/g, ' ')}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                      >
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        {success}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    onClick={handleAssign}
                    disabled={isAssigning || isStaffLoading || !staffId}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 h-12 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/25 text-sm "
                  >
                    {isAssigning ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Assign Earliest Waiting
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-slate-400">
                    Assigns the <strong className="text-cyan-300">earliest waiting patient</strong> to the selected staff member.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Waiting Queue List */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-8 relative"
            >
              <div className="absolute -inset-5 bg-gradient-to-br from-orange-500/15 to-amber-500/15 rounded-3xl blur-3xl opacity-70 h-fit" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-4 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                      <Clock className="h-6 w-6 text-orange-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Waiting Queue</h2>
                  </div>
                  <span className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/60 px-4 py-2 rounded-xl text-orange-300 text-sm font-medium">
                    {waiting.length} in queue
                  </span>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 className="h-12 w-12 animate-spin mb-4 text-orange-400" />
                    <p className="text-lg">Loading queue...</p>
                  </div>
                ) : waiting.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    <Clock className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-xl font-medium mb-2">Queue is empty</p>
                    <p className="text-sm">No patients waiting at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence>
                      {waiting.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                          className="group relative"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl blur opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                          <div className="relative bg-slate-900/55 border border-slate-700/60 rounded-2xl p-5 hover:border-orange-500/40 transition-all backdrop-blur-sm">
                            <div className="flex items-center gap-5">
                              {/* Queue Position */}
                              <motion.div
                                className="flex flex-col items-center justify-center w-11 md:w-14 h-11 md:h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-300 font-bold shrink-0"
                                animate={{
                                  scale: [1, 1.06, 1],
                                  boxShadow: [
                                    '0 0 0 0 rgba(249, 115, 22, 0)',
                                    '0 0 0 12px rgba(249, 115, 22, 0.15)',
                                    '0 0 0 0 rgba(249, 115, 22, 0)'
                                  ]
                                }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                              >
                                <div className="text-[10px] md:text-xs text-orange-400/70 uppercase tracking-widest">POS</div>
                                <div className="text-xl">{item.queuePosition ?? '—'}</div>
                              </motion.div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-base font-semibold text-white truncate">
                                    {item.customerName}
                                  </p>
                                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    {renderDateTime(item.dateTime)}
                                  </span>
                                </div>

                                <div className="flex flex-wrap gap-2.5">
                                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/70 rounded-full text-sm text-cyan-300 border border-cyan-500/20">
                                    <Stethoscope className="h-4 w-4" />
                                    {item.service?.name || 'Unknown Service'}
                                  </div>
                                  <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-950/40 rounded-full text-sm text-orange-300 border border-orange-500/20">
                                    <Timer className="h-4 w-4" />
                                    {item.service?.durationMinutes || '?'} min
                                  </div>
                                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/70 rounded-full text-sm text-blue-300 border border-blue-500/20 capitalize">
                                    {item.service?.staffType?.replace(/_/g, ' ') || 'Any Staff'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.7);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.8);
        }
      `}</style>
    </div>
  );
};

export default QueuePage;