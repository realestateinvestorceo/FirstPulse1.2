import React from 'react';
import { Card } from '../../components/ui/Card';
import { 
  Database, 
  Filter, 
  Radio, 
  GitBranch, 
  Calendar, 
  Download, 
  PauseCircle, 
  CheckCircle2,
  User,
  Server,
  Sprout,
  RefreshCw,
  Layers,
  Zap,
  Flame,
  Activity,
  Timer,
  Snowflake,
  ShieldCheck,
  Save,
  RotateCcw,
  Settings
} from 'lucide-react';

const PipelineStep = ({ icon: Icon, label, last = false }: { icon: any, label: string, last?: boolean }) => (
  <div className="flex items-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-[#111111] border border-white/10 flex items-center justify-center text-emerald-500 shadow-lg shadow-black/50">
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center max-w-[80px] leading-tight">{label}</span>
    </div>
    {!last && (
      <div className="h-px w-8 md:w-16 bg-gradient-to-r from-white/10 to-white/5 mx-2 md:mx-4" />
    )}
  </div>
);

const InfoCard = ({ title, description }: { title: string, description: string }) => (
  <Card className="bg-[#111111] border-amber-500/20 hover:border-amber-500/40 transition-colors p-6 group">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
    </div>
    <p className="text-sm text-gray-400 leading-relaxed">
      {description}
    </p>
  </Card>
);

