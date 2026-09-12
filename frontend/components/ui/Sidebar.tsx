'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Swords,
  User,
  ShoppingBag,
  Package,
  Trophy,
  BarChart3,
  LogOut,
  Flame,
  Coins,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Quests Board', href: '/quests', icon: Swords },
  { name: 'Character', href: '/character', icon: User },
  { name: 'Shop', href: '/shop', icon: ShoppingBag },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Statistics', href: '/stats', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { character, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-r-white/10 min-h-screen p-4 sticky top-0 h-screen z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-amber-400 p-0.5 shadow-gold-glow flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-rpg">
            LifeRPG
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Real Life Quest</p>
        </div>
      </div>

      {/* Hero Mini Banner */}
      {character && (
        <div className="mb-6 p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 truncate max-w-[110px]">{character.name}</span>
            <span className="text-amber-400 font-rpg">LVL {character.level}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1 text-amber-400">
              <Coins className="w-3.5 h-3.5" />
              <span>{character.gold} G</span>
            </div>
            <div className="flex items-center gap-1 text-rose-400">
              <Flame className="w-3.5 h-3.5" />
              <span>{character.currentStreak} Days</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 via-purple-500/10 to-transparent text-amber-400 border border-amber-500/40 shadow-gold-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Adventurer</span>
        </button>
      </div>
    </aside>
  );
}
