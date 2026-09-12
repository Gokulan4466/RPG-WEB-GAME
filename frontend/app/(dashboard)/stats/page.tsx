'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, Flame, Coins, Calendar as CalendarIcon, CheckCircle2, Shield, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { UserStats } from '../../../types';
import { Card } from '../../../components/ui/Card';

export default function StatsPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const res = await apiRequest<UserStats>('/stats');
    if (res.success && res.data) {
      setStats(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Generate GitHub-style 30-day activity heat map grid
  const generateHeatmapDays = () => {
    const days = [];
    const today = new Date();
    const activityMap = new Map(stats?.activityCalendar.map((item) => [item.date, item.questCount]) || []);

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      const count = activityMap.get(dateStr) || 0;

      days.push({
        dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        count,
      });
    }

    return days;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 rounded-2xl bg-slate-900/60 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-slate-900/60 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const heatmapDays = generateHeatmapDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 font-rpg">
          ANALYTICS & ACTIVITY CALENDAR
        </h1>
        <p className="text-xs text-slate-400">
          Track your real-life productivity growth, weekly quest trends, and habit streak history.
        </p>
      </div>

      {/* Top Stat Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="gold" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total XP Earned</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 font-rpg">{stats.totalXpEarned} XP</div>
          <p className="text-[11px] text-slate-400">Accumulated across all quests</p>
        </Card>

        <Card variant="gold" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-rpg">{stats.completionRate}%</div>
          <p className="text-[11px] text-slate-400">
            {stats.totalQuestsCompleted} completed of {stats.totalQuestsCreated} quests
          </p>
        </Card>

        <Card variant="gold" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-rpg">{stats.currentStreak} Days</div>
          <p className="text-[11px] text-slate-400">Record: {stats.longestStreak} Days</p>
        </Card>

        <Card variant="gold" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Gold Economy</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-rpg">{stats.gold.current} G</div>
          <p className="text-[11px] text-slate-400">
            +{stats.gold.totalEarned} earned / -{stats.gold.totalSpent} spent
          </p>
        </Card>
      </div>

      {/* GitHub-Style 30-Day Activity Heatmap */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100 font-rpg">30-DAY ACTIVITY HEATMAP</h2>
          </div>
          <span className="text-xs text-slate-400">Daily quest completion density</span>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-2">
          {heatmapDays.map((day) => {
            let bgClass = 'bg-slate-900 border-white/5';
            if (day.count === 1) bgClass = 'bg-emerald-950 border-emerald-700/50 text-emerald-400 shadow-sm';
            if (day.count === 2) bgClass = 'bg-emerald-800 border-emerald-500/60 text-emerald-300 shadow-emerald-glow';
            if (day.count >= 3) bgClass = 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-emerald-glow animate-pulse';

            return (
              <div
                key={day.dateStr}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition hover:scale-105 cursor-pointer ${bgClass}`}
                title={`${day.dateStr}: ${day.count} quests completed`}
              >
                <span className="text-[10px] opacity-70 font-semibold">{day.dayName}</span>
                <span className="text-xs font-bold font-rpg">{day.dayNum}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 text-xs text-slate-400 pt-2">
          <span>Less Active</span>
          <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-white/10" />
          <div className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-700" />
          <div className="w-3.5 h-3.5 rounded bg-emerald-800 border border-emerald-500" />
          <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
          <span>More Active</span>
        </div>
      </Card>

      {/* Category Quest Breakdown & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Quest Distribution */}
        <Card className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 font-rpg flex items-center gap-2 border-b border-white/10 pb-3">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>CATEGORY DISTRIBUTION</span>
          </h2>

          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown).map(([cat, count]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300 font-rpg">{cat}</span>
                  <span className="text-amber-400 font-rpg">{count} Quests</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
                    style={{
                      width: `${Math.min(100, (count / (stats.totalQuestsCompleted || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Gold Transactions */}
        <Card className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 font-rpg flex items-center gap-2 border-b border-white/10 pb-3">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>RECENT GOLD TRANSACTIONS</span>
          </h2>

          {stats.recentTransactions.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">No transactions recorded yet.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {stats.recentTransactions.map((tx) => {
                const isEarn = tx.amount > 0;
                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isEarn ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {isEarn ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{tx.description}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`font-bold font-rpg text-sm ${
                        isEarn ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isEarn ? `+${tx.amount}` : tx.amount} G
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
