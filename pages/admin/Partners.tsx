
import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Toast } from '../../components/ui/Toast';
import { api } from '../../services/mockBackend';
import { Partner } from '../../types';
import { Plus, Mail, Phone, MoreHorizontal, Users } from 'lucide-react';

export const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', email: '', phone: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    api.getPartners().then(setPartners);
  }, []);

  const handleCreatePartner = () => {
    if (!newPartner.name || !newPartner.email) return;

    const partner: Partner = {
      id: Date.now(),
      name: newPartner.name,
      email: newPartner.email,
      phone: newPartner.phone,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPartners([...partners, partner]);
    setIsAddOpen(false);
    setNewPartner({ name: '', email: '', phone: '' });
    setToastMessage("Partner added successfully");
  };

  return (
    <div className="space-y-6">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Partners</h1>
          <p className="text-gray-500 text-sm mt-1">Manage agency partners and reseller accounts.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
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

      <Modal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        title="Add New Partner"
        icon={<Users className="text-emerald-500" />}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Partner Name</label>
            <input 
              placeholder="e.g. Growth Marketing LLC" 
              value={newPartner.name} 
              onChange={e => setNewPartner({...newPartner, name: e.target.value})} 
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email Address</label>
            <input 
              placeholder="partner@example.com" 
              value={newPartner.email} 
              onChange={e => setNewPartner({...newPartner, email: e.target.value})} 
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone Number</label>
            <input 
              placeholder="(555) 000-0000" 
              value={newPartner.phone} 
              onChange={e => setNewPartner({...newPartner, phone: e.target.value})} 
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
            />
          </div>
          <button 
            onClick={handleCreatePartner}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg transition-colors mt-2"
          >
            Create Partner
          </button>
        </div>
      </Modal>
    </div>
  );
};
