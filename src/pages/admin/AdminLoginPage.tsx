import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, Key, ArrowRight, Radio } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-redirect if already logged in
  if (isAuthenticated) {
    onNavigate('/admin/dashboard');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      onNavigate('/admin/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@bitandvolt.org');
    setPassword('Admin@BITVOLT2026!');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 font-mono">
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] max-w-md w-full p-8 space-y-6 shadow-2xl relative">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#00FF41]/10 border border-[#00FF41]/40 flex items-center justify-center text-[#00FF41] mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">BIT // VOLT Admin CMS</h1>
          <p className="text-xs text-[#888] font-sans">
            Restricted access portal for authorized BIT & VOLT engineering administrators.
          </p>
        </div>

        {/* ERROR CALLOUT */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 flex items-center space-x-2 text-xs text-red-300 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#888] mb-1 font-semibold uppercase">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bitandvolt.org"
                className="w-full bg-[#0A0A0A] border border-[#222] pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#00FF41]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#888] mb-1 font-semibold uppercase">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0A0A0A] border border-[#222] pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#00FF41]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#00FF41] text-black font-bold hover:bg-[#00e038] transition-colors flex items-center justify-center space-x-2 uppercase tracking-wider"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>AUTHENTICATE SESSION</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* QUICK DEMO CREDENTIALS SHORTCUT */}
        <div className="pt-4 border-t border-[#1A1A1A] space-y-2 text-[11px] text-[#888]">
          <div className="flex items-center justify-between">
            <span className="uppercase font-bold">Demo Initial Credentials:</span>
            <button
              onClick={handleQuickFill}
              className="text-[#00FF41] hover:underline font-bold flex items-center space-x-1 uppercase"
            >
              <Key className="w-3 h-3" />
              <span>Auto-Fill</span>
            </button>
          </div>
          <div className="bg-[#0A0A0A] p-2 border border-[#222] text-[10px]">
            <div>User: <code className="text-[#00FF41]">admin@bitandvolt.org</code></div>
            <div>Pass: <code className="text-[#FFB800]">Admin@BITVOLT2026!</code></div>
          </div>
        </div>
      </div>
    </div>
  );
};
