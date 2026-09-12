'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, CheckCircle2, Lock, Sparkles, Coins } from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { Achievement } from '../../../types';
import { Card } from '../../../components/ui/Card';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    const res = await apiRequest<Achievement[]>('/achievements');
    if (res.success && res.data) {
      setAchievements(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel-gold border border-amber-500/40">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-rpg font-bold text-xs">
            <Trophy className="w-4 h-4" />
            <span>HEROIC FEATS & TRIUMPHS</span>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 font-rpg">
            HALL OF ACHIEVEMENTS
          </h1>
          <p className="text-xs text-slate-300">
            Achievements unlock automatically as you complete quests, build streaks, and level up!
          </p>
        </div>

        <div className="px-5 py-3 rounded-xl bg-slate-950/90 border border-amber-400/40 text-center shrink-0">
          <div className="text-xs text-slate-400 font-semibold">Unlocked Feats</div>
          <div className="text-xl font-black text-amber-400 font-rpg">
            {unlockedCount} / {achievements.length}
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-900/60 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = ach.isUnlocked;

            return (
              <Card
                key={ach.id}
                className={`flex flex-col justify-between space-y-4 transition duration-300 ${
                  isUnlocked
                    ? 'border-amber-400/50 shadow-gold-glow bg-slate-900/90'
                    : 'opacity-60 border-white/5 bg-slate-950/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 border border-white/10 text-amber-400 font-rpg uppercase">
                      {ach.reqType.replace('_', ' ')}
                    </span>

                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 uppercase font-rpg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>UNLOCKED</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase font-rpg">
                        <Lock className="w-3.5 h-3.5" />
                        <span>LOCKED</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl p-1 shrink-0 flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-amber-500/20 border border-amber-400 text-amber-300 shadow-gold-glow'
                          : 'bg-slate-900 border border-slate-700 text-slate-600'
                      }`}
                    >
                      <Trophy className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-100 font-rpg leading-tight">
                        {ach.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{ach.description}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold font-rpg">
                  <span className="text-purple-400">+{ach.rewardXp} XP</span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>+{ach.rewardGold} G</span>
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
