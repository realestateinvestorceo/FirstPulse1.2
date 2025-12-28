
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
  DollarSign, 
  ArrowRight,
  AlertTriangle,
  Loader2,
  FileDown,
  Users,
  Search,
  Map,
  TrendingUp
} from 'lucide-react';

const Counter = ({ label, value, brightness = 'text-white' }: { label: string; value: string; brightness?: string }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 font-medium tracking-wider mb-2">{label}</span>
    <span className={`text-4xl font-mono font-bold ${brightness}`}>{value}</span>
  </div>
);

const LaneCard = ({ label, value, color, dotColor }: { label: string; value: string; color?: string; dotColor: string }) => (
  <Card className="flex-1 bg-[#111111] border-white/5 hover:border-white/10 transition-colors">
    <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${dotColor}`} />
            <span className="text-xs text-gray-400 font-bold tracking-wider">{label}</span>
        </div>
        <div className="text-3xl font-mono text-white font-medium">{value}</div>
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
     <button onClick={onClose} className="text-gray-500 hover:text-white ml-2"><span className="sr-only">Close</span>×</button>
  </div>
);

// Mock Data for New Sections
const VELOCITY_DATA = [
    { zip: '60614', status: 'HOT', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
    { zip: '60657', status: 'HOT', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
    { zip: '60618', status: 'WARM', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    { zip: '77007', status: 'WARM', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    { zip: '77019', status: 'HOT', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
];

const SOLD_PULSE_DATA = [
    { address: '1234 Oak St', price: 425000, time: '2 days ago' },
    { address: '5678 Maple Ave', price: 315000, time: '4 days ago' },
    { address: '9012 Pine Ln', price: 550000, time: '1 week ago' },
    { address: '3456 Cedar Dr', price: 289000, time: '1 week ago' },
];

export const InvestorDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [batchExecuted, setBatchExecuted] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [latestBatch, setLatestBatch] = useState<WeeklyBatch | null>(null);
    const [stats, setStats] = useState<{ active: number, cooldown: number, removed: number } | null>(null);
    const [walletBalance, setWalletBalance] = useState(0);
    
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
            if (clientData) setWalletBalance(clientData.skipTraceWalletBalance);
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
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Weekly Output</h1>
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 tracking-wider">
                            ENGINE STATUS: SYNCED
                        </span>
                        <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                            Active Output • Week of Dec 22, 2025
                        </span>
                    </div>
                </div>
                <Card className="bg-[#111111] border-white/10 min-w-[200px]">
                    <div className="px-5 py-4 flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-white/5 text-emerald-500">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Wallet Balance</div>
                            <div className="text-xl font-mono text-white font-bold">${walletBalance.toFixed(2)}</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Row 1: Primary Action & Hot Sheet */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left Card: Primary Strategy Action */}
                <Card className="lg:col-span-3 bg-[#111111] border-white/10 relative overflow-hidden group h-full">
                     {/* Subtle gradient bg */}
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
                                <Counter label="FRESH" value={latestBatch ? latestBatch.freshCount.toString() : "--"} brightness="text-white" />
                                <Counter label="REPEAT" value={latestBatch ? latestBatch.repeatCount.toString() : "--"} brightness="text-gray-400" />
                                <Counter label="QUEUE" value={latestBatch ? latestBatch.queueCount.toString() : "--"} brightness="text-gray-600" />
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
                                    <span className="tracking-wide">BATCH COMPLETED</span>
                                </>
                            ) : (
                                <>
                                    <span className="tracking-wide">DOWNLOAD WEEKLY BATCH</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </Card>

                {/* Right Card: Hot Sheet */}
                <Link to="/investor/lead-monitor?filter=blitz&status=active" className="lg:col-span-2 block h-full group cursor-pointer">
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
                                    {latestBatch ? latestBatch.blitzCount + latestBatch.freshCount : '--'}
                                </div>
                                <div className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 tracking-widest uppercase">
                                    Hot Subset
                                </div>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>

            {/* Row 2: Lane Breakdown */}
            <div>
                 <div className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4 ml-1">Lane Breakdown</div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <LaneCard label="BLITZ" value={latestBatch ? latestBatch.blitzCount.toString() : '--'} dotColor="bg-amber-500" />
                    <LaneCard label="CHASE" value={latestBatch ? latestBatch.chaseCount.toString() : '--'} dotColor="bg-indigo-500" />
                    <LaneCard label="NURTURE" value={latestBatch ? latestBatch.nurtureCount.toString() : '--'} dotColor="bg-gray-500" />
                    
                    <Card className="bg-[#111111] border-emerald-500/20 flex items-center justify-center p-4">
                        <div className="text-center py-2">
                            <div className="flex justify-center mb-3 text-emerald-500">
                                <CheckCircle2 size={28} />
                            </div>
                            <div className="text-sm font-bold text-emerald-500 tracking-wider mb-1">LOGIC FINALIZED</div>
                            <div className="text-[10px] text-gray-500 font-mono leading-tight">MARKET-WIDE VALIDATION<br/>SEQUENCE COMPLETE</div>
                        </div>
                    </Card>
                 </div>
            </div>

            {/* Row 3: Regional Velocity & Sold Pulse */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Regional Velocity */}
                <div className="lg:col-span-2">
                     <div className="flex items-center gap-2 mb-4 ml-1">
                          <Map size={16} className="text-gray-500" />
                          <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase">Regional Velocity</h3>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          {VELOCITY_DATA.map(item => (
                              <Card key={item.zip} className={`bg-[#111111] border ${item.border} p-3 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors`}>
                                  <div className="text-lg font-mono font