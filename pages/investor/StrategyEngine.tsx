import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Lock, GitBranch, AlertTriangle, Calendar, Activity, CheckCircle2, Shield, MapPin } from 'lucide-react';

interface LaneColumnProps {
  title: string;
  badge: string;
  frequency: string;
  maxTouches: string;
  signals: string[];
  titleColor: string;
  borderColorClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  dotColorClass: string;
}

const LaneColumn: React.FC<LaneColumnProps> = ({ 
  title, 
  badge, 
  frequency, 
  maxTouches, 
  signals, 
  titleColor,
  borderColorClass,
  badgeBgClass,
  badgeTextClass,
  dotColorClass
}) => (
  <Card className={`h-full bg-[#111111] border ${borderColorClass} flex flex-col hover:border-opacity-50 transition-colors`}>
    <div className={`p-4 border-b ${borderColorClass} flex justify-between items-center bg-white/[0.02]`}>
      <h3 className={`font-bold tracking-wider ${titleColor}`}>{title}</h3>
      <div className={`w-6 h-6 rounded-full ${badgeBgClass} ${badgeTextClass} flex items-center justify-center font-bold text-xs`}>
        {badge}
      </div>
    </div>
    <div className="p-4 bg-black/20 border-b border-white/5">
      <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-1">
        <Calendar size={12} />
        <span className="uppercase">{frequency}</span>
      </div>
      <div className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">
        {maxTouches}
      </div>
    </div>
    <div className="p-4 flex-1 overflow-y-auto">
       <ul className="space-y-3">
         {signals.map((signal) => (
           <li key={signal} className="text-xs text-gray-400 flex items-start gap-2 leading-relaxed">
             <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotColorClass}`} />
             <span>{signal}</span>
           </li>
         ))}
       </ul>
    </div>
  </Card>
);

const ReadOnlySlider = ({ label, value, min, max, unit = '', formatVal = (v: any) => v }: any) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
        <span>{label}</span>
        <span className="text-emerald-500 font-mono">{formatVal(value)}{unit}</span>
      </div>
      <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-emerald-500/50" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const AssetToggle = ({ label, active }: { label: string, active: boolean }) => (
  <div className={`
    px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-colors
    ${active 
      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
      : 'bg-white/5 text-gray-600 border-white/5 opacity-50'}
  `}>
    {label}
  </div>
);

const ReadOnlyDropdown = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">{label}</label>
    <div className="w-full bg-[#0A0A0A] border border-white/10 rounded px-3 py-2 text-sm text-gray-400 font-mono flex justify-between items-center">
        {value}
        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-600" />
    </div>
  </div>
);

export const StrategyEngine = () => {
  const [activeTab, setActiveTab] = useState<'cadence' | 'buybox'>('cadence');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Strategy Engine</h1>
          <p className="text-gray-500 mt-1 text-sm font-mono uppercase tracking-wide">System Rules & Protocol Configuration</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-gray-500">
          <Lock size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Read-Only Logic</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('cadence')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'cadence' ? 'text-emerald-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Cadence Profile
          {activeTab === 'cadence' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
        </button>
        <button 
          onClick={() => setActiveTab('buybox')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'buybox' ? 'text-emerald-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Buy Box Criteria
          {activeTab === 'buybox' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
        </button>
      </div>

      {activeTab === 'cadence' ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Banner */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#111111] to-black border border-emerald-500/10 flex items-start gap-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />
            
            <div className="p-3 bg-[#0A0A0A] rounded-lg text-emerald-500 border border-emerald-500/20 shadow-lg relative z-10">
              <GitBranch size={24} />
            </div>
            <div className="relative z-10">
              <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                Automated Routing Protocol
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                Lane assignment is controlled by the distress severity engine. Frequency and sequence duration are calibrated based on conversion velocity audits.
              </p>
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LaneColumn 
              title="BLITZ LANE" 
              badge="1"
              frequency="Every 14 Days"
              maxTouches="Max 12 Touches"
              titleColor="text-amber-500"
              borderColorClass="border-amber-500/20"
              badgeBgClass="bg-amber-500"
              badgeTextClass="text-black"
              dotColorClass="bg-amber-500"
              signals={[
                'Pre-Foreclosure', 'Foreclosure', 'Tax Sale', 'High Tax Delinquency', 
                'Probate', 'Inheriting Property', 'Deceased Owner', 'Bankruptcy', 
                'Fire Damage', 'Utility Shutoff', 'Sheriff Sale'
              ]}
            />
            <LaneColumn 
              title="CHASE LANE" 
              badge="2"
              frequency="Every 30 Days"
              maxTouches="Max 18 Touches"
              titleColor="text-indigo-500"
              borderColorClass="border-indigo-500/20"
              badgeBgClass="bg-indigo-500"
              badgeTextClass="text-white"
              dotColorClass="bg-indigo-500"
              signals={[
                'Vacant Property', 'Eviction', 'Expired Listing', 'Failed Listing', 
                'Divorce', 'Code Violation', 'Legal Case Involving Owner', 
                'Loan Modification', 'Moderate Tax Delinquency'
              ]}
            />
             <LaneColumn 
              title="NURTURE LANE" 
              badge="3"
              frequency="Every 45 Days"
              maxTouches="Max 10 Touches"
              titleColor="text-emerald-500/70"
              borderColorClass="border-emerald-500/20"
              badgeBgClass="bg-emerald-500/50"
              badgeTextClass="text-white"
              dotColorClass="bg-emerald-500/50"
              signals={[
                'Senior Downsizing', 'Adjustable-Rate Mortgage Reset', 'Potential Inheritance', 
                'Property in Trust', 'Long-Term Owner', 'Absentee Owner', 'Vacant Land', 
                'Investor Fatigue', 'Wholesale Opportunity (AI)', 'Rental Opportunity (AI)', 
                'Retail Opportunity (AI)'
              ]}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-[#111111] border-white/5 p-4 flex items-center justify-between">
                  <div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Estimated Output</div>
                      <div className="text-xl text-white font-mono font-bold">~165 RECORDS/WEEK</div>
                  </div>
                  <Activity className="text-emerald-500 opacity-50" />
              </Card>
              <Card className="bg-[#111111] border-white/5 p-4 flex items-center gap-4">
                  <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500">
                      <CheckCircle2 size={24} />
                  </div>
                  <div>
                      <div className="text-xs text-emerald-500 font-bold uppercase tracking-wider mb-0.5">Criteria Health Status</div>
                      <p className="text-sm text-gray-400">Optimization: Buy Box parameters are balanced for healthy deal flow.</p>
                  </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Left Col - Overrides (Span 2) */}
               <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Market Eligibility Overrides</h3>
                  
                  {/* County Cards */}
                  {[{ county: 'Cook County', state: 'IL' }, { county: 'Harris County', state: 'TX' }].map((market) => (
                     <Card key={market.county} className="bg-[#111111] border-white/5 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-lg font-bold text-white">{market.county}, {market.state}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                     <Shield size={12} className="text-emerald-500" />
                                     <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Global Engine Logic Applied</span>
                                </div>
                            </div>
                            <MapPin className="text-gray-600" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                             <ReadOnlySlider label="Max Price Ceiling" value={850000} min={0} max={2000000} unit="" formatVal={(v: number) => `$${v.toLocaleString()}`} />
                             <ReadOnlySlider label="Min Equity Threshold" value={30} min={0} max={100} unit="%" />
                        </div>

                        <div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Asset Configuration</div>
                            <div className="flex flex-wrap gap-2">
                                <AssetToggle label="Single Family" active={true} />
                                <AssetToggle label="Multi-Family 2-4" active={true} />
                                <AssetToggle label="Condo" active={false} />
                                <AssetToggle label="Townhouse" active={false} />
                                <AssetToggle label="Land" active={false} />
                                <AssetToggle label="Commercial" active={false} />
                            </div>
                        </div>
                     </Card>
                  ))}
               </div>

               {/* Right Col - Master */}
               <div className="space-y-6">
                   <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Global Buy Box (Master)</h3>
                   <Card className="bg-[#111111] border-emerald-500/20 h-full">
                       <div className="p-4 border-b border-emerald-500/10 bg-emerald-500/5 flex justify-between items-center">
                           <span className="text-sm font-bold text-emerald-500 tracking-wide">MASTER BASELINE</span>
                           <Shield size={16} className="text-emerald-500" />
                       </div>
                       <div className="p-6 space-y-8">
                           <div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Property Types</div>
                                <div className="flex flex-wrap gap-2">
                                    <AssetToggle label="Single Family" active={true} />
                                    <AssetToggle label="Multi-Family 2-4" active={true} />
                                    <AssetToggle label="Condo" active={false} />
                                    <AssetToggle label="Townhouse" active={false} />
                                    <AssetToggle label="Land" active={false} />
                                    <AssetToggle label="Commercial" active={false} />
                                </div>
                           </div>

                           <div className="p-4 rounded bg-amber-500/10 border border-amber-500/20 flex gap-3">
                               <AlertTriangle className="text-amber-500 flex-shrink-0" size={18} />
                               <p className="text-xs text-amber-200/80 leading-relaxed">
                                   Changes here affect all counties unless a specific override exists for that market.
                               </p>
                           </div>
                       </div>
                   </Card>
               </div>
            </div>

            {/* Bottom Section - Tuning */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-4">Global Baseline Tuning</h3>
                <Card className="bg-[#111111] border-white/5 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                         <div className="lg:col-span-2">
                              <ReadOnlySlider label="Global Max Price" value={850000} min={0} max={2000000} unit="" formatVal={(v: number) => `$${v.toLocaleString()}`} />
                         </div>
                         <div className="lg:col-span-2">
                              <ReadOnlySlider label="Global Min Equity" value={30} min={0} max={100} unit="%" />
                         </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <ReadOnlyDropdown label="Min Beds" value="Any" />
                        <ReadOnlyDropdown label="Min Baths" value="Any" />
                        <ReadOnlyDropdown label="Min Sq Ft" value="Any" />
                        <ReadOnlyDropdown label="Min Lot Size (Ac)" value="Any" />
                    </div>
                </Card>
            </div>
            
            <div className="flex justify-end pt-4">
                <button disabled className="px-6 py-3 bg-white/5 text-gray-500 font-bold rounded-lg uppercase tracking-wider text-sm cursor-not-allowed border border-white/5 hover:border-white/10 transition-colors">
                    Save Profile Configuration
                </button>
            </div>
        </div>
      )}
    </div>
  );
};