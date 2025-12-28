import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { api } from '../../services/mockBackend';
import { Client, Partner, ClientStatus } from '../../types';
import { Search, Filter, MoreHorizontal, Play, CheckCircle2, Loader2, Calendar, Clock } from 'lucide-react';

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

export const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [generatingId, setGeneratingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    Promise.all([
      api.getAllClients(),
      api.getPartners()
    ]).then(([clientsData, partnersData]) => {
      setClients(clientsData);
      setPartners(partnersData);
    });
  };

  const handleGenerateBatch = async (clientId: number) => {
    setGeneratingId(clientId);
    try {
      await api.generateWeeklyBatch(clientId);
      // Reload to show updated timestamps
      loadData();
    } catch (error) {
      alert("Failed to generate batch. Ensure client has eligible records.");
    } finally {
      setGeneratingId(null);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesPartner = selectedPartner === 'all' || client.partnerId.toString() === selectedPartner;
    const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase()) || 
                          client.companyName.toLowerCase().includes(search.toLowerCase()) ||
                          client.email.toLowerCase().includes(search.toLowerCase());
    return matchesPartner && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor client subscriptions and execution status.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50 w-64"
              />
            </div>
            
            <div className="relative">
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
               <select 
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50 appearance-none min-w-[200px]"
               >
                  <option value="all">All Partners</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
               </select>
            </div>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-200 uppercase text-xs font-medium">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Partner</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tier / Capacity</th>
                <th className="px-6 py-4">Cycle</th>
                <th className="px-6 py-4 text-right">Batch Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map((client) => {
                const partner = partners.find(p => p.id === client.partnerId);
                const isGenerating = generatingId === client.id;
                
                return (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white flex items-center gap-2">
                        {client.name}
                        {client.firstBatchGeneratedAt && (
                          <span title="First Batch Generated" className="flex items-center">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs">{client.companyName}</div>
                      <div className="text-xs text-gray-500">{client.email}</div>
                    </td>
                    <td className="px-6 py-4">
                       {partner ? (
                         <span className="text-white">{partner.name}</span>
                       ) : <span className="text-gray-600">Unknown</span>}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={client.clientStatus} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-emerald-400 mb-1">
                        {client.subscriptionTier.replace('_', ' ')}
                      </div>
                      <div className="font-mono text-[10px] text-gray-500">
                         CAP: {client.weeklyCapacity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                             <Calendar size={12} className="text-gray-500" />
                             {client.cycleDay || 'Monday'}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                             <Clock size={12} className="text-gray-500" />
                             {client.cycleTime || '09:00'}
                          </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleGenerateBatch(client.id)}
                            disabled={isGenerating}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase transition-colors ${
                                isGenerating
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-black shadow-lg shadow-emerald-900/20'
                            }`}
                          >
                             {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                             Generate
                          </button>
                          <button className="text-gray-500 hover:text-white p-2">
                            <MoreHorizontal size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};