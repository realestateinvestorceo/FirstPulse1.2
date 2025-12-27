import React, { useState } from 'react';
import { api } from '../services/mockBackend';
import { AuthResponse } from '../types';
import { Zap, Lock, Mail, Loader2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (data: AuthResponse) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent, quickEmail?: string, quickPass?: string) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.login(quickEmail || email);
      onLoginSuccess(response);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (role: string) => {
    if (role === 'admin') handleLogin(undefined, 'admin@firstpulse.ai', 'admin123');
    if (role === 'partner') handleLogin(undefined, 'partner@firstpulse.ai', 'partner123');
    if (role === 'investor') handleLogin(undefined, 'investor@firstpulse.ai', 'investor123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Zap size={32} className="text-black" fill="currentColor" />
          </div>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-center text-sm mb-8">Enter your credentials to access the terminal</p>

            <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex justify-center items-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="bg-white/5 p-6 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center mb-4 uppercase tracking-wider">Quick Login (Demo)</p>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => quickLogin('admin')} className="py-2 px-2 bg-[#0A0A0A] hover:bg-white/10 border border-white/10 rounded text-xs text-gray-300 transition-colors">
                Admin
              </button>
              <button onClick={() => quickLogin('partner')} className="py-2 px-2 bg-[#0A0A0A] hover:bg-white/10 border border-white/10 rounded text-xs text-gray-300 transition-colors">
                Partner
              </button>
              <button onClick={() => quickLogin('investor')} className="py-2 px-2 bg-[#0A0A0A] hover:bg-white/10 border border-white/10 rounded text-xs text-gray-300 transition-colors">
                Investor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};