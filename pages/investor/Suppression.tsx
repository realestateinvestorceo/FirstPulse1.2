import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Shield, Upload, FileSpreadsheet, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../../services/mockBackend';
import { SuppressionList } from '../../types';

export const SuppressionManagement = () => {
  const [lists, setLists] = useState<SuppressionList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      const data = await api.getSuppressionLists(201);
      setLists(data);
      setLoading(false);
    };
    fetchLists();
  }, []);

  if (loading) return <div className="text-emerald-500 animate-pulse font-mono p-12 text-center">Loading Suppression Data...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
            <div className="flex items-center gap-3 mb-1">
                <Shield className="text-emerald-500" size={32} />
                <h1 className="text-3xl font-bold text-white tracking-tight">Suppression Management</h1>
            </div>
            <p className="text-gray-500 mt-1 text-sm font-mono uppercase tracking-wide ml-11">
                Manage blacklists, litigators, and DNC registries.
            </p>
        </div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Card */}
          <Card className="bg-[#111111] border-emerald-500/20 flex flex-col justify-center items-center p-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
               <ShieldAlert className="text-emerald-500 mb-4 opacity-80" size={48} />
               <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Lifetime Waste Blocked</div>
               <div className="text-4xl font-mono font-bold text-white tracking-tight">12,403</div>
               <div className="text-xs text-emerald-500/50 uppercase font-bold mt-1 tracking-wider">Records Protected</div>
          </Card>

          {/* Upload Section */}
          <Card className="lg:col-span-2 bg-[#111111] border-white/10 border-dashed p-8 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-400">
                   <Upload size={28} />
               </div>
               <h3 className="text-lg font-bold text-white mb-2">UPLOAD NEW SUPPRESSION LIST</h3>
               <p className="text-xs text-gray-500 font-mono mb-6 uppercase tracking-wide">
                   SUPPORTED COLUMN HINTS: (PHONE, ADDRESS, OWNER_NAME)
               </p>
               <button className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 rounded-lg text-sm font-bold text-white uppercase tracking-wider transition-all flex items-center gap-2">
                   <FileSpreadsheet size={16} className="text-emerald-500" />
                   Browse CSV Files
               </button>
          </Card>
      </div>

      {/* Table Section */}
      <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-4">Active Suppression Registry</h3>
          <Card className="bg-[#111111] border-white/5 overflow-hidden">
              <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-white/5">
                      <tr>
                          <th className="px-6 py-4">File Identity</th>
                          <th className="px-6 py-4 font-mono">Record Count</th>
                          <th className="px-6 py-4 text-right">System Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {lists.map((list) => (
                          <tr key={list.id} className="hover:bg-white/5 transition-colors group">
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                      <FileSpreadsheet size={18} className="text-gray-600 group-hover:text-emerald-500 transition-colors" />
                                      <span className="text-sm font-medium text-white">{list.fileName}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 font-mono text-sm text-gray-400">
                                  {list.recordCount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                      list.isActive 
                                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                      : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                  }`}>
                                      {list.isActive && <CheckCircle2 size={12} />}
                                      {list.isActive ? 'ACTIVE' : 'INACTIVE'}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </Card>
      </div>
    </div>
  );
};