'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, KeyRound, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please fill in all required credentials.');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (!res.success) {
      setError(res.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-slate-950 to-slate-950">
      <Card variant="gold" className="w-full max-w-md p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-gold-glow mb-2">
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-rpg tracking-wider">
            LifeRPG
          </h1>
          <p className="text-xs text-slate-400 font-medium italic">"Turn Your Real Life Into An Adventure."</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-rpg">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adventurer@liferpg.io"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 placeholder-slate-600 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-rpg">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 placeholder-slate-600 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full mt-2 font-rpg tracking-wider flex items-center justify-center gap-2"
            disabled={submitting}
          >
            {submitting ? (
              <span>ENTERING REALM...</span>
            ) : (
              <>
                <span>ENTER REALM</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          New to LifeRPG?{' '}
          <Link href="/register" className="text-amber-400 hover:underline font-bold">
            Create Hero Character
          </Link>
        </div>
      </Card>
    </div>
  );
}
