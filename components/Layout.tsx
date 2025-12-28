
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  Wallet, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Zap,
  Activity,
  GitBranch,
  ShieldAlert,
  Clock,
  Radio,
  Map,
  DollarSign
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

interface NavItemProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      active 
        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
        : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (!user) return <>{children}</>;

  const isActive = (path: string) => {
    // Exact match for dashboard roots
    if (path.endsWith('/dashboard') || path.endsWith('/clients')) {
       if (location.pathname === path) return true;
       // Allow sub-routes for clients/partners to keep parent active
       if (path === '/partner/clients' && location.pathname.startsWith('/partner/clients/')) return true;
       return false;
    }
    return location.pathname.startsWith(path);
  };

  const getNavItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/admin/partners', icon: Building, label: 'Partners' },
          { to: '/admin/clients', icon: Users, label: 'Clients' },
          { to: '/admin/counties', icon: Map, label: 'Counties' },
          { to: '/admin/signals', icon: Radio, label: 'Signals' },
          { to: '/admin/config', icon: Settings, label: 'System Config' },
        ];
      case 'partner':
        return [
          { to: '/partner/clients', icon: Users, label: 'My Clients' },
          { to: '/partner/pricing', icon: DollarSign, label: 'Pricing' },
          { to: '/partner/settings', icon: Settings, label: 'Settings' },
        ];
      case 'investor':
        return [
          { to: '/investor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/investor/lead-monitor', icon: Activity, label: 'Lead Monitor' },
          { to: '/investor/strategy-engine', icon: GitBranch, label: 'Strategy Engine' },
          { to: '/investor/suppression', icon: ShieldAlert, label: 'Suppression' },
          { to: '/investor/execution-history', icon: Clock, label: 'Execution History' },
          { to: '/investor/account', icon: Wallet, label: 'Skip Trace Wallet' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-white/5 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/5 flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-black font-bold shadow-lg shadow-emerald-500/20">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">FirstPulse</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {getNavItems().map((item) => (
              <NavItem 
                key={item.to} 
                to={item.to} 
                icon={item.icon} 
                label={item.label} 
                active={isActive(item.to)}
              />
            ))}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-white/5 bg-[#0F0F0F]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-bold"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#050505]">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-white/5 flex items-center justify-between px-4 bg-[#0A0A0A]">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <Zap className="text-emerald-500" size={20} fill="currentColor" />
            FirstPulse
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
