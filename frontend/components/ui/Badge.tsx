import React from 'react';
import { clsx } from 'clsx';
import { Category, Difficulty } from '../../types';

interface BadgeProps {
  type?: 'category' | 'difficulty' | 'custom';
  value: string;
  className?: string;
}

export function Badge({ type = 'custom', value, className }: BadgeProps) {
  let badgeStyles = 'px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider font-rpg';

  if (type === 'difficulty') {
    switch (value) {
      case 'EASY':
        badgeStyles += ' bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        break;
      case 'MEDIUM':
        badgeStyles += ' bg-blue-500/10 text-blue-400 border-blue-500/30';
        break;
      case 'HARD':
        badgeStyles += ' bg-purple-500/10 text-purple-400 border-purple-500/30';
        break;
      case 'EPIC':
        badgeStyles += ' bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-gold-glow animate-pulse';
        break;
    }
  } else if (type === 'category') {
    switch (value) {
      case 'STRENGTH':
        badgeStyles += ' bg-rose-500/10 text-rose-400 border-rose-500/30';
        break;
      case 'INTELLIGENCE':
        badgeStyles += ' bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
        break;
      case 'HEALTH':
        badgeStyles += ' bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        break;
      case 'DISCIPLINE':
        badgeStyles += ' bg-amber-500/10 text-amber-400 border-amber-500/30';
        break;
      case 'CREATIVITY':
        badgeStyles += ' bg-purple-500/10 text-purple-400 border-purple-500/30';
        break;
      case 'CHARISMA':
        badgeStyles += ' bg-pink-500/10 text-pink-400 border-pink-500/30';
        break;
    }
  } else {
    badgeStyles += ' bg-slate-800 text-slate-300 border-slate-700';
  }

  return <span className={clsx(badgeStyles, className)}>{value}</span>;
}
