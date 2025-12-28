import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { 
  Wallet, 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  RefreshCw, 
  ArrowUpRight,
  ShieldCheck,
  History,
  DollarSign
} from 'lucide-react';
import { api } from '../../services/mockBackend';
import { Client, Transaction } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Toast } from '../../components/ui/Toast';

export const AccountPage = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interaction State
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<string>('100');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [clientData, txData] = await Promise.all([
        api.getClientById(201),
        api.getTransactions(201)
      ]);
      if (clientData) setClient(clientData);
      setTransactions(txData.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (!client || isNaN(amount) || amount <= 0) return;

    // Update Client State locally
    setClient({
        ...client,
        skipTraceWalletBalance: client.skipTraceWalletBalance + amount
    });

    // Add Transaction
    const newTx: Transaction = {
        id: Date.now(),
        clientId: client.id,
        protocolEvent: 'MANUAL WALLET FUNDING',
        settlementAmount: amount,
        timestamp: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
    
    // Feedback
    setToastMessage(`Successfully added $${amount.toFixed(2)} to wallet.`);
    setIsTopUpOpen(false);
  };

  const toggleAutoRecharge = () => {
      if (!client) return;
      const newState = !client.skipTraceAutoRecharge;
      setClient({
          ...client,
          skipTraceAutoRecharge: newState
      });
      setToastMessage(newState ? 'Auto-recharge protocol activated.' : 'Auto-recharge protocol disabled.');
  };

  if (loading || !client) return <div className="text-emerald-500 animate-pulse font-mono p-12 text-center">Loading Account Data...</div>;

  return (
    <div className="space-y-8 pb-12">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Wallet</h1>
          <p className="text-gray-500 mt-1 text-sm font-mono uppercase tracking-wide">Manage settlement methods and audit transaction logs.</p>
        </div>
      </div>

      {/* Main Wallet Card */}
      <Card className="bg-[#111111] border-emerald-500/20 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-500 mb-2">
                <Wallet size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">WALLET BALANCE</span>
              </div>
              <div className="text-5xl font-mono font-bold text-white tracking-tight mb-2">
                ${client.skipTraceWalletBalance.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Supports optional skip trace enrichment services.</p>
            </div>
            
            <button 
                onClick={() => setIsTopUpOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-3 px-6 rounded-lg uppercase tracking-wider text-sm flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
            >
              <ArrowUpRight size={18} />
              Top Up Balance
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500">
                 <RefreshCw size={18} />
               </div>
               <div>
                 <div className="text-xs font-bold text-white uppercase tracking-wider">Auto-Recharge Protocol</div>
                 <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">
                   Replenish balance when below ${client.skipTraceRechargeThreshold.toFixed(2)}
                 </div>
               </div>
            </div>
            {/* Toggle */}
            <div 
                onClick={toggleAutoRecharge}
                className={`w-12 h-6 rounded-full p-1 flex items-center cursor-pointer transition-colors ${client.skipTraceAutoRecharge ? 'bg-emerald-500' : 'bg-gray-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${client.skipTraceAutoRecharge ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
      </Card>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method */}
        <Card className="bg-[#111111] border-white/5 p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Primary Settlement Method</div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-white">
                 <CreditCard size={20} />
              </div>
              <div>
                <div className="text-white font-mono text-lg tracking-widest">VISA •••• 4242</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Valid Thru: 12/2028 • John Doe</div>
              </div>
            </div>
          </div>
          <button className="text-xs font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-wider text-left mt-4">
            Update Method
          </button>
        </Card>

        {/* Service Plan */}
        <Card className="bg-[#111111] border-white/5 p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Service Plan</div>
            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={12} />
              Subscription Healthy
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-emerald-500/10 rounded text-emerald-500">
                <Zap size={16} />
              </div>
              <span className="text-sm font-bold text-white uppercase tracking-wide">Protocol Active</span>
            </div>
            
            <div className="pl-9 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Access Level</span>
                <span className="text-white font-mono uppercase">Full Engine Access</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Retail Price</span>
                <span className="text-white font-mono">$2,500.00 / MO</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Volume Ceiling</span>
                <span className="text-white font-mono">10,000 Records</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction Log */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-4 flex items-center gap-2">
          <History size={14} />
          Transaction Audit Log
        </h3>
        <Card className="bg-[#111111] border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Protocol Event</th>
                <th className="px-6 py-4 font-mono">Settlement</th>
                <th className="px-6 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => {
                 const isPositive = tx.settlementAmount > 0;
                 return (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white uppercase tracking-wide">{tx.protocolEvent}</div>
                    </td>
                    <td className={`px-6 py-4 font-mono text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-white'}`}>
                      {isPositive ? '+' : ''}${Math.abs(tx.settlementAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className="text-xs text-gray-500 font-mono uppercase">
                         {new Date(tx.timestamp).toLocaleString('en-US', { 
                           month: 'short', day: 'numeric', year: 'numeric', 
                           hour: 'numeric', minute: 'numeric', hour12: true 
                         })}
                       </span>
                    </td>
                  </tr>
                 );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      <Modal 
          isOpen={isTopUpOpen} 
          onClose={() => setIsTopUpOpen(false)} 
          title="Add Funds to Wallet"
          icon={<DollarSign className="text-emerald-500" />}
      >
          <div className="space-y-6">
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Amount (USD)</label>
                  <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-lg">$</span>
                      <input 
                        type="number" 
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl pl-8 pr-4 py-4 text-xl font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        autoFocus
                      />
                  </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg flex gap-3 items-center">
                  <CreditCard className="text-gray-400" size={20} />
                  <div>
                      <div className="text-white text-sm font-bold">Using Primary Method</div>
                      <div className="text-xs text-gray-500 font-mono">VISA •••• 4242</div>
                  </div>
              </div>
              <button 
                  onClick={handleTopUp}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg uppercase tracking-wider text-sm transition-colors"
              >
                  Confirm Transaction
              </button>
          </div>
      </Modal>
    </div>
  );
};
