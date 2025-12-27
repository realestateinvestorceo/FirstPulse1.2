import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { api } from '../../services/mockBackend';
import { DistressSignal, Lane } from '../../types';
import { Edit2, Save, X } from 'lucide-react';

const LaneBadge = ({ lane }: { lane: Lane }) => {
  const styles = {
    Blitz: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Chase: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    Nurture: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${styles[lane]}`}>
      {lane}
    </span>
  );
};

export const Signals = () => {
  const [signals, setSignals] = useState<DistressSignal[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRate, setEditRate] = useState<string>('');

  useEffect(() => {
    api.getDistressSignals().then(setSignals);
  }, []);

  const handleEdit = (signal: DistressSignal) => {
    setEditingId(signal.id);
    setEditRate(signal.baseConversionRate.toString());
  };

  const handleSave = async (id: number) => {
    const rate = parseFloat(editRate);
    if (!isNaN(rate)) {
      await api.updateDistressSignal(id, { baseConversionRate: rate });
      setSignals(prev => prev.map(s => s.id === id ? { ...s, baseConversionRate: rate } : s));
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white">Distress Signals</h1>
        <p className="text-gray-500 text-sm mt-1">Configure signal weights, lanes, and conversion baselines.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-200 uppercase text-xs font-medium">
              <tr>
                <th className="px-6 py-4">Signal Key</th>
                <th className="px-6 py-4">Display Name</th>
                <th className="px-6 py-4">Default Lane</th>
                <th className="px-6 py-4">Urgency</th>
                <th className="px-6 py-4">Base Rate</th>
                <th className="px-6 py-4 text-right">Status</th>
                <th className="px-6 py-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {signals.map((signal) => (
                <tr key={signal.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-500">{signal.signalKey}</td>
                  <td className="px-6 py-4 font-medium text-white">{signal.displayName}</td>
                  <td className="px-6 py-4">
                    <LaneBadge lane={signal.defaultLane} />
                  </td>
                  <td className="px-6 py-4">
                     {signal.isTimeSensitive ? (
                        <span className="text-rose-500 font-bold text-xs uppercase">High</span>
                     ) : (
                        <span className="text-gray-600 font-bold text-xs uppercase">Standard</span>
                     )}
                  </td>
                  <td className="px-6 py-4 font-mono text-emerald-500">
                    {editingId === signal.id ? (
                        <input 
                            type="number" 
                            step="0.0001"
                            value={editRate}
                            onChange={(e) => setEditRate(e.target.value)}
                            className="bg-black border border-emerald-500 rounded px-2 py-1 w-24 text-white focus:outline-none"
                        />
                    ) : (
                        signal.baseConversionRate.toFixed(4)
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`w-2 h-2 rounded-full inline-block ${signal.isActive ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === signal.id ? (
                        <div className="flex justify-end gap-2">
                            <button onClick={() => handleSave(signal.id)} className="text-emerald-500 hover:text-emerald-400"><Save size={16} /></button>
                            <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-400"><X size={16} /></button>
                        </div>
                    ) : (
                        <button onClick={() => handleEdit(signal)} className="text-gray-500 hover:text-white">
                            <Edit2 size={16} />
                        </button>
                    )}
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