import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { api } from '../../services/mockBackend';
import { Users, Building, Activity, Database } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <Card className="hover:border-emerald-500/30 transition-colors">
    <CardContent className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white font-mono">{value}</p>
        {trend && <p className="text-xs text-emerald-500 mt-2">{trend}</p>}
      </div>
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-emerald-500">
        <Icon size={24} />
      </div>
    </CardContent>
  </Card>
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getStats().then(setStats);
  }, []);

  if (!stats) return <div className="text-emerald-500 animate-pulse">Loading system stats...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <div className="text-sm text-gray-500 font-mono">System Status: <span className="text-emerald-500">OPERATIONAL</span></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Properties" value={stats.propertyCount} icon={Database} trend="+12% from last week" />
        <StatCard title="Active Clients" value={stats.clientCount} icon={Activity} trend="Stable" />
        <StatCard title="Partners" value={stats.partnerCount} icon={Building} />
        <StatCard title="System Users" value={stats.userCount} icon={Users} trend="All Active" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader title="Recent System Activity" />
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 text-sm border-b border-white/5 pb-4 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="flex-1">
                    <p className="text-gray-200">Database synchronization completed</p>
                    <p className="text-gray-500 text-xs">2 hours ago • Automated Job</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full bg-gradient-to-br from-emerald-900/10 to-transparent">
          <CardHeader title="Server Health" />
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">CPU Usage</span>
                <span className="text-emerald-500 font-mono">12%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>

              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Memory</span>
                <span className="text-emerald-500 font-mono">45%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>

              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Storage (SQLite)</span>
                <span className="text-emerald-500 font-mono">2%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '2%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};