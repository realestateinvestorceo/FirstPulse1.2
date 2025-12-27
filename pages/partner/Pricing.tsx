
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { api } from '../../services/mockBackend';
import { Save, Check, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { Toast } from '../../components/ui/Toast';

export const PartnerPricing = () => {
  const [skipTraceRate, setSkipTraceRate] = useState<string>('0.12');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  // Hardcoded constants for demo
  const ADMIN_FLOOR = 0.06;
  const PARTNER_ID = 101;

  useEffect(() => {
    const fetchConfig = async () => {
       const configs = await api.getPartnerConfig(PARTNER_ID);
       const rateConfig = configs.find(c => c.settingKey === 'skip_trace_rate');
       if (rateConfig) {
           setSkipTraceRate(rateConfig.settingValue);
       }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
      const rate = parseFloat(skipTraceRate);
      if (isNaN(rate) || rate < ADMIN_FLOOR) {
          setError(`Rate must be at least $${ADMIN_FLOOR.toFixed(2)}`);
          return;
      }
      
      setSaving(true);
      setError('');
      await api.updatePartnerConfig(PARTNER_ID, 'skip_trace_rate', skipTraceRate);
      setSaving(false);
      setSuccessMsg('Pricing Configuration Updated Successfully');
  };

  const margin = Math.max(0, parseFloat(skipTraceRate || '0') - ADMIN_FLOOR);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {successMsg && <Toast message={successMsg} onClose={() => setSuccessMsg('')} />}
      
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white">Pricing Configuration</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your markup and service rates.</p>
      </div>

      <Card>
          <CardHeader title="Skip Trace Markup" subtitle="Set the cost per record for your clients." />
          <CardContent className="space-y-8">
              <div className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                   <div className="p-3 bg-gray-800 rounded-lg text-gray-400">
                       <DollarSign size={24} />
                   </div>
                   <div>
                       <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Admin Floor Price</div>
                       <div className="text-2xl font-mono text-white font-bold">${ADMIN_FLOOR.toFixed(2)}</div>
                       <div className="text-xs text-gray-600">Base cost per record</div>
                   </div>
              </div>

              <div className="space-y-4">
                   <label className="text-sm font-bold text-white uppercase tracking-wider block">Your Client Rate</label>
                   <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-lg">$</span>
                       <input 
                         type="number" 
                         step="0.01"
                         value={skipTraceRate}
                         onChange={(e) => setSkipTraceRate(e.target.value)}
                         className="w-full bg-black border border-white/10 rounded-xl pl-8 pr-4 py-4 text-xl font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                       />
                   </div>
                   {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <div className="p-6 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                       <TrendingUp className="text-emerald-500" />
                       <span className="text-emerald-500 font-bold uppercase tracking-wider text-sm">Your Margin</span>
                   </div>
                   <div className="text-2xl font-mono font-bold text-emerald-400">
                       ${margin.toFixed(2)} <span className="text-sm text-emerald-500/50 font-sans font-normal">per record</span>
                   </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg text-sm flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Update Pricing</>}
                </button>
              </div>
          </CardContent>
      </Card>
    </div>
  );
};
