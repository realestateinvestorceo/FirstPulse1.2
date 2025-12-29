
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/mockBackend';
import { WeeklyBatch } from '../../types';
import { 
  Download, 
  Flame, 
  CheckCircle2, 
  ArrowRight,
  AlertTriangle,
  Loader2,
  FileDown,
  Users,
  Search,
  Map,
  TrendingUp,
  Clock,
  X,
  BookOpen
} from 'lucide-react';

const Counter = ({ label, sublabel, value, brightness = 'text-white' }: { label: string; sublabel: string; value: string; brightness?: string }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 font-medium tracking-wider mb-1 uppercase">{label}</span>
    <span className={`text-4xl font-mono font-bold ${brightness}`}>{value}</span>
    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tight mt-1">{sublabel}</span>
  </div>
);

const LaneCard = ({ label, sublabel, value, color, dotColor }: { label: string; sublabel: string; value: string; color?: string; dotColor: string }) => (
  <Card className="flex-1 bg-[#111111] border-white/5 hover:border-white/10 transition-colors">
    <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${dotColor}`} />
            <span className="text-xs text-gray-400 font-bold tracking-wider">{label}</span>
        </div>
        <div className="text-3xl font-mono text-white font-medium mb-1">{value}</div>
        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-tight">{sublabel}</div>
    </div>
  </Card>
);

const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div className="fixed bottom-6 right-6 bg-[#111111] border border-emerald-500/50 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
     <div className="p-1 bg-emerald-500/20 rounded-full text-emerald-500">
        <CheckCircle2 size={16} />
     </div>
     <div className="flex-1">
         <p className="text-sm font-medium">{message}</p>
     </div>
     <button onClick={onClose} className="text-gray-500 hover:text-white ml-2"><X size={16} /></button>
  </div>
);

export const InvestorDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [batchExecuted, setBatchExecuted] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [latestBatch, setLatestBatch] = useState<WeeklyBatch | null>(null);
    const [stats, setStats] = useState<{ active: number, cooldown: number, removed: number } | null>(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
    
    // Skip Trace State
    const [includeSkipTrace, setIncludeSkipTrace] = useState(false);
    const [traceEstimate, setTraceEstimate] = useState<{ eligibleCount: number, alreadyTracedCount: number, rate: number, totalCost: number } | null>(null);

    // Initial load to check if recently executed or to get stats
    useEffect(() => {
        const loadDashboardData = async () => {
            const [batches, statsData, clientData] = await Promise.all([
                api.getWeeklyBatches(201),
                api.getInvestorStats(201),
                api.getClientById(201)
            ]);
            
            if (batches.length > 0) {
                setLatestBatch(batches[0]);
            }
            setStats(statsData);
            if (clientData) {
                setWalletBalance(clientData.skipTraceWalletBalance);
                
                // Check if user has never downloaded a batch and hasn't dismissed the banner
                const dismissed = localStorage.getItem('fp_welcome_dismissed');
                if (!clientData.firstBatchGeneratedAt && dismissed !== 'true') {
                    setShowWelcomeBanner(true);
                }
            }
        }
        loadDashboardData();
    }, [batchExecuted]);

    // Load Trace Estimates when modal opens
    useEffect(() => {
        if (isModalOpen) {
            api.getBatchSkipTraceEstimates(201).then(setTraceEstimate);
        }
    }, [isModalOpen]);

    const handleDownloadClick = () => {
        if (!batchExecuted) {
            setIsModalOpen(true);
        }
    };

    const dismissWelcomeBanner = () => {
        setShowWelcomeBanner(false);
        localStorage.setItem('fp_welcome_dismissed', 'true');
    };

    const convertToCSV = (data: any[]) => {
        if (data.length === 0) return '';
        const headers = Object.keys(data[0]);
        const rows = data.map(obj => headers.map(header => {
            const val = obj[header];
            return `"${String(val).replace(/"/g, '""')}"`; // Escape quotes
        }).join(','));
        return [headers.join(','), ...rows].join('\n');
    };

    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const executeBatch = async () => {
        setIsProcessing(true);
        try {
            const { batch, csvData } = await api.executeWeeklyBatch(201, { skipTrace: includeSkipTrace });
            
            // Generate CSV
            const csvContent = convertToCSV(csvData);
            downloadCSV(csvContent, `FirstPulse_Output_${batch.batchId}.csv`);
            
            setBatchExecuted(true);
            setLatestBatch(batch);
            setIsModalOpen(false);
            setToastMessage(`Batch downloaded successfully. ${batch.totalRecords} records exported.`);
            setTimeout(() => setToastMessage(null), 5000);
            
            // Update balance locally
            if (includeSkipTrace && traceEstimate) {
                setWalletBalance(prev => prev - traceEstimate.totalCost);
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to generate batch.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2 uppercase">Weekly Output</h1>
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 tracking-wider">
                            ENGINE STATUS: SYNCED
                        </span>
                        <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                            Active Output • Week of Dec 22, 2025
                        </span>
                    </div>
                </div>
            </div>

            {/* Welcome Banner */}
            {showWelcomeBanner && (
                <div className="relative p-6 bg-[#111111] border border-emerald-500/30 rounded-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                👋 Welcome to FirstPulse
                            </h3>
                            <button onClick={dismissWelcomeBanner} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-white text-lg font-medium mb-6">Your weekly marketing list is ready. Here's how it works:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                             {[
                                 { text: "Review your numbers below", desc: "(Fresh = new leads, Repeat = follow-ups, Queue = backfill)" },
                                 { text: "Click \"Download Weekly Batch\"", desc: "To get your marketing list" },
                                 { text: "Execute your marketing", desc: "(mail, call, text) on those contacts" },
                                 { text: "Come back next week", desc: "For your next automated batch" }
                             ].map((step, i) => (
                                 <div key={i} className="flex gap-4">
                                     <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-500 shrink-0">
                                         {i + 1}
                                     </div>
                                     <div>
                                         <div className="text-sm font-bold text-white">{step.text}</div>
                                         <div className="text-xs text-gray-500">{step.desc}</div>
                                     </div>
                                 </div>
                             ))}
                        </div>
                        <div className="flex gap-4">
                            <Link 
                                to="/investor/how-it-works"
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                            >
                                Learn More
                                <ArrowRight size={14} />
                            </Link>
                            <button 
                                onClick={dismissWelcomeBanner}
                                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Strategy Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Export Card */}
                <Card className="lg:col-span-2 bg-[#111111] border-white/10 relative overflow-hidden group h-full">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                     
                    <div className="p-8 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="text-xs font-bold text-emerald-500 tracking-widest uppercase mb-2">Primary Strategy Action</div>
                                    <h2 className="text-3xl text-white italic font-serif">Export Weekly Output</h2>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl text-emerald-500 border border-white/5">
                                    <Download size={24} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8 mb-10">
                                <Counter label="FRESH" sublabel="New leads this week" value={latestBatch ? latestBatch.freshCount.toString() : "--"} brightness="text-white" />
                                <Counter label="REPEAT" sublabel="Follow-up contacts" value={latestBatch ? latestBatch.repeatCount.toString() : "--"} brightness="text-gray-400" />
                                <Counter label="QUEUE" sublabel="Backfill from pool" value={latestBatch ? latestBatch.queueCount.toString() : "--"} brightness="text-gray-600" />
                            </div>
                        </div>

                        <button 
                            onClick={handleDownloadClick}
                            disabled={batchExecuted}
                            className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform ${
                                batchExecuted 
                                ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' 
                                : 'bg-emerald-600 hover:bg-emerald-500 text-black hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(0,210,106,0.2)]'
                            }`}
                        >
                            {batchExecuted ? (
                                <>
                                    <CheckCircle2 size={18} />
                                    <span className="tracking-wide uppercase">Batch Completed</span>
                                </>
                            ) : (
                                <>
                                    <span className="tracking-wide uppercase">Download Weekly Batch</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </Card>

                {/* Hot Sheet Card */}
                <Link to="/investor/lead-monitor?filter=blitz&status=active" className="block h-full group cursor-pointer">
                    <Card className="bg-[#111111] border-amber-500/20 relative overflow-hidden h-full group-hover:border-amber-500/40 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="p-8 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-xs font-bold text-amber-500 tracking-widest uppercase">72-Hour Priority</div>
                                    <Flame className="text-amber-500 fill-amber-500/20" size={24} />
                                </div>
                                <h2 className="text-2xl text-white flex items-center gap-2 font-semibold">
                                    HOT SHEET 
                                    <ArrowRight size={20} className="text-amber-500/50 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                </h2>
                                <p className="text-sm text-gray-400 mt-4 leading-relaxed border-l-2 border-amber-500/20 pl-4">
                                    Urgent high-probability distress signals requiring rapid follow-up action.
                                </p>
                            </div>
                            
                            <div className="mt-8">
                                <div className="text-7xl font-mono font-bold text-white mb-2 tracking-tighter">
                                    {latestBatch ? latestBatch.blitzCount : '--'}
                                </div>
                                <div className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 tracking-widest uppercase">
                                    Blitz Lane Active
                                </div>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>

            {/* Lane Breakdown Section */}
            <div>
                 <div className="flex items-center justify-between mb-4 px-1">
                    <div className="text-xs font-bold text-gray-500 tracking-widest uppercase">Lane Breakdown</div>
                    <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 rounded">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">Logic Finalized</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <LaneCard label="BLITZ" sublabel="Urgent - time sensitive" value={latestBatch ? latestBatch.blitzCount.toString() : '--'} dotColor="bg-amber-500" />
                    <LaneCard label="CHASE" sublabel="Active - needs follow-up" value={latestBatch ? latestBatch.chaseCount.toString() : '--'} dotColor="bg-indigo-500" />
                    <LaneCard label="NURTURE" sublabel="Long-term prospects" value={latestBatch ? latestBatch.nurtureCount.toString() : '--'} dotColor="bg-gray-500" />
                 </div>
            </div>

            {/* Modal for Execution */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Confirm Weekly Batch Execution"
                icon={<FileDown className="text-emerald-500" />}
            >
                <div className="space-y-6">
                    {/* Info Boxes */}
                    {latestBatch && (
                        <div className="grid grid-cols-2 gap-4">
                             <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                 <div className="text-[10px] text-gray-500 uppercase font-bold">Total Records</div>
                                 <div className="text-xl font-mono text-white font-bold">{latestBatch.totalRecords}</div>
                             </div>
                             <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                 <div className="text-[10px] text-gray-500 uppercase font-bold">Est. Fresh</div>
                                 <div className="text-xl font-mono text-emerald-500 font-bold">{latestBatch.freshCount}</div>
                             </div>
                        </div>
                    )}

                    {/* Skip Trace Section */}
                    <div className="p-4 bg-[#0A0A0A] border border-white/10 rounded-xl">
                         <div className="flex justify-between items-start mb-4">
                             <div>
                                 <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                     <Search size={14} className="text-emerald-500" />
                                     Skip Trace Enrichment
                                 </h4>
                                 <p className="text-xs text-gray-500 mt-1">Append phone numbers/emails to fresh records.</p>
                             </div>
                             <div className={`w-10 h-6 rounded-full p-1 flex items-center cursor-pointer transition-colors ${includeSkipTrace ? 'bg-emerald-600' : 'bg-gray-700'}`} onClick={() => setIncludeSkipTrace(!includeSkipTrace)}>
                                 <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${includeSkipTrace ? 'translate-x-4' : 'translate-x-0'}`} />
                             </div>
                         </div>

                         {includeSkipTrace && traceEstimate && (
                             <div className="pt-4 border-t border-white/10 space-y-3">
                                 <div className="flex justify-between text-xs">
                                     <span className="text-gray-400">Records in batch</span>
                                     <span className="text-white font-mono">{traceEstimate.eligibleCount + traceEstimate.alreadyTracedCount}</span>
                                 </div>
                                 <div className="flex justify-between text-xs">
                                     <span className="text-gray-400">Already traced (skipped)</span>
                                     <span className="text-gray-500 font-mono">-{traceEstimate.alreadyTracedCount}</span>
                                 </div>
                                 <div className="flex justify-between text-xs">
                                     <span className="text-gray-400">Records to trace</span>
                                     <span className="text-white font-mono">{traceEstimate.eligibleCount}</span>
                                 </div>
                                 <div className="flex justify-between text-xs">
                                     <span className="text-gray-400">Cost per trace</span>
                                     <span className="text-white font-mono">${traceEstimate.rate.toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                                     <span className="text-white font-bold">Estimated Total</span>
                                     <span className="text-emerald-500 font-mono font-bold">${traceEstimate.totalCost.toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between text-xs pt-2">
                                     <span className="text-gray-500">Current Balance</span>
                                     <span className="text-white font-mono">${walletBalance.toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between text-xs">
                                     <span className="text-gray-500">Balance After</span>
                                     <span className="text-emerald-500 font-mono">${(walletBalance - traceEstimate.totalCost).toFixed(2)}</span>
                                 </div>
                                 {walletBalance < traceEstimate.totalCost && (
                                     <div className="mt-2 text-xs text-red-500 flex items-center gap-1.5 bg-red-500/10 p-2 rounded border border-red-500/20">
                                         <AlertTriangle size={12} />
                                         Insufficient Wallet Balance
                                     </div>
                                 )}
                             </div>
                         )}
                    </div>
                    
                    {/* Warning Section */}
                    <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl flex gap-3">
                         <AlertTriangle className="text-rose-500 shrink-0" size={20} />
                         <div className="text-xs text-rose-200/80 leading-relaxed">
                             <strong className="text-rose-400 block mb-1 uppercase tracking-tight">Execution Lock-In</strong>
                             Once downloaded, touch counts are permanently incremented and cadence timers begin. This action cannot be undone.
                         </div>
                    </div>

                     {/* Deduplication Info */}
                    <div className="p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg flex gap-2 items-start">
                        <Users size={16} className="text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-300/80 leading-relaxed">
                            <strong className="text-blue-400">Deduplication Protocol Active:</strong> {latestBatch?.duplicateContactsAvoided || 0} duplicate contacts consolidated. Owners with multiple properties will only receive marketing for their highest-priority asset.
                        </p>
                    </div>

                    {/* Confirmation */}
                    <div className="flex items-center gap-3 pt-2">
                        <div 
                            className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${isConfirmed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600 hover:border-gray-500'}`}
                            onClick={() => setIsConfirmed(!isConfirmed)}
                        >
                            {isConfirmed && <CheckCircle2 size={14} className="text-black" />}
                        </div>
                        <span className="text-xs text-gray-400 cursor-pointer select-none" onClick={() => setIsConfirmed(!isConfirmed)}>
                            I confirm I am ready to process this batch.
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="py-3 rounded-lg border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-colors uppercase tracking-wider"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={executeBatch}
                            disabled={!isConfirmed || isProcessing || (includeSkipTrace && traceEstimate && walletBalance < traceEstimate.totalCost)}
                            className={`py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors uppercase tracking-wider ${
                                !isConfirmed || isProcessing || (includeSkipTrace && traceEstimate && walletBalance < traceEstimate.totalCost)
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                            }`}
                        >
                            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
                            {isProcessing ? 'Processing...' : 'Execute & Download'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
