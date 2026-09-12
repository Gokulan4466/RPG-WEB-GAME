'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Menu,
  X,
  Coins,
  Flame,
  LayoutDashboard,
  Swords,
  User,
  ShoppingBag,
  Package,
  Trophy,
  BarChart3,
  LogOut,
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

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, character, logout } = useAuth();

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-white/10"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo (Mobile & Desktop) */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 md:hidden" />
            <span className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-rpg">
              LifeRPG
            </span>
          </Link>
        </div>

        {/* Top Right Quick Stats */}
        {character && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs font-bold text-amber-400">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{character.gold}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-rose-500/30 text-xs font-bold text-rose-400">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>{character.currentStreak}d</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-amber-400 p-0.5">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-amber-300">
                  {user?.name.charAt(0).toUpperCase() || 'H'}
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-200">{user?.name}</span>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span className="text-xl font-bold text-amber-400 font-rpg">LifeRPG</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-900 text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout Adventurer</span>
          </button>
        </div>
      )}
    </>
  );
}
