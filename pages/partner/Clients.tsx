import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { api } from '../../services/mockBackend';
import { Client, ClientStatus } from '../../types';
import { Search, Plus } from 'lucide-react';
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

export const PartnerClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Hardcoded Partner ID 101 for the demo partner context
    api.getClients(101).then(setClients);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">My Clients</h1>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Add Client
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
                    {client.weeklyCapacity} / wk
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
    </div>
  );
};