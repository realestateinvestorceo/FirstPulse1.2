
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { api } from '../../services/mockBackend';
import { Client, ClientSettings, County } from '../../types';
import { Save, LogIn, AlertTriangle, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { Toast } from '../../components/ui/Toast';

export const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [settings, setSettings] = useState<ClientSettings | null>(null);
  const [counties, setCounties] = useState<County[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (id) {
      const clientId = parseInt(id);
      api.getClientById(clientId).then(setClient);
      api.getClientSettings(clientId).then(setSettings);
      api.getCounties().then(setCounties);
    }
  }, [id]);

  const handleImpersonate = async () => {
    if (!client) return;
    try {
        const auth = await api.impersonateClient(client.id);
        localStorage.setItem('fp_user', JSON.stringify(auth.user));
        localStorage.setItem('fp_token', auth.token);
        // Force reload to pick up new user state in App.tsx
        window.location.reload();
    } catch (e) {
        alert("Failed to impersonate");
    }
  };

  const handleSave = async () => {
    if (client && settings) {
        setSaving(true);
        await api.updateClientSettings(client.id, settings);
        setSaving(false);
        setSuccessMsg('Configuration Saved Successfully');
    }
  };

  const toggleCounty = (fips: string) => {
      if (!settings) return;
      const current = settings.buyBox.counties;
      const updated = current.includes(fips) 
        ? current.filter(c => c !== fips)
        : [...current, fips];
      setSettings({ ...settings, buyBox: { ...settings.buyBox, counties: updated }});
  };
  
  const togglePropType = (type: string) => {
      if (!settings) return;
      const current = settings.buyBox.propertyTypes;
      const updated = current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type];
      setSettings({ ...settings, buyBox: { ...settings.buyBox, propertyTypes: updated }});
  };

  if (!client || !settings) return <div className="text-emerald-500 animate-pulse p-8 font-mono">Loading Client Data...</div>;

  return (
    <div className="space-y-6 pb-12">
      {successMsg && <Toast message={successMsg} onClose={() => setSuccessMsg('')} />}

      {/* Header */}
      <div className="flex items-center gap-4">
         <button onClick={() => navigate('/partner/clients')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
             <ArrowLeft size={20} />
         </button>
         <div>
            <h1 className="text-2xl font-bold text-white">{client.name}</h1>
            <p className="text-gray-500 text-sm">{client.companyName} • {client.email}</p>
         </div>
         <div className="ml-auto flex gap-3">
             <button 
                onClick={handleImpersonate}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-gray-300 flex items-center gap-2 transition-colors"
             >
                 <LogIn size={16} />
                 Impersonate
             </button>
             <button 
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg text-sm flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
             >
                 {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Configuration</>}
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buy Box Configuration */}
          <Card>
              <CardHeader title="Buy Box Configuration" subtitle="Define the market parameters for this client." />
              <CardContent className="space-y-6">
                  {/* Counties */}
                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Active Markets</label>
                      <div className="grid grid-cols-2 gap-3">
                          {counties.map(c => (
                              <button 
                                key={c.fips}
                                onClick={() => toggleCounty(c.fips)}
                                className={`p-3 rounded border text-left transition-all ${
                                    settings.buyBox.counties.includes(c.fips)
                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                                    : 'bg-[#0A0A0A] border-white/10 text-gray-500 hover:border-white/20'
                                }`}
                              >
                                  <div className="font-bold text-sm">{c.name}</div>
                                  <div className="text-xs opacity-70">{c.state}</div>
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Property Types */}
                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Asset Types</label>
                      <div className="flex flex-wrap gap-2">
                          {['Single Family', 'Multi-Family', 'Condo', 'Townhouse', 'Land'].map(type => (
                              <button
                                key={type}
                                onClick={() => togglePropType(type)}
                                className={`px-3 py-1.5 rounded text-xs font-bold uppercase border transition-colors ${
                                    settings.buyBox.propertyTypes.includes(type)
                                    ? 'bg-emerald-500 text-black border-emerald-500'
                                    : 'bg-white/5 text-gray-400 border-white/5'
                                }`}
                              >
                                  {type}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Sliders */}
                  <div className="grid grid-cols-2 gap-6">
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Max Price</label>
                          <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-mono font-bold text-white">${settings.buyBox.maxPrice.toLocaleString()}</span>
                          </div>
                          <input 
                            type="range" 
                            min="50000" max="2000000" step="10000"
                            value={settings.buyBox.maxPrice}
                            onChange={(e) => setSettings({...settings, buyBox: {...settings.buyBox, maxPrice: parseInt(e.target.value)}})}
                            className="w-full accent-emerald-500 bg-gray-700 h-1.5 rounded-full appearance-none"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Min Equity</label>
                          <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-mono font-bold text-white">{settings.buyBox.minEquity}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" max="100" step="5"
                            value={settings.buyBox.minEquity}
                            onChange={(e) => setSettings({...settings, buyBox: {...settings.buyBox, minEquity: parseInt(e.target.value)}})}
                            className="w-full accent-emerald-500 bg-gray-700 h-1.5 rounded-full appearance-none"
                          />
                      </div>
                  </div>

                  {/* Excluded Zips */}
                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Excluded Zip Codes</label>
                      <input 
                        type="text"
                        value={settings.buyBox.excludedZips}
                        onChange={(e) => setSettings({...settings, buyBox: {...settings.buyBox, excludedZips: e.target.value}})}
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none font-mono"
                        placeholder="e.g. 60621, 60636"
                      />
                      {settings.buyBox.excludedZips.length > 0 && (
                          <div className="mt-2 flex items-center gap-2 text-amber-500 text-xs bg-amber-500/10 p-2 rounded border border-amber-500/20">
                              <AlertTriangle size={12} />
                              Warning: Excluding high-activity zips may significantly reduce volume.
                          </div>
                      )}
                  </div>
              </CardContent>
          </Card>

          {/* Cadence Configuration */}
          <Card>
              <CardHeader title="Cadence Logic" subtitle="Adjust frequency and persistence for each lane." />
              <CardContent className="space-y-6">
                  {/* Blitz */}
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                      <h3 className="text-amber-500 font-bold uppercase text-xs tracking-wider mb-4">Blitz Lane</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Days Between</label>
                              <input 
                                type="number"
                                value={settings.cadence.blitzDays}
                                onChange={(e) => setSettings({...settings, cadence: {...settings.cadence, blitzDays: parseInt(e.target.value)}})}
                                className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                              />
                          </div>
                          <div>
                              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Max Touches</label>
                              <input 
                                type="number"
                                value={settings.cadence.blitzMaxTouches}
                                onChange={(e) => setSettings({...settings, cadence: {...settings.cadence, blitzMaxTouches: parseInt(e.target.value)}})}
                                className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                              />
                          </div>
                      </div>
                  </div>

                  {/* Chase */}
                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
                      <h3 className="text-indigo-500 font-bold uppercase text-xs tracking-wider mb-4">Chase Lane</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Days Between</label>
                              <input 
                                type="number"
                                value={settings.cadence.chaseDays}
                                onChange={(e) => setSettings({...settings, cadence: {...settings.cadence, chaseDays: parseInt(e.target.value)}})}
                                className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                              />
                          </div>
                          <div>
                              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Max Touches</label>
                              <input 
                                type="number"
                                value={settings.cadence.chaseMaxTouches}
                                onChange={(e) => setSettings({...settings, cadence: {...settings.cadence, chaseMaxTouches: parseInt(e.target.value)}})}
                                className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                              />
                          </div>
                      </div>
                  </div>

                  {/* Nurture */}
                  <div className="p-4 bg-gray-500/5 border border-gray-500/20 rounded-lg">
                      <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-4">Nurture Lane</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Days Between</label>
                              <input 
                                type="number"
                                value={settings.cadence.nurtureDays}
                                onChange={(e) => setSettings({...settings, cadence: {...settings.cadence, nurtureDays: parseInt(e.target.value)}})}
                                className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                              />
                          </div>
                          <div>
                              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Max Touches</label>
                              <input 
                                type="number"
                                value={settings.cadence.nurtureMaxTouches}
                                onChange={(e) => setSettings({...settings, cadence: {...settings.cadence, nurtureMaxTouches: parseInt(e.target.value)}})}
                                className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                              />
                          </div>
                      </div>
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
};
