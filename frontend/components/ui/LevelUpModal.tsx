'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldLevel: number;
  newLevel: number;
  xpEarned: number;
  goldEarned: number;
  attributeGained?: number;
  attributeType?: string;
}

export function LevelUpModal({
  isOpen,
  onClose,
  oldLevel,
  newLevel,
  xpEarned,
  goldEarned,
  attributeGained,
  attributeType,
}: LevelUpModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti explosion!
      const end = Date.now() + 3 * 1000;
      const colors = ['#fbbf24', '#a855f7', '#10b981', '#f43f5e'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-lg p-8 rounded-2xl glass-panel-gold text-center overflow-hidden border-2 border-amber-400/50 shadow-2xl"
          >
            {/* Background glowing particle aura */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              {/* Header Badge */}
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-gold-glow mx-auto"
              >
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-amber-400 animate-pulse" />
                </div>
              </motion.div>

              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs font-bold tracking-widest text-amber-400 uppercase font-rpg"
                >
                  ✨ VICTORY & PROGRESSION ✨
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 font-rpg mt-1"
                >
                  LEVEL UP!
                </motion.h2>
              </div>

              {/* Level Transition Pill */}
              <div className="flex items-center justify-center gap-4 py-3 px-6 rounded-xl bg-slate-900/80 border border-amber-500/30 max-w-xs mx-auto">
                <div className="text-gray-400 text-lg font-semibold">LVL {oldLevel}</div>
                <ArrowUpRight className="w-6 h-6 text-amber-400 font-bold" />
                <div className="text-amber-400 text-3xl font-black font-rpg glow-text">
                  LVL {newLevel}
                </div>
              </div>

              {/* Rewards Summary Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-purple-500/30">
                  <div className="text-xs text-purple-300 font-medium">XP Earned</div>
                  <div className="text-xl font-bold text-purple-400 font-rpg">+{xpEarned}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-amber-500/30">
                  <div className="text-xs text-amber-300 font-medium">Gold Bonus</div>
                  <div className="text-xl font-bold text-amber-400 font-rpg">+{goldEarned}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-emerald-500/30">
                  <div className="text-xs text-emerald-300 font-medium">
                    {attributeType || 'Attribute'}
                  </div>
                  <div className="text-xl font-bold text-emerald-400 font-rpg">
                    +{attributeGained || 1}
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 italic">
                "Your real-life dedication powers your hero's journey!"
              </p>

              {/* Claim Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-base shadow-gold-glow hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Claim Rewards & Continue
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