export const HowItWorks = () => {
  return (
    <div className="space-y-16 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pt-8">
        <h1 className="text-4xl font-bold text-white tracking-tight uppercase">How FirstPulse Works</h1>
        <p className="text-emerald-500 font-mono text-sm tracking-[0.2em] uppercase font-bold">The Automated Data Elimination Pipeline</p>
      </div>

      {/* Pipeline Visualization */}
      <div className="relative">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/5 -z-10" />
        <div className="overflow-x-auto py-8">
            <div className="flex items-start justify-center min-w-max px-8">
                <PipelineStep icon={Database} label="County Data" />
                <PipelineStep icon={Filter} label="Buy Box" />
                <PipelineStep icon={Radio} label="Signals" />
                <PipelineStep icon={GitBranch} label="Lanes" />
                <PipelineStep icon={Calendar} label="Cadence" />
                <PipelineStep icon={Download} label="Weekly Output" />
                <PipelineStep icon={PauseCircle} label="Cooldown" last />
            </div>
        </div>
      </div>

      {/* Explanation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard 
          title="Ingestion & Filtering" 
          description="Raw municipal record updates are pulled daily from county offices. The engine immediately eliminates records that don't match your specific Buy Box criteria (Price, Equity, Asset Type)."
        />
        <InfoCard 
          title="Signal Processing" 
          description="Remaining records are audited for distress Signals. If a match is found, the system assigns a Lane (Blitz, Chase, or Nurture) based on the severity of the distress event."
        />
        <InfoCard 
          title="Cadence & Sequence" 
          description="The Cadence Engine schedules follow-up attempts. Records move in and out of the Weekly Output based on their assigned sequence intervals, ensuring consistent follow-up without manual tracking."
        />
        <InfoCard 
          title="Elimination & Cooldown" 
          description="If a property sells, is listed on the MLS, or reaches its touch limit, the engine automatically moves it into Cooldown or permanent suppression to eliminate marketing waste."
        />
      </div>

      {/* Division of Responsibilities */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-8 md:p-12">
        <h2 className="text-center text-lg font-bold text-white uppercase tracking-widest mb-12 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-white/10" />
            Division of Responsibilities
            <div className="h-px w-12 bg-white/10" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
             {/* Divider for desktop */}
             <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

             {/* Engine Side */}
             <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                        <Server size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-500">WHAT THE ENGINE DECIDES</h3>
                </div>
                <ul className="space-y-4">
                    {[
                        "Who appears in your pool based on distress signals",
                        "When a record is ready for a follow-up marketing touch",
                        "When to pause a record because it sold or was listed"
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-emerald-100/80 text-sm leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
             </div>

             {/* User Side */}
             <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg text-white">
                        <User size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white">WHAT YOU DO</h3>
                </div>
                 <ul className="space-y-4">
                    {[
                        "Review your active records in the Lead Monitor audit view",
                        "Download your Weekly Output batch every Sunday",
                        "Execute the marketing (Mail, Cold Call, etc.) for the downloaded list"
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-4.5 h-4.5 rounded-full border border-white/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                            <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
             </div>
        </div>
      </div>

      {/* RECORD MATURITY STATES */}
      <div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Record Maturity States</h2>
            <p className="text-gray-500 text-sm font-mono mt-2 uppercase tracking-wide">How the engine categorizes records within your weekly output.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FRESH */}
            <Card className="bg-[#111111] border-emerald-500 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sprout size={64} className="text-emerald-500" />
                </div>
                <div className="text-emerald-500 font-bold tracking-widest uppercase text-sm mb-2">Fresh</div>
                <p className="text-gray-400 text-sm leading-relaxed">Records identified by the engine for the first time this week that match your criteria.</p>
            </Card>

            {/* REPEAT */}
            <Card className="bg-[#111111] border-blue-500 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <RefreshCw size={64} className="text-blue-500" />
                </div>
                <div className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-2">Repeat</div>
                <p className="text-gray-400 text-sm leading-relaxed">Existing records returning to your list because they are due for their next scheduled touch.</p>
            </Card>

            {/* QUEUE */}
            <Card className="bg-[#111111] border-white/20 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Layers size={64} className="text-gray-500" />
                </div>
                <div className="text-gray-500 font-bold tracking-widest uppercase text-sm mb-2">Queue</div>
                <p className="text-gray-400 text-sm leading-relaxed">Qualified records waiting for space in your weekly batch due to volume limits.</p>
            </Card>
        </div>
      </div>

      {/* THE HOT SHEET */}
      <Card className="bg-gradient-to-br from-amber-950/40 to-black border-amber-500/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        <div className="p-8 md:p-12 relative z-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-amber-500 rounded-lg text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                    <Zap size={32} fill="currentColor" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white uppercase italic tracking-tighter">The Hot Sheet</h2>
                    <div className="text-amber-500 font-mono font-bold tracking-widest text-xs uppercase mt-1">Hot Sheet = Fresh + Blitz</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-amber-500 font-bold uppercase tracking-wider text-sm mb-3">Priority Subset</h3>
                    <p className="text-gray-300 leading-relaxed border-l-2 border-amber-500/30 pl-4">
                        The Hot Sheet contains your most urgent, newly detected records. These should be your first priority for high-speed contact.
                    </p>
                </div>
                <div>
                    <h3 className="text-amber-500 font-bold uppercase tracking-wider text-sm mb-3">Persistence</h3>
                    <p className="text-gray-300 leading-relaxed border-l-2 border-amber-500/30 pl-4">
                        If a Hot Sheet is not downloaded, it rolls forward and remains prioritized until you execute or the signal expires.
                    </p>
                </div>
            </div>
        </div>
      </Card>

      {/* CADENCE & LANES */}
      <div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Cadence & Lanes</h2>
            <p className="text-gray-500 text-sm font-mono mt-2 uppercase tracking-wide">How the system paces follow-up based on distress severity.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* BLITZ */}
             <Card className="bg-[#111111] border-amber-500/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Flame size={20} className="text-amber-500" />
                    <h3 className="text-amber-500 font-bold uppercase tracking-wider">Blitz Lane</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">Critical distress signals. High-frequency cadence designed for immediate contact and resolution.</p>
             </Card>

             {/* CHASE */}
             <Card className="bg-[#111111] border-blue-500/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Activity size={20} className="text-blue-500" />
                    <h3 className="text-blue-500 font-bold uppercase tracking-wider">Chase Lane</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">Standard distress signals. Consistent follow-up intervals to maintain top-of-mind presence during the decision window.</p>
             </Card>

             {/* NURTURE */}
             <Card className="bg-[#111111] border-emerald-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Timer size={20} className="text-emerald-500/70" />
                    <h3 className="text-emerald-500/70 font-bold uppercase tracking-wider">Nurture Lane</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">Low-intensity or lifestyle signals. Long-cycle pacing to capture motivation changes over months or years.</p>
             </Card>
        </div>
      </div>

      {/* COOLDOWN LOGIC */}
      <Card className="bg-[#0f172a] border-cyan-900/30 p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="p-4 bg-cyan-950/30 rounded-full text-cyan-400">
              <Snowflake size={40} />
          </div>
          <div className="flex-1">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">The Cooldown Logic</h2>
              <p className="text-cyan-100/70 leading-relaxed mb-4">
                  The engine automatically moves a record into Cooldown when it reaches its maximum touch limit for the current cycle. This prevents over-contacting owners and violating marketing frequency standards.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/50 border border-cyan-800/50 rounded text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  <ShieldCheck size={12} />
                  Engine-Owned Property • Not User-Editable
              </div>
          </div>
      </Card>

      {/* WHAT HAPPENS IF YOU SKIP A WEEK */}
      <div>
         <h2 className="text-2xl font-bold text-white uppercase tracking-tight text-center mb-8">What Happens If You Skip A Week?</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="p-6 rounded-xl bg-[#111111] border border-white/5 hover:border-white/10 transition-colors">
                <div className="mb-4 text-emerald-500"><Save size={24} /></div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Zero Data Loss</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Every record identified by the engine remains stored and monitored in the Lead Monitor registry.</p>
             </div>
             <div className="p-6 rounded-xl bg-[#111111] border border-white/5 hover:border-white/10 transition-colors">
                <div className="mb-4 text-gray-400"><RotateCcw size={24} /></div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">No Touches Counted</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Records only increment their "touch count" when a Weekly Output file is actually downloaded.</p>
             </div>
             <div className="p-6 rounded-xl bg-[#111111] border border-white/5 hover:border-white/10 transition-colors">
                <div className="mb-4 text-amber-500"><Zap size={24} /></div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Persistence</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Unprocessed records carry forward and reappear in the next week's output until activated.</p>
             </div>
             <div className="p-6 rounded-xl bg-[#111111] border border-white/5 hover:border-white/10 transition-colors">
                <div className="mb-4 text-indigo-500"><Settings size={24} /></div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Auto-Adjust</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Lanes may update automatically based on time elapsed, ensuring you always see the current priority.</p>
             </div>
         </div>
      </div>

      {/* Footer Badge */}
      <div className="flex justify-center pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-500/50 uppercase tracking-[0.2em]">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
             Automated Governance Mode: Active
          </div>
      </div>
    </div>
  );
};