import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { api } from '../../services/mockBackend';
import { County } from '../../types';
import { Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export const Counties = () => {
  const [counties, setCounties] = useState<County[]>([]);

  useEffect(() => {
    api.getCounties().then(setCounties);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Coverage</h1>
          <p className="text-gray-500 text-sm mt-1">Manage active data feeds and county availability.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Add Territory
        </button>
      </div>

      <Card>
        <CardHeader title="Counties" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-200 uppercase text-xs font-medium">
              <tr>
                <th className="px-6 py-4">FIPS</th>
                <th className="px-6 py-4">County / State</th>
                <th className="px-6 py-4">Population</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Active Clients</th>
                <th className="px-6 py-4">Last Sync</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {counties.map((county) => (
                <tr key={county.fips} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-500">{county.fips}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{county.name}</div>
                    <div className="text-xs text-gray-500">{county.state} ({county.stateCode})</div>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    {(county.population / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                      county.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : county.status === 'Pending'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                    }`}>
                      {county.status === 'Active' && <CheckCircle2 size={12} />}
                      {county.status === 'Inactive' && <AlertCircle size={12} />}
                      {county.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="text-white font-bold">{county.activeClients}</span>
                       <span className="text-xs text-gray-600">Clients</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {new Date(county.lastDataPull).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-emerald-500 hover:text-emerald-400 text-xs font-bold uppercase flex items-center gap-1 justify-end w-full">
                      <RefreshCw size={12} />
                      Sync
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};