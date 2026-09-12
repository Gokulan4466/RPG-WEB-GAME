import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  variant?: 'xp' | 'gold' | 'health' | 'strength';
  showText?: boolean;
  className?: string;
}

export function ProgressBar({
  current,
  max,
  label,
  variant = 'xp',
  showText = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((current / (max || 1)) * 100)));

  const barVariants = {
    xp: 'xp-progress-bar',
    gold: 'gold-progress-bar',
    health: 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]',
    strength: 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]',
  };

  return (
    <div className={clsx('space-y-1.5', className)}>
      {(label || showText) && (
        <div className="flex justify-between items-center text-xs font-semibold">
          {label && <span className="text-slate-300 font-rpg tracking-wider">{label}</span>}
          {showText && (
            <span className="text-slate-400">
              {current} / {max} XP ({percentage}%)
            </span>
          )}
        </div>
      )}
      <div className="w-full h-3.5 bg-slate-950/80 rounded-full p-0.5 border border-white/10 overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', barVariants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
