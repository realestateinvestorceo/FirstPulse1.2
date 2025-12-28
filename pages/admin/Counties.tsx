
import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Toast } from '../../components/ui/Toast';
import { api } from '../../services/mockBackend';
import { County } from '../../types';
import { Plus, RefreshCw, CheckCircle2, AlertCircle, Map } from 'lucide-react';

export const Counties = () => {
  const [counties, setCounties] = useState<County[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTerritory, setNewTerritory] = useState({ fips: '', name: '', state: '', stateCode: '', population: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    api.getCounties().then(setCounties);
  }, []);

  const handleAddTerritory = () => {
    if (!newTerritory.fips || !newTerritory.name) return;

    const county: County = {
      fips: newTerritory.fips,
      name: newTerritory.name,
      state: newTerritory.state,
      stateCode: newTerritory.stateCode || newTerritory.state.substring(0, 2).toUpperCase(),
      population: parseInt(newTerritory.population) || 0,
      status: 'Pending',
      activeClients: 0,
      lastDataPull: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCounties([...counties, county]);
    setIsAddOpen(false);
    setNewTerritory({ fips: '', name: '', state: '', stateCode: '', population: '' });
    setToastMessage("Territory added successfully");
  };

  return (
    <div className="space-y-6">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Coverage</h1>
          <p className="text-gray-500 text-sm mt-1">Manage active data feeds and county availability.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
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

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Territory" icon={<Map className="text-emerald-500" />}>
        <div className="space-y-4">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">FIPS Code</label>
                <input 
                    placeholder="e.g. 17031" 
                    value={newTerritory.fips} 
                    onChange={e => setNewTerritory({...newTerritory, fips: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono" 
                />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">County Name</label>
                <input 
                    placeholder="e.g. Cook County" 
                    value={newTerritory.name} 
                    onChange={e => setNewTerritory({...newTerritory, name: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">State</label>
                    <input 
                        placeholder="e.g. Illinois" 
                        value={newTerritory.state} 
                        onChange={e => setNewTerritory({...newTerritory, state: e.target.value})} 
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">State Code</label>
                    <input 
                        placeholder="e.g. IL" 
                        maxLength={2}
                        value={newTerritory.stateCode} 
                        onChange={e => setNewTerritory({...newTerritory, stateCode: e.target.value.toUpperCase()})} 
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Population</label>
                <input 
                    type="number"
                    placeholder="e.g. 5200000" 
                    value={newTerritory.population} 
                    onChange={e => setNewTerritory({...newTerritory, population: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                />
            </div>
            <button 
                onClick={handleAddTerritory} 
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg mt-2 transition-colors"
            >
                Add Territory
            </button>
        </div>
      </Modal>
    </div>
  );
};
