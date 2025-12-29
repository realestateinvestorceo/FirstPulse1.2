
import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Toast } from '../../components/ui/Toast';
import { api } from '../../services/mockBackend';
import { Partner } from '../../types';
import { Plus, Mail, Phone, MoreHorizontal, Users, Edit, Power, Key, Eye, EyeOff } from 'lucide-react';

export const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', email: '', phone: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Actions Menu State
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  
  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  // Set Password State
  const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false);
  const [passwordToSet, setPasswordToSet] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    api.getPartners().then(setPartners);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
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

  const toggleMenu = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEditClick = (partner: Partner) => {
      setEditingPartner({ ...partner });
      setIsEditOpen(true);
      setOpenMenuId(null);
  };

  const handleSaveEdit = () => {
      if (!editingPartner || !editingPartner.name || !editingPartner.email) return;
      
      setPartners(prev => prev.map(p => p.id === editingPartner.id ? editingPartner : p));
      setIsEditOpen(false);
      setEditingPartner(null);
      setToastMessage("Partner updated successfully");
  };

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
      setPartners(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
      setOpenMenuId(null);
      setToastMessage(currentStatus ? "Partner deactivated" : "Partner activated");
  };

  const handleSetPasswordClick = (partner: Partner) => {
      setEditingPartner(partner);
      setPasswordToSet('');
      setShowPassword(false);
      setIsSetPasswordOpen(true);
      setOpenMenuId(null);
  };

  const handleSavePassword = () => {
      if (!passwordToSet) return;
      // In a real app, we would call an API here
      setToastMessage(`Password updated for ${editingPartner?.name}`);
      setIsSetPasswordOpen(false);
      setEditingPartner(null);
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
        <div className="overflow-x-auto min-h-[300px]">
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
                  <td className="px-6 py-4 text-right relative">
                    <button 
                        onClick={(e) => toggleMenu(e, partner.id)}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${openMenuId === partner.id ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white'}`}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    
                    {/* Actions Dropdown */}
                    {openMenuId === partner.id && (
                        <div className="absolute right-8 top-8 w-48 bg-[#111111] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <div className="py-1">
                                <button 
                                    onClick={() => handleEditClick(partner)}
                                    className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
                                >
                                    <Edit size={14} />
                                    Edit Details
                                </button>
                                <button 
                                    onClick={() => handleToggleStatus(partner.id, partner.isActive)}
                                    className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
                                >
                                    <Power size={14} className={partner.isActive ? "text-red-400" : "text-emerald-400"} />
                                    {partner.isActive ? "Deactivate" : "Activate"}
                                </button>
                                <button 
                                    onClick={() => handleSetPasswordClick(partner)}
                                    className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
                                >
                                    <Key size={14} />
                                    Set Password
                                </button>
                            </div>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Partner Modal */}
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

      {/* Edit Partner Modal */}
      <Modal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        title="Edit Partner Details"
        icon={<Edit className="text-emerald-500" />}
      >
        {editingPartner && (
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Partner Name</label>
                    <input 
                    value={editingPartner.name} 
                    onChange={e => setEditingPartner({...editingPartner, name: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email / Login</label>
                    <input 
                    value={editingPartner.email} 
                    onChange={e => setEditingPartner({...editingPartner, email: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone</label>
                    <input 
                    value={editingPartner.phone} 
                    onChange={e => setEditingPartner({...editingPartner, phone: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    />
                </div>
                <button 
                    onClick={handleSaveEdit}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg transition-colors mt-2"
                >
                    Save Changes
                </button>
            </div>
        )}
      </Modal>

      {/* Set Password Modal */}
      <Modal 
        isOpen={isSetPasswordOpen} 
        onClose={() => setIsSetPasswordOpen(false)} 
        title={`Set Password for ${editingPartner?.name}`}
        icon={<Key className="text-emerald-500" />}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••" 
                value={passwordToSet} 
                onChange={e => setPasswordToSet(e.target.value)} 
                className="w-full bg-black border border-white/10 rounded-lg pl-4 pr-10 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <button 
                onClick={() => setIsSetPasswordOpen(false)}
                className="flex-1 py-3 border border-white/10 text-gray-400 font-bold rounded-lg transition-colors hover:bg-white/5"
            >
                Cancel
            </button>
            <button 
                onClick={handleSavePassword}
                disabled={!passwordToSet}
                className={`flex-1 py-3 font-bold rounded-lg transition-colors ${!passwordToSet ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-black'}`}
            >
                Save Password
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
