import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../services/mockBackend';
import { 
  Property, 
  ClientRecordTracking, 
  Lane, 
  TrackingStatus,
  DistressSignal
} from '../../types';
import { 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  AlertCircle,
  ArrowRight,
  X,
  Users,
  Snowflake,
  Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Link } from 'react-router-dom';

type TrackedProperty = Property & { _tracking?: ClientRecordTracking };
type FilterType = 'ALL' | 'ACTIVE' | 'COOLDOWN' | 'REMOVED';

const StatCard = ({ label, value, color = 'text-white' }: { label: string; value: number; color?: string }) => (
  <Card className="bg-[#111111] border-white/5">
    <div className="p-4 text-center">
      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-2xl font-mono font-bold ${color}`}>{value}</div>
    </div>
  </Card>
);

const FilterButton: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({ active, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors border ${
      active 
        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
        : 'bg-[#111111] text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/10'
    }`}
  >
    {label}
  </button>
);

export const LeadMonitor = () => {
  const [properties, setProperties] = useState<TrackedProperty[]>([]);
  const [distressSignals, setDistressSignals] = useState<DistressSignal[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [laneFilter, setLaneFilter] = useState<Lane | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterType>('ACTIVE');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [props, signals] = await Promise.all([
        api.getProperties(201),
        api.getDistressSignals()
      ]);
      setProperties(props);
      setDistressSignals(signals);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Compute Stats
  const stats = useMemo(() => {
    return {
      active: properties.filter(p => p._tracking?.status === TrackingStatus.Active).length,
      blitz: properties.filter(p => p._tracking?.lane === 'Blitz' && p._tracking?.status === TrackingStatus.Active).length,
      chase: properties.filter(p => p._tracking?.lane === 'Chase' && p._tracking?.status === TrackingStatus.Active).length,
      nurture: properties.filter(p => p._tracking?.lane === 'Nurture' && p._tracking?.status === TrackingStatus.Active).length,
      removed: properties.filter(p => p._tracking?.status.toString().includes('Removed')).length,
      cooldown: properties.filter(p => p._tracking?.status === TrackingStatus.CoolingDown).length,
    };
  }, [properties]);

  // Compute Owner Property Counts
  const ownerCounts = useMemo(() => {
      const counts = new Map<number, number>();
      properties.forEach(p => {
          if (p.ownerId) {
              counts.set(p.ownerId, (counts.get(p.ownerId) || 0) + 1);
          }
      });
      return counts;
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (!p._tracking) return false;
      
      // Lane Filter
      if (laneFilter && p._tracking.lane !== laneFilter) return false;
      
      // Status Filter
      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'ACTIVE') return p._tracking.status === TrackingStatus.Active || p._tracking.status === TrackingStatus.ContactConstrained;
      if (statusFilter === 'COOLDOWN') return p._tracking.status === TrackingStatus.CoolingDown;
      if (statusFilter === 'REMOVED') return p._tracking.status.toString().includes('Removed');
      
      return true;
    });
  }, [properties, laneFilter, statusFilter]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const clearFilters = () => {
    setLaneFilter(null);
    setStatusFilter('ACTIVE');
  };

  const getLaneColor = (lane?: Lane, status?: TrackingStatus) => {
    if (status === TrackingStatus.CoolingDown) return 'bg-cyan-500';
    if (status === TrackingStatus.ContactConstrained) return 'bg-gray-700';
    switch(lane) {
      case 'Blitz': return 'bg-amber-500';
      case 'Chase': return 'bg-indigo-500';
      case 'Nurture': return 'bg-emerald-500/50'; 
      default: return 'bg-gray-500';
    }
  };

  const getLaneTextClass = (lane?: Lane, status?: TrackingStatus) => {
    if (status === TrackingStatus.CoolingDown) return 'text-cyan-500';
    if (status === TrackingStatus.ContactConstrained) return 'text-gray-500';
    switch(lane) {
      case 'Blitz': return 'text-amber-500';
      case 'Chase': return 'text-indigo-500';
      case 'Nurture': return 'text-emerald-500/70';
      default: return 'text-gray-500';
    }
  };

  const getSignalConfig = (tag: string) => distressSignals.find(s => s.signalKey === tag);
  const isUrgentSignal = (tag: string) => ['foreclosure', 'pre-foreclosure', 'tax-sale'].includes(tag);

  // Skip Trace Status Helper
  const getSkipStatus = (tracking: ClientRecordTracking) => {
      if (!tracking.skipTracedAt) return 'NOT TRACED';
      const date = new Date(tracking.skipTracedAt);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
  };
  
  const getDaysRemaining = (endStr?: string) => {
      if (!endStr) return 0;
      const end = new Date(endStr).getTime();
      const now = new Date().getTime();
      const diff = end - now;
      if (diff <= 0) return 0;
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) return <div className="p-12 text-center text-emerald-500 animate-pulse font-mono tracking-wider">Loading Intelligence Engine...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">LEAD MONITOR</h1>
          <p className="text-gray-500 mt-1">Real-time audit of records identified by the engine.</p>
        </div>
        <Link to="/investor/how-it-works" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 underline decoration-dotted underline-offset-4 uppercase tracking-wider">
          How FirstPulse Works
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatCard label="Active Pool" value={stats.active} />
        <StatCard label="Blitz Lane" value={stats.blitz} color="text-amber-500" />
        <StatCard label="Chase Lane" value={stats.chase} color="text-indigo-500" />
        <StatCard label="Nurture Lane" value={stats.nurture} color="text-emerald-500/70" />
        <StatCard label="In Cooldown" value={stats.cooldown} color="text-cyan-500" />
        <StatCard label="Removed" value={stats.removed} color="text-rose-500" />
      </div>

      {/* Filter Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-y border-white/5 py-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {(['Blitz', 'Chase', 'Nurture'] as Lane[]).map(lane => (
               <FilterButton 
                 key={lane} 
                 active={laneFilter === lane} 
                 label={lane.toUpperCase()} 
                 onClick={() => setLaneFilter(laneFilter === lane ? null : lane)} 
               />
            ))}
          </div>
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          <div className="flex gap-2">
             <FilterButton active={statusFilter === 'ALL'} label="ALL" onClick={() => setStatusFilter('ALL')} />
             <FilterButton active={statusFilter === 'ACTIVE'} label="ACTIVE" onClick={() => setStatusFilter('ACTIVE')} />
             <FilterButton active={statusFilter === 'COOLDOWN'} label="COOLDOWN" onClick={() => setStatusFilter('COOLDOWN')} />
             <FilterButton active={statusFilter === 'REMOVED'} label="REMOVED" onClick={() => setStatusFilter('REMOVED')} />
          </div>
        </div>
        
        {(laneFilter || statusFilter !== 'ACTIVE') && (
            <button onClick={clearFilters} className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-1 uppercase tracking-wider transition-colors">
                <X size={14} /> Clear Active Segment
            </button>
        )}
      </div>

      {/* Data Grid */}
      <div className="space-y-3">
        {filteredProperties.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-[#111111] border border-white/5 rounded-xl border-dashed">
                No records found matching current segment filters.
            </div>
        ) : filteredProperties.map(prop => {
            const isExpanded = expandedId === prop.id;
            const tracking = prop._tracking!;
            const ownerPropCount = prop.ownerId ? (ownerCounts.get(prop.ownerId) || 1) : 1;
            const isConstrained = tracking.status === TrackingStatus.ContactConstrained;
            const isCoolingDown = tracking.status === TrackingStatus.CoolingDown;
            const daysRemaining = isCoolingDown ? getDaysRemaining(tracking.cooldownEndAt) : 0;
            const skipStatus = getSkipStatus(tracking);
            const hasPhone = skipStatus !== 'NOT TRACED';
            
            return (
                <div key={prop.id} className={`bg-[#111111] border ${isCoolingDown ? 'border-cyan-900/40 bg-cyan-950/5' : 'border-white/5'} rounded-lg overflow-hidden transition-all hover:border-white/10`}>
                    {/* Main Row */}
                    <div 
                        onClick={() => toggleExpand(prop.id)}
                        className="p-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer group"
                    >
                        {/* Lane Indicator */}
                        <div className="w-32 flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getLaneColor(tracking.lane, tracking.status)}`} />
                            <span className={`text-xs font-bold uppercase tracking-wider ${getLaneTextClass(tracking.lane, tracking.status)}`}>
                                {isCoolingDown ? 'COOLDOWN' : tracking.lane}
                            </span>
                        </div>

                        {/* Address */}
                        <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold transition-colors ${
                                    isConstrained ? 'text-gray-500 line-through decoration-gray-700' : 
                                    isCoolingDown ? 'text-cyan-200' :
                                    'text-white group-hover:text-emerald-500'
                                }`}>
                                    {prop.addressLine1}
                                </span>
                                {isConstrained && (
                                    <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 text-[9px] font-bold uppercase border border-gray-700">
                                        Superseded
                                    </span>
                                )}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono uppercase mt-0.5 flex items-center gap-2">
                                {prop.addressCity}, {prop.addressState} • {prop.fips === '17031' ? 'Cook County' : 'Harris County'}
                                
                                {ownerPropCount > 1 && (
                                    <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-1.5 rounded border border-blue-500/10">
                                        <Users size={10} />
                                        Owner has {ownerPropCount} properties
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Cooldown Info (if active) */}
                        {isCoolingDown && (
                             <div className="w-32 flex flex-col justify-center">
                                 <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                                     <Snowflake size={12} />
                                     {daysRemaining} Days
                                 </div>
                                 <div className="text-[9px] text-cyan-500/60 uppercase font-mono">Until Re-Activation</div>
                             </div>
                        )}

                        {/* Skip Status */}
                        {!isCoolingDown && (
                            <div className="w-24 text-right md:text-left">
                                <div className="text-[10px] text-gray-600 uppercase font-bold">Last Traced</div>
                                <div className={`text-xs font-mono ${hasPhone ? 'text-emerald-500' : 'text-gray-600'}`}>{skipStatus}</div>
                            </div>
                        )}

                         {/* Signal Intel */}
                         <div className="w-32">
                             <div className={`flex items-center gap-1.5 ${isConstrained ? 'text-gray-600' : isCoolingDown ? 'text-cyan-600' : 'text-emerald-500'}`}>
                                <span className="text-xs font-bold">{prop.tags.length} SIGNALS</span>
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                             </div>
                        </div>

                        {/* Phone Indicator */}
                        <div className="w-20 flex justify-end">
                            {hasPhone && (
                                <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                                    <Phone size={12} />
                                    <span className="text-xs font-mono font-bold">YES</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Expanded Detail View */}
                    {isExpanded && (
                        <div className="border-t border-white/5 bg-[#0A0A0A] p-6 animate-in slide-in-from-top-2 duration-200">
                            {isConstrained && (
                                <div className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-lg flex gap-3 items-start">
                                    <Users size={16} className="text-gray-500 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-300 uppercase">Contact Deduplication Active</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            This property is currently constrained because another property owned by the same contact has a higher priority score. 
                                            Marketing is focused on the lead asset to prevent over-contacting.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {isCoolingDown && (
                                <div className="mb-6 p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-lg flex gap-3 items-start">
                                    <Snowflake size={16} className="text-cyan-400 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-cyan-300 uppercase">Engine Cooldown Active</h4>
                                        <p className="text-xs text-cyan-100/70 mt-1">
                                            This record has been temporarily paused to prevent over-contacting. 
                                            It will automatically re-activate on <span className="font-mono font-bold text-white">{new Date(tracking.cooldownEndAt!).toLocaleDateString()}</span> or if a new high-priority distress signal is detected.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <AlertCircle size={14} />
                                    Signal Audit Intel
                                </div>
                                <div className="flex gap-6 text-right">
                                    <div>
                                        <div className="text-[10px] text-gray-600 uppercase font-bold">Detected</div>
                                        <div className="text-xs font-mono text-white">NOV 22</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-600 uppercase font-bold">Score</div>
                                        <div className="text-xs font-mono text-emerald-500 font-bold">{tracking.finalAllocationPoints}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-600 uppercase font-bold">Touch Count</div>
                                        <div className="text-xs font-mono text-white font-bold">{tracking.touchCount}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {prop.tags.map(tag => {
                                    const config = getSignalConfig(tag);
                                    const urgent = isUrgentSignal(tag);
                                    
                                    return (
                                        <div 
                                            key={tag} 
                                            className={`p-4 rounded-lg border ${
                                                urgent 
                                                ? 'bg-rose-950/10 border-rose-500/20' 
                                                : 'bg-white/5 border-white/5'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-xs font-bold uppercase tracking-wider ${urgent ? 'text-rose-500' : 'text-gray-200'}`}>
                                                    {config?.displayName || tag}
                                                </span>
                                                <span className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded border ${
                                                    config?.defaultLane === 'Blitz' ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' :
                                                    config?.defaultLane === 'Chase' ? 'text-indigo-500 border-indigo-500/30 bg-indigo-500/10' :
                                                    'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
                                                }`}>
                                                    {config?.defaultLane || 'Nurture'}
                                                </span>
                                            </div>
                                            <p className={`text-xs ${urgent ? 'text-rose-200/70' : 'text-gray-500'}`}>
                                                {urgent 
                                                    ? 'High urgency signal detected. Immediate verification required.' 
                                                    : 'Standard monitoring protocols active. No immediate escalation.'}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};