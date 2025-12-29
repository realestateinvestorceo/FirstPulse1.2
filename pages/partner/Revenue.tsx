
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { 
  TrendingUp, 
  Wallet, 
  Clock, 
  Users, 
  ChevronDown, 
  DollarSign, 
  ArrowUpRight,
  FileText
} from 'lucide-react';

const REVENUE_DATA = [
  { client: 'Sarah Investor', tier: 'EXPANSION', baseSub: 1497, addCounties: 150, addDetails: '1 extra', totalBilled: 1647, margin: 350 },
  { client: 'Mike Flipper', tier: 'FRESH_ONLY', baseSub: 297, addCounties: 0, addDetails: '0', totalBilled: 297, margin: 100 },
  { client: 'James White', tier: 'FRESH_ONLY', baseSub: 497, addCounties: 0, addDetails: '0', totalBilled: 497, margin: 200 },
];

const PAYOUT_HISTORY = [
  { date: '12/15/2024', period: 'November 2024', clients: 3, gross: 2441, payout: 650, status: 'PAID' },
  { date: '11/15/2024', period: 'October 2024', clients: 2, gross: 1794, payout: 450, status: 'PAID' },
];

const StatCard = ({ label, value, icon: Icon, color = 'text-white' }: { label: string; value: string; icon: any; color?: string }) => (
  <Card className="hover:border-emerald-500/30 transition-colors">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500">
        <Icon size={24} />
      </div>
    </CardContent>
  </Card>
);

export const PartnerRevenue = () => {
  const [selectedMonth, setSelectedMonth] = useState('December 2024');

  const totalBilled = REVENUE_DATA.reduce((acc, curr) => acc + curr.totalBilled, 0);
  const totalMargin = REVENUE_DATA.reduce((acc, curr) => acc + curr.margin, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Revenue</h1>
          <p className="text-gray-500 mt-1 uppercase text-[10px] font-bold tracking-widest">Your earnings and client billing summary</p>
        </div>
        
        <div className="relative group">
          <button className="bg-[#111111] border border-white/10 rounded-lg px-4 py-2 text-sm text-white flex items-center gap-2 hover:border-emerald-500/50 transition-colors">
            {selectedMonth}
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          {/* Mock Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-[#111111] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
             {['December 2024', 'November 2024', 'October 2024'].map(m => (
               <button 
                 key={m} 
                 onClick={() => setSelectedMonth(m)}
                 className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
               >
                 {m}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Current Month Earnings" value={`$${totalMargin.toLocaleString()}`} icon={TrendingUp} color="text-emerald-500" />
        <StatCard label="Pending Payout" value="$0.00" icon={Clock} color="text-amber-500" />
        <StatCard label="Last Payout" value="$450.00" icon={Wallet} />
        <StatCard label="Active Clients" value={REVENUE_DATA.length.toString()} icon={Users} />
      </div>

      {/* Main Revenue Table */}
      <div>
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 pl-1">This Month's Revenue</h3>
        <Card className="bg-[#111111] border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4 text-right">Base Subscription</th>
                  <th className="px-6 py-4 text-right">Additional Counties</th>
                  <th className="px-6 py-4 text-right">Total Billed</th>
                  <th className="px-6 py-4 text-right text-emerald-500">Your Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {REVENUE_DATA.map((item, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{item.client}</td>
                    <td className="px-6 py-4">
                       <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">
                          {item.tier}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono">${item.baseSub.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-mono">
                      ${item.addCounties.toLocaleString()}
                      <span className="text-[9px] block text-gray-500">({item.addDetails})</span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-white">${item.totalBilled.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-500">${item.margin.toLocaleString()}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-emerald-500/5 font-bold">
                  <td colSpan={2} className="px-6 py-4 text-white">TOTAL</td>
                  <td colSpan={2} className="px-6 py-4 text-right font-mono">—</td>
                  <td className="px-6 py-4 text-right font-mono text-white">${totalBilled.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono text-emerald-500">${totalMargin.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Payout History */}
      <div>
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 pl-1">Payout History</h3>
        <Card className="bg-[#111111] border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Clients</th>
                  <th className="px-6 py-4 text-right">Gross Revenue</th>
                  <th className="px-6 py-4 text-right">Your Payout</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {PAYOUT_HISTORY.map((p, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-mono">{p.date}</td>
                    <td className="px-6 py-4 text-white font-medium">{p.period}</td>
                    <td className="px-6 py-4 font-mono">{p.clients}</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-400">${p.gross.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-white">${p.payout.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                       <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                         p.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                         p.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                         'bg-blue-500/10 text-blue-500 border-blue-500/20'
                       }`}>
                         {p.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Notice Section */}
      <Card className="bg-[#111111] border-white/5 p-6 border-dashed">
         <div className="flex items-start gap-4">
             <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                <FileText size={20} />
             </div>
             <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Billing & Payout Policy</h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
                   FirstPulse processes client billing on the 1st of each month. Partner payouts for the previous month's activity are settled by the 15th via Stripe Connect. Margin is calculated as Retail Client Price minus FirstPulse Wholesale Floor for the selected subscription tier and territory extensions.
                </p>
             </div>
         </div>
      </Card>
    </div>
  );
};
