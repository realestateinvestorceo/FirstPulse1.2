
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/mockBackend';
import { Client, ClientStatus, SubscriptionTier, County } from '../../types';
import { 
  Search, Plus, Users, Mail, Building, Phone, 
  Globe, Check, Info, DollarSign, ChevronRight, 
  ChevronLeft, LayoutGrid, ShieldCheck, MapPin,
  Target, TrendingUp, X, Map, Hash, Maximize, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }: { status: ClientStatus }) => {
  const colors = {
    [ClientStatus.Active]: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    [ClientStatus.Onboarding]: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    [ClientStatus.Paused]: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    [ClientStatus.Cancelled]: 'text-red-500 bg-red-500/10 border-red-500/20',
  };
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[status]}`}>
      {status}
    </span>
  );
};

const TIERS = [
  { id: SubscriptionTier.FRESH_ONLY, label: 'FRESH_ONLY', wholesale: 297, capacity: 5000, counties: 1 },
  { id: SubscriptionTier.FOCUSED, label: 'FOCUSED', wholesale: 697, capacity: 10000, counties: 1 },
  { id: SubscriptionTier.EXPANSION, label: 'EXPANSION', wholesale: 1497, capacity: 25000, counties: 3 },
  { id: SubscriptionTier.DOMINANCE, label: 'DOMINANCE', wholesale: 2997, capacity: 60000, counties: 5 },
];

const PROPERTY_TYPE_OPTIONS = ['Single Family', 'Multi-Family 2-4', 'Condo', 'Townhouse', 'Land', 'Commercial'];

type Step = 'identity' | 'economics' | 'territory' | 'parameters';

interface CountyBuyBox {
  fips: string;
  name: string;
  propertyTypes: string[];
  maxPrice: string;
  minEquity: string;
  minBeds: string;
  minBaths: string;
  minSqFt: string;
  minLotSize: string;
  excludedZips: string;
}

export const PartnerClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const navigate = useNavigate();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<Step>('identity');
  
  // Wizard State
  const [identity, setIdentity] = useState({ name: '', email: '', companyName: '', phone: '' });
  const [economics, setEconomics] = useState({ tier: SubscriptionTier.FRESH_ONLY, clientPrice: '497', additionalCountyPrice: '150' });
  const [territory, setTerritory] = useState<County[]>([]);
  const [parameters, setParameters] = useState<Record<string, CountyBuyBox>>({});
  
  // Territory Search
  const [countySearch, setCountySearch] = useState('');
  const [countyResults, setCountyResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    api.getClients(101).then(setClients);
  }, []);

  useEffect(() => {
    if (countySearch.length > 2) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        const results = await api.searchFullCountyRegistry(countySearch);
        setCountyResults(results);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setCountyResults([]);
    }
  }, [countySearch]);

  const handleAddClient = () => {
    const tierInfo = TIERS.find(t => t.id === economics.tier);
    const client: Client = {
        id: Date.now(),
        partnerId: 101,
        name: identity.name,
        email: identity.email,
        companyName: identity.companyName,
        clientStatus: ClientStatus.Onboarding,
        subscriptionTier: economics.tier,
        weeklyCapacity: tierInfo?.capacity || 100,
        skipTraceWalletBalance: 0,
        skipTraceAutoRecharge: false,
        skipTraceRechargeThreshold: 25,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    setClients([...clients, client]);
    setIsAddOpen(false);
    resetWizard();
  };

  const resetWizard = () => {
    setActiveStep('identity');
    setIdentity({ name: '', email: '', companyName: '', phone: '' });
    setEconomics({ tier: SubscriptionTier.FRESH_ONLY, clientPrice: '497', additionalCountyPrice: '150' });
    setTerritory([]);
    setParameters({});
  };

  const selectCounty = (county: any) => {
    if (territory.find(t => t.fips === county.fips)) return;
    setTerritory([...territory, { ...county, status: 'Pending', activeClients: 1 } as County]);
    setParameters(prev => ({
      ...prev,
      [county.fips]: {
        fips: county.fips,
        name: county.name,
        propertyTypes: ['Single Family', 'Multi-Family 2-4', 'Condo', 'Townhouse', 'Commercial'],
        maxPrice: '850000',
        minEquity: '30',
        minBeds: '',
        minBaths: '',
        minSqFt: '',
        minLotSize: '',
        excludedZips: ''
      }
    }));
    setCountySearch('');
  };

  const removeCounty = (fips: string) => {
    setTerritory(territory.filter(t => t.fips !== fips));
    const newParams = { ...parameters };
    delete newParams[fips];
    setParameters(newParams);
  };

  const syncAllCounties = (sourceFips: string) => {
    const source = parameters[sourceFips];
    const newParams: Record<string, CountyBuyBox> = {};
    territory.forEach(t => {
      newParams[t.fips] = { ...source, fips: t.fips, name: t.name };
    });
    setParameters(newParams);
  };

  const selectedTier = TIERS.find(t => t.id === economics.tier);
  const extraCounties = Math.max(0, territory.length - (selectedTier?.counties || 0));
  const retailAdditionalPrice = parseFloat(economics.additionalCountyPrice || '150');
  const extraCost = extraCounties * retailAdditionalPrice;
  const currentMargin = parseFloat(economics.clientPrice) - (selectedTier?.wholesale || 0);
  const isPriceValid = parseFloat(economics.clientPrice) >= (selectedTier?.wholesale || 0);
  const isAdditionalPriceValid = retailAdditionalPrice >= 150;

  const steps: Step[] = ['identity', 'economics', 'territory', 'parameters'];
  const nextStep = () => {
    const idx = steps.indexOf(activeStep);
    if (idx < steps.length - 1) setActiveStep(steps[idx + 1]);
  };
  const prevStep = () => {
    const idx = steps.indexOf(activeStep);
    if (idx > 0) setActiveStep(steps[idx - 1]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">My Clients</h1>
        <button 
            onClick={() => setIsAddOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={18} />
          Provision Client
        </button>
      </div>

      <Card>
        <CardHeader 
          title="Active Accounts" 
          subtitle="Manage client buy boxes and cadence settings"
          action={
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50 w-64"
              />
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-200 uppercase text-xs font-medium">
              <tr>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((client) => (
                <tr 
                    key={client.id} 
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/partner/clients/${client.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white group-hover:text-emerald-500 transition-colors">{client.name}</div>
                    <div className="text-xs">{client.companyName}</div>
                  </td>
                  <td className="px-6 py-4">{client.email}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={client.clientStatus} />
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-emerald-400">
                    {client.subscriptionTier.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 font-mono">
                    {client.weeklyCapacity?.toLocaleString()} / wk
                  </td>
                   <td className="px-6 py-4 text-xs font-mono">
                    {new Date(client.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isAddOpen} 
        onClose={() => { setIsAddOpen(false); resetWizard(); }} 
        title="Provision Strategic Account" 
        icon={<ShieldCheck className="text-emerald-500" />}
      >
        {/* Step Indicator */}
        <div className="flex justify-between mb-8 px-4">
            {steps.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${
                        activeStep === s ? 'bg-emerald-500 border-emerald-500 text-black' : steps.indexOf(activeStep) > i ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'border-gray-700 text-gray-600'
                    }`}>
                        {steps.indexOf(activeStep) > i ? <Check size={14} /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${activeStep === s ? 'text-white' : 'text-gray-600'}`}>
                        {s}
                    </span>
                </div>
            ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          
          {/* STEP 1: IDENTITY */}
          {activeStep === 'identity' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 border-l-2 border-emerald-500 pl-4 mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Client Identity</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name *</label>
                        <input 
                            placeholder="Primary Contact" 
                            value={identity.name} 
                            onChange={e => setIdentity({...identity, name: e.target.value})} 
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none transition-colors" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address *</label>
                        <input 
                            placeholder="client@domain.com" 
                            value={identity.email} 
                            onChange={e => setIdentity({...identity, email: e.target.value})} 
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none transition-colors" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company</label>
                        <input 
                            placeholder="Entity Name" 
                            value={identity.companyName} 
                            onChange={e => setIdentity({...identity, companyName: e.target.value})} 
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none transition-colors" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone</label>
                        <input 
                            placeholder="(555) 000-0000" 
                            value={identity.phone} 
                            onChange={e => setIdentity({...identity, phone: e.target.value})} 
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none transition-colors" 
                        />
                    </div>
                </div>
            </div>
          )}

          {/* STEP 2: ECONOMICS */}
          {activeStep === 'economics' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 border-l-2 border-emerald-500 pl-4 mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Account Economics</h3>
                </div>
                
                <div className="space-y-3">
                    {TIERS.map(tier => (
                        <button
                            key={tier.id}
                            onClick={() => setEconomics({...economics, tier: tier.id})}
                            className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                                economics.tier === tier.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${economics.tier === tier.id ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600'}`}>
                                    {economics.tier === tier.id && <Check size={10} className="text-black font-bold" />}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-white">{tier.label}</div>
                                    <div className="text-[10px] text-gray-500 font-mono">UP TO {tier.capacity.toLocaleString()} RECORDS/WK</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-white">${tier.wholesale}/mo</div>
                                <div className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Wholesale Floor</div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-6 bg-[#0A0A0A] rounded-2xl border border-white/5 space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Retail Client Price (USD)</label>
                            <TrendingUp size={16} className="text-emerald-500" />
                        </div>
                        <div className="relative">
                            <DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="number" 
                                value={economics.clientPrice} 
                                onChange={e => setEconomics({...economics, clientPrice: e.target.value})} 
                                className={`w-full bg-black border rounded-xl pl-10 pr-4 py-4 text-2xl font-mono text-white focus:border-emerald-500 outline-none transition-colors ${!isPriceValid ? 'border-red-500/50' : 'border-white/10'}`}
                            />
                        </div>
                        {!isPriceValid && (
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">Price cannot be below wholesale floor (${selectedTier?.wholesale})</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Additional Territory Price</label>
                            <span className="text-[9px] text-gray-600 font-bold uppercase">Price per county beyond included allocation</span>
                        </div>
                        <div className="relative">
                            <DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="number" 
                                value={economics.additionalCountyPrice} 
                                onChange={e => setEconomics({...economics, additionalCountyPrice: e.target.value})} 
                                className={`w-full bg-black border rounded-xl pl-10 pr-4 py-4 text-xl font-mono text-white focus:border-emerald-500 outline-none transition-colors ${!isAdditionalPriceValid ? 'border-red-500/50' : 'border-white/10'}`}
                            />
                        </div>
                        {!isAdditionalPriceValid && (
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">Price cannot be below wholesale floor ($150)</p>
                        )}
                    </div>

                    <div className="flex justify-between items-center px-2 pt-2 border-t border-white/5">
                        <div className="text-[10px] text-gray-600 font-bold uppercase">Estimated Monthly Profit</div>
                        <div className={`text-lg font-mono font-bold ${currentMargin >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            ${Math.max(0, currentMargin).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
          )}

          {/* STEP 3: TERRITORY */}
          {activeStep === 'territory' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 border-l-2 border-emerald-500 pl-4 mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Market Selection</h3>
                </div>

                <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isSearching ? 'text-emerald-500 animate-spin' : 'text-gray-500'}`} size={18} />
                    <input 
                        placeholder="Search 3,143 US Counties..." 
                        value={countySearch}
                        onChange={e => setCountySearch(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-4 text-white focus:border-emerald-500 outline-none transition-colors"
                    />
                    
                    {countyResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                            {countyResults.map(c => (
                                <button 
                                    key={c.fips} 
                                    onClick={() => selectCounty(c)}
                                    className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center justify-between group transition-colors"
                                >
                                    <div>
                                        <div className="text-sm font-bold text-white group-hover:text-emerald-500">{c.name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold">{c.state} ({c.stateCode})</div>
                                    </div>
                                    <MapPin size={14} className="text-gray-700 group-hover:text-emerald-500" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex justify-between items-center px-2">
                        <span>Selected Territories ({territory.length})</span>
                        <span>{territory.length} of {selectedTier?.counties} Included</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {territory.map(c => (
                            <div key={c.fips} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-lg group animate-in zoom-in-95 duration-200">
                                <div>
                                    <div className="text-xs font-bold text-white">{c.name}</div>
                                    <div className="text-[9px] text-emerald-500 font-mono font-bold uppercase">Pending Activation</div>
                                </div>
                                <button 
                                    onClick={() => removeCounty(c.fips)}
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        {territory.length === 0 && (
                            <div className="w-full py-12 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-700">
                                <Map size={32} className="mb-2 opacity-20" />
                                <div className="text-xs font-bold uppercase tracking-tighter">No Counties Selected</div>
                            </div>
                        )}
                    </div>
                </div>

                {extraCounties > 0 && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Info size={16} className="text-amber-500" />
                            <div className="text-xs font-bold text-white uppercase tracking-wide">{extraCounties} Expansion Territory Surcharge</div>
                        </div>
                        <div className="text-sm font-mono font-bold text-amber-500">+${extraCost.toLocaleString()}/mo</div>
                    </div>
                )}
            </div>
          )}

          {/* STEP 4: PARAMETERS */}
          {activeStep === 'parameters' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 border-l-2 border-emerald-500 pl-4 mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Buy Box Configuration</h3>
                </div>

                {territory.map((county, idx) => (
                    <div key={county.fips} className="p-6 bg-[#0A0A0A] rounded-2xl border border-white/10 space-y-6 relative overflow-hidden group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                    <MapPin size={18} className="text-emerald-500" />
                                    {county.name}
                                </h4>
                                <div className="text-[10px] text-gray-600 font-bold uppercase mt-1 tracking-widest">{county.state} • Individual Parameters</div>
                            </div>
                            <button 
                                onClick={() => syncAllCounties(county.fips)}
                                className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded uppercase hover:bg-emerald-500/20 transition-all"
                            >
                                Apply to All Markets
                            </button>
                        </div>

                        <div className="space-y-8 pt-4 border-t border-white/5">
                            {/* Asset Types */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Target Asset Types</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {PROPERTY_TYPE_OPTIONS.map(type => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                const current = parameters[county.fips].propertyTypes;
                                                const updated = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
                                                setParameters({ ...parameters, [county.fips]: { ...parameters[county.fips], propertyTypes: updated } });
                                            }}
                                            className={`px-3 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                                                parameters[county.fips].propertyTypes.includes(type) ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 border-white/10 text-gray-500'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Core Financials */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <DollarSign size={12} className="text-gray-500" />
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Max Price Ceiling</label>
                                    </div>
                                    <input 
                                        type="number" 
                                        value={parameters[county.fips].maxPrice} 
                                        onChange={e => setParameters({...parameters, [county.fips]: { ...parameters[county.fips], maxPrice: e.target.value }})}
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white font-mono focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp size={12} className="text-gray-500" />
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Min Equity %</label>
                                    </div>
                                    <input 
                                        type="number" 
                                        value={parameters[county.fips].minEquity} 
                                        onChange={e => setParameters({...parameters, [county.fips]: { ...parameters[county.fips], minEquity: e.target.value }})}
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white font-mono focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Property Features */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Layers size={12} className="text-gray-500" />
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Min Beds</label>
                                    </div>
                                    <input 
                                        type="number" 
                                        value={parameters[county.fips].minBeds} 
                                        onChange={e => setParameters({...parameters, [county.fips]: { ...parameters[county.fips], minBeds: e.target.value }})}
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white font-mono focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Maximize size={12} className="text-gray-500" />
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Min Baths</label>
                                    </div>
                                    <input 
                                        type="number" 
                                        value={parameters[county.fips].minBaths} 
                                        onChange={e => setParameters({...parameters, [county.fips]: { ...parameters[county.fips], minBaths: e.target.value }})}
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white font-mono focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Maximize size={12} className="text-gray-500" />
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Min Sq Ft</label>
                                    </div>
                                    <input 
                                        type="number" 
                                        value={parameters[county.fips].minSqFt} 
                                        onChange={e => setParameters({...parameters, [county.fips]: { ...parameters[county.fips], minSqFt: e.target.value }})}
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white font-mono focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Maximize size={12} className="text-gray-500" />
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Min Lot Size (SqFt)</label>
                                    </div>
                                    <input 
                                        type="number" 
                                        value={parameters[county.fips].minLotSize} 
                                        onChange={e => setParameters({...parameters, [county.fips]: { ...parameters[county.fips], minLotSize: e.target.value }})}
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white font-mono focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Geofencing */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <X size={12} className="text-red-500" />
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Excluded Zip Codes</label>
                                </div>
                                <input 
                                    placeholder="e.g. 60614, 60657, 60613"
                                    value={parameters[county.fips].excludedZips} 
                                    onChange={e => setParameters({...parameters, [county.fips]: { ...parameters[county.fips], excludedZips: e.target.value }})}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white font-mono focus:border-emerald-500 outline-none transition-colors"
                                />
                                <span className="text-[9px] text-gray-600 uppercase font-bold">Comma separated list</span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {territory.length === 0 && (
                    <div className="p-12 text-center text-gray-600 font-bold uppercase tracking-widest">
                        Define Territories First
                    </div>
                )}
            </div>
          )}

        </div>

        {/* Wizard Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
            <div className="text-left">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Estimated Monthly Total</div>
                <div className="text-2xl font-mono font-bold text-white">
                    ${(parseFloat(economics.clientPrice || '0') + extraCost).toLocaleString()}
                </div>
            </div>

            <div className="flex gap-4">
                {activeStep !== 'identity' && (
                    <button 
                        onClick={prevStep}
                        className="p-3 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}
                
                {activeStep === 'parameters' ? (
                    <button 
                        onClick={handleAddClient} 
                        disabled={!identity.name || !identity.email || territory.length === 0}
                        className={`px-8 py-3 font-bold rounded-lg transition-all transform active:scale-95 flex items-center gap-2 ${
                            !identity.name || !identity.email || territory.length === 0
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                        }`}
                    >
                        Provision Strategic Account
                    </button>
                ) : (
                    <button 
                        onClick={nextStep}
                        disabled={activeStep === 'economics' && (!isPriceValid || !isAdditionalPriceValid)}
                        className={`px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg flex items-center gap-2 transition-all ${
                            activeStep === 'economics' && (!isPriceValid || !isAdditionalPriceValid) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Continue
                        <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </div>
      </Modal>
    </div>
  );
};
