import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { api } from '../../services/mockBackend';
import { Partner } from '../../types';
import { Plus, Mail, Phone, MoreHorizontal } from 'lucide-react';

export const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    api.getPartners().then(setPartners);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Partners</h1>
          <p className="text-gray-500 text-sm mt-1">Manage agency partners and reseller accounts.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Add Partner
        </button>
      </div>

      <Card>
        <CardHeader title="All Partners" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-200 uppercase text-xs font-medium">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Partner Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-500">#{partner.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{partner.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Mail size={12} /> {partner.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} /> {partner.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      partner.isActive 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {partner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white p-2">
                      <MoreHorizontal size={18} />
                    </button>
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