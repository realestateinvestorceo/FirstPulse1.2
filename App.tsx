
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Partners } from './pages/admin/Partners';
import { Clients } from './pages/admin/Clients';
import { Counties } from './pages/admin/Counties';
import { Signals } from './pages/admin/Signals';
import { SystemConfig } from './pages/admin/SystemConfig';
import { PartnerClients } from './pages/partner/Clients';
import { ClientDetail } from './pages/partner/ClientDetail';
import { PartnerPricing } from './pages/partner/Pricing';
import { PartnerRevenue } from './pages/partner/Revenue';
import { InvestorDashboard } from './pages/investor/Dashboard';
import { LeadMonitor } from './pages/investor/LeadMonitor';
import { StrategyEngine } from './pages/investor/StrategyEngine';
import { SuppressionManagement } from './pages/investor/Suppression';
import { AccountPage } from './pages/investor/Account';
import { ExecutionHistory } from './pages/investor/ExecutionHistory';
import { HowItWorks } from './pages/investor/HowItWorks';
import { User, AuthResponse } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';

// Placeholder for missing pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
    <div className="text-4xl font-bold text-gray-800 mb-4">COMING SOON</div>
    <div className="text-xl text-emerald-500">{title}</div>
  </div>
);

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent auth simulation
    const savedUser = localStorage.getItem('fp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (data: AuthResponse) => {
    setUser(data.user);
    localStorage.setItem('fp_user', JSON.stringify(data.user));
    localStorage.setItem('fp_token', data.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fp_user');
    localStorage.removeItem('fp_token');
  };

  if (loading) return null;

  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? (
                <Navigate to={
                  user.role === 'admin' ? '/admin/dashboard' : 
                  user.role === 'partner' ? '/partner/clients' : 
                  '/investor/dashboard'
                } />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            } 
          />

          <Route path="/" element={user ? <Layout user={user} onLogout={handleLogout}><div /></Layout> : <Navigate to="/login" />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            user?.role === 'admin' ? (
              <Layout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="partners" element={<Partners />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="counties" element={<Counties />} />
                  <Route path="signals" element={<Signals />} />
                  <Route path="config" element={<SystemConfig />} />
                  <Route path="users" element={<PlaceholderPage title="User Management" />} />
                </Routes>
              </Layout>
            ) : <Navigate to="/login" />
          } />

          {/* Partner Routes */}
          <Route path="/partner/*" element={
            user?.role === 'partner' ? (
              <Layout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="clients" element={<PartnerClients />} />
                  <Route path="clients/:id" element={<ClientDetail />} />
                  <Route path="pricing" element={<PartnerPricing />} />
                  <Route path="revenue" element={<PartnerRevenue />} />
                  <Route path="settings" element={<PlaceholderPage title="Partner Settings" />} />
                  <Route path="reports" element={<PlaceholderPage title="Performance Reports" />} />
                </Routes>
              </Layout>
            ) : <Navigate to="/login" />
          } />

          {/* Investor Routes */}
          <Route path="/investor/*" element={
            user?.role === 'investor' ? (
              <Layout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="dashboard" element={<InvestorDashboard />} />
                  <Route path="lead-monitor" element={<LeadMonitor />} />
                  <Route path="strategy-engine" element={<StrategyEngine />} />
                  <Route path="suppression" element={<SuppressionManagement />} />
                  <Route path="properties" element={<InvestorDashboard />} /> {/* Reuse dashboard for properties for demo */}
                  <Route path="account" element={<AccountPage />} />
                  <Route path="execution-history" element={<ExecutionHistory />} />
                  <Route path="how-it-works" element={<HowItWorks />} />
                  <Route path="wallet" element={<Navigate to="/investor/account" />} /> {/* Redirect old route if needed */}
                </Routes>
              </Layout>
            ) : <Navigate to="/login" />
          } />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;
