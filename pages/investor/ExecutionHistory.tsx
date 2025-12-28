import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { 
  Clock, 
  Download, 
  RotateCcw, 
  Archive,
  Info
} from 'lucide-react';
import { api } from '../../services/mockBackend';
import { WeeklyBatch } from '../../types';

export const ExecutionHistory = () => {
  const [batches, setBatches] = useState<WeeklyBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getWeeklyBatches(201);
      setBatches(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-emerald-500 animate-pulse font-mono p-12 text-center">Loading Execution Logs...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
           <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Clock size={24} />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight italic font-serif">EXECUTION HISTORY</h1>
            </div>
          <p className="text-gray-500 mt-1 text-sm font-mono uppercase tracking-wide ml-14">Audit logs of confirmed marketing sequences.</p>
        </div>
      </div>

      {/* Main Table */}
      <Card className="bg-[#111111] border-white/5 overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-white/5">
               <tr>
                  <th className="px-6 py-4">Download Date</th>
                  <th className="px-6 py-4">Week Of</th>
                  <th className="px-6 py-4 font-mono">Total Records</th>
                  <th className="px-6 py-4">Supply Chain Breakdown</th>
                  <th className="px-6 py-4">Lane Distribution</th>
                  <th className="px-6 py-4 text-right">Skip Settlement</th>
                  <th className="px-6 py-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-white/5 transition-colors">
                     {/* Download Date */}
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-600" />
                            <span className="text-sm font-medium text-white font-mono uppercase">
                                {new Date(batch.firstDownloadAt || batch.generatedAt).toLocaleString('en-US', {
                                    month: 'short', day: '2-digit', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit', hour12: true
                                })}
                            </span>
                        </div>
                     </td>

                     {/* Week Of */}
                     <td className="px-6 py-4">
                         <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                             Week of {batch.weekStart}
                         </span>
                     </td>

                     {/* Total Records */}
                     <td className="px-6 py-4">
                         <span className="text-emerald-500 font-mono font-bold text-lg">{batch.totalRecords.toLocaleString()}</span>
                     </td>

                     {/* Supply Chain Breakdown */}
                     <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-white font-bold w-12">FRESH</span>
                                <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white" style={{ width: `${(batch.freshCount / batch.totalRecords) * 100}%` }} />
                                </div>
                                <span className="text-gray-500 font-mono">{batch.freshCount}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-400 font-bold w-12">REPEAT</span>
                                <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-500" style={{ width: `${(batch.repeatCount / batch.totalRecords) * 100}%` }} />
                                </div>
                                <span className="text-gray-500 font-mono">{batch.repeatCount}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-600 font-bold w-12">QUEUE</span>
                                <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-700" style={{ width: `${(batch.queueCount / batch.totalRecords) * 100}%` }} />
                                </div>
                                <span className="text-gray-500 font-mono">{batch.queueCount}</span>
                            </div>
                        </div>
                     </td>

                     {/* Lane Distribution */}
                     <td className="px-6 py-4">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider w-12">BLITZ</span>
                              <span className="text-xs text-gray-400 font-mono">{batch.blitzCount}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider w-12">CHASE</span>
                              <span className="text-xs text-gray-400 font-mono">{batch.chaseCount}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider w-12">NURTURE</span>
                              <span className="text-xs text-gray-400 font-mono">{batch.nurtureCount}</span>
                           </div>
                        </div>
                     </td>

                     {/* Skip Settlement */}
                     <td className="px-6 py-4 text-right">
                        {batch.skipTraceCount > 0 ? (
                            <div>
                            <div className="text-lg font-mono font-bold text-white">
                                ${batch.skipTraceCost.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono">
                                {batch.skipTraceCount} traced @ ${(batch.skipTraceCost / batch.skipTraceCount).toFixed(2)}/ea
                            </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600 font-mono">—</div>
                        )}
                    </td>

                     {/* Actions */}
                     <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20 transition-colors uppercase tracking-wider">
                           <RotateCcw size={12} />
                           Re-Download
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </Card>

      {/* Bottom Note */}
      <Card className="bg-[#111111] border-white/5 p-6 flex items-start gap-4">
         <div className="p-2 bg-gray-800/50 rounded-lg text-gray-400">
            <Archive size={20} />
         </div>
         <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Historical Retention Policy</h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
               Execution logs are retained for the duration of your active subscription plus 90 days post-cancellation. Re-downloading past batches does not increment touch counts or decay signal scores.
            </p>
         </div>
      </Card>
    </div>
  );
};
