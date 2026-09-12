import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'purple' | 'emerald';
  children: React.ReactNode;
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const variantStyles = {
    default: 'glass-panel text-slate-100',
    gold: 'glass-panel-gold text-slate-100',
    purple: 'glass-panel-purple text-slate-100',
    emerald: 'glass-panel border-emerald-500/30 shadow-emerald-glow text-slate-100',
  };

  return (
    <div
      className={clsx('rounded-2xl p-6 transition-all duration-300', variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
