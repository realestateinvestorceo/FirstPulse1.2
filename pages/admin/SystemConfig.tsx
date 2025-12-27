
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/mockBackend';
import { SystemDefault } from '../../types';
import { Sliders } from 'lucide-react';
import { Toast } from '../../components/ui/Toast';

export const SystemConfig = () => {
  const [defaults, setDefaults] = useState<SystemDefault[]>([]);
  const [changedValues, setChangedValues] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.getSystemDefaults().then(setDefaults);
  }, []);

  const handleChange = (id: number, val: string) => {
    setChangedValues(prev => ({ ...prev, [id]: val }));
  };

  const handleSave = async (id: number) => {
    setSaving(true);
    const newVal = changedValues[id];
    if (newVal !== undefined) {
       await api.updateSystemDefault(id, newVal);
       // Refresh list
       const updated = await api.getSystemDefaults();
       setDefaults(updated);
       setChangedValues(prev => {
         const copy = {...prev};
         delete copy[id];
         return copy;
       });
       setToast('Setting updated successfully');
    }
    setSaving(false);
  };

  const groupedDefaults = defaults.reduce((acc, curr) => {
      const group = curr.settingKey.split('_')[0].toUpperCase();
      if (!acc[group]) acc[group] = [];
      acc[group].push(curr);
      return acc;
  }, {} as Record<string, SystemDefault[]>);

  return (
    <div className="space-y-6 pb-12">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white">System Configuration</h1>
        <p className="text-gray-500 text-sm mt-1">Global defaults for new client accounts and engine logic.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedDefaults).map(([group, items]: [string, SystemDefault[]]) => (
              <Card key={group} className="bg-[#111111] border-white/5">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                      <Sliders size={16} className="text-emerald-500" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{group} SETTINGS</h3>
                  </div>
                  <div className="p-6 space-y-6">
                      {items.map(def => (
                          <div key={def.id}>
                              <div className="flex justify-between items-center mb-2">
                                  <label className="text-xs font-bold text-gray-400 uppercase">{def.settingKey.replace(/_/g, ' ')}</label>
                                  {changedValues[def.id] !== undefined && (
                                      <button 
                                        onClick={() => handleSave(def.id)}
                                        disabled={saving}
                                        className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                                      >
                                          {saving ? '...' : 'SAVE'}
                                      </button>
                                  )}
                              </div>
                              <div className="flex items-center gap-3">
                                  <input 
                                    type={def.dataType === 'number' ? 'number' : 'text'}
                                    value={changedValues[def.id] !== undefined ? changedValues[def.id] : def.settingValue}
                                    onChange={(e) => handleChange(def.id, e.target.value)}
                                    className="flex-1 bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                                  />
                                  <span className="text-xs text-gray-600 uppercase font-bold w-8 text-right">
                                    {def.dataType === 'number' ? '#' : 'TXT'}
                                  </span>
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1.5">{def.description}</p>
                          </div>
                      ))}
                  </div>
              </Card>
          ))}
      </div>
    </div>
  );
};
