import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@gangamaxx.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid authentication credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-teal-500 to-amber-500 mx-auto flex items-center justify-center font-black text-3xl shadow-2xl shadow-blue-500/30 mb-4">
            GM
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Ganga Maxx B2B Portal</h1>
          <p className="text-sm text-slate-400 mt-1">Repeat Order Reminder & Consumption Engine</p>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="name@gangamaxx.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-teal-600 to-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Demo Login Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@gangamaxx.com')}
                className="p-2 text-left rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <p className="text-xs font-bold text-blue-400">Admin</p>
                <p className="text-[10px] text-slate-400 truncate">admin@gangamaxx.com</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('rajesh@gangamaxx.com')}
                className="p-2 text-left rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <p className="text-xs font-bold text-teal-400">Salesman</p>
                <p className="text-[10px] text-slate-400 truncate">rajesh@gangamaxx.com</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('warehouse@gangamaxx.com')}
                className="p-2 text-left rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <p className="text-xs font-bold text-amber-400">Warehouse Staff</p>
                <p className="text-[10px] text-slate-400 truncate">warehouse@gangamaxx.com</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('accounts@gangamaxx.com')}
                className="p-2 text-left rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <p className="text-xs font-bold text-purple-400">Accounts Manager</p>
                <p className="text-[10px] text-slate-400 truncate">accounts@gangamaxx.com</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
