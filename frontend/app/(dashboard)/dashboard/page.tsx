'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Swords,
  Flame,
  Coins,
  Plus,
  CheckCircle2,
  Brain,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Palette,
  Users,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { apiRequest } from '../../../lib/api';
import { Quest, QuestCompletionResponse, Category } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Badge } from '../../../components/ui/Badge';
import { LevelUpModal } from '../../../components/ui/LevelUpModal';

const categoryIcons: Record<Category, any> = {
  STRENGTH: Dumbbell,
  INTELLIGENCE: Brain,
  HEALTH: HeartPulse,
  DISCIPLINE: ShieldCheck,
  CREATIVITY: Palette,
  CHARISMA: Users,
};

export default function DashboardPage() {
  const { user, character, updateCharacterState } = useAuth();

  const [todaysQuests, setTodaysQuests] = useState<Quest[]>([]);
  const [loadingQuests, setLoadingQuests] = useState(true);

  // Level Up Modal State
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean;
    oldLevel: number;
    newLevel: number;
    xpEarned: number;
    goldEarned: number;
    attributeGained: number;
    attributeType: string;
  }>({
    isOpen: false,
    oldLevel: 1,
    newLevel: 2,
    xpEarned: 0,
    goldEarned: 0,
    attributeGained: 1,
    attributeType: 'INTELLIGENCE',
  });

  const fetchTodaysQuests = useCallback(async () => {
    setLoadingQuests(true);
    const res = await apiRequest<Quest[]>('/quests?status=ACTIVE');
    if (res.success && res.data) {
      setTodaysQuests(res.data.slice(0, 5));
    }
    setLoadingQuests(false);
  }, []);

  useEffect(() => {
    fetchTodaysQuests();
  }, [fetchTodaysQuests]);

  const handleCompleteQuest = async (questId: string) => {
    const questToComplete = todaysQuests.find((q) => q.id === questId);
    if (!questToComplete) return;

    setTodaysQuests((prev) => prev.filter((q) => q.id !== questId));

    const res = await apiRequest<QuestCompletionResponse>(`/quests/${questId}/complete`, {
      method: 'POST',
    });

    if (res.success && res.data) {
      const { character: updatedChar, levelUp, rewards } = res.data;
      updateCharacterState(updatedChar);

      if (levelUp.didLevelUp) {
        setLevelUpData({
          isOpen: true,
          oldLevel: levelUp.oldLevel,
          newLevel: levelUp.newLevel,
          xpEarned: rewards.xpGained,
          goldEarned: rewards.goldGained,
          attributeGained: rewards.attributeGained,
          attributeType: rewards.attributeType,
        });
      }
    } else {
      setTodaysQuests((prev) => [questToComplete, ...prev]);
      alert(res.error?.message || 'Failed to complete quest.');
    }
  };

  if (!character) return null;

  return (
    <div className="space-y-6">
      {/* Level Up Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpData.isOpen}
        onClose={() => setLevelUpData((prev) => ({ ...prev, isOpen: false }))}
        oldLevel={levelUpData.oldLevel}
        newLevel={levelUpData.newLevel}
        xpEarned={levelUpData.xpEarned}
        goldEarned={levelUpData.goldEarned}
        attributeGained={levelUpData.attributeGained}
        attributeType={levelUpData.attributeType}
      />

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel-gold p-6 md:p-8 border border-amber-500/40">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-rpg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>REALM OF ADVENTURE</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 font-rpg">
              Greetings, {user?.name}!
            </h1>
            <p className="text-sm text-slate-300">
              "Every real-life activity completed brings your hero closer to legendary power."
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link href="/quests">
              <Button variant="gold" size="lg" className="font-rpg flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span>Create New Quest</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Character Hero Stats & XP Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character XP Card */}
        <Card variant="gold" className="lg:col-span-2 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-amber-400/50 p-1 shadow-gold-glow flex items-center justify-center text-amber-300 font-black font-rpg text-xl">
                LVL {character.level}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 font-rpg">{character.name}</h3>
                <p className="text-xs text-amber-400 font-semibold">Rank: Novice Adventurer</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold">Streak</div>
                <div className="text-lg font-bold text-rose-400 flex items-center gap-1">
                  <Flame className="w-5 h-5" />
                  <span>{character.currentStreak} Days</span>
                </div>
              </div>
              <div className="text-right pl-4 border-l border-white/10">
                <div className="text-xs text-slate-400 font-semibold">Gold</div>
                <div className="text-lg font-bold text-amber-400 flex items-center gap-1">
                  <Coins className="w-5 h-5" />
                  <span>{character.gold}</span>
                </div>
              </div>
            </div>
          </div>

          <ProgressBar
            current={character.currentXp}
            max={character.requiredXpForNextLevel || 100}
            label="CHARACTER XP PROGRESS"
            variant="xp"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {[
              { name: 'Strength', val: character.strength, icon: Dumbbell, color: 'text-rose-400' },
              { name: 'Intelligence', val: character.intelligence, icon: Brain, color: 'text-cyan-400' },
              { name: 'Health', val: character.health, icon: HeartPulse, color: 'text-emerald-400' },
              { name: 'Discipline', val: character.discipline, icon: ShieldCheck, color: 'text-amber-400' },
              { name: 'Creativity', val: character.creativity, icon: Palette, color: 'text-purple-400' },
              { name: 'Charisma', val: character.charisma, icon: Users, color: 'text-pink-400' },
            ].map((attr) => {
              const Icon = attr.icon;
              return (
                <div
                  key={attr.name}
                  className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${attr.color}`} />
                    <span className="text-xs font-medium text-slate-300">{attr.name}</span>
                  </div>
                  <span className="text-sm font-bold font-rpg text-slate-100">{attr.val}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Activity & Stats Card */}
        <Card variant="purple" className="space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-200 font-rpg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span>Progression Summary</span>
              </h3>
              <Link href="/stats" className="text-xs text-purple-300 hover:underline flex items-center">
                <span>View Stats</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/20 flex justify-between items-center">
                <span className="text-xs text-slate-300">Total XP Accumulated</span>
                <span className="text-sm font-bold text-purple-300 font-rpg">{character.totalXp} XP</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/20 flex justify-between items-center">
                <span className="text-xs text-slate-300">Longest Streak Record</span>
                <span className="text-sm font-bold text-rose-400 font-rpg">{character.longestStreak} Days</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/20 flex justify-between items-center">
                <span className="text-xs text-slate-300">Character Level</span>
                <span className="text-sm font-bold text-amber-400 font-rpg">Level {character.level}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-500/20">
            <Link href="/shop">
              <Button variant="purple" size="md" className="w-full font-rpg">
                Visit Hero Shop 🛒
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Active Quests Board Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-extrabold text-slate-100 font-rpg">Active Quests</h2>
          </div>

          <Link href="/quests" className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1">
            <span>View All Quests Board</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingQuests ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-900/60 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : todaysQuests.length === 0 ? (
          <Card className="text-center py-12 space-y-3">
            <Swords className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300 font-rpg">No active quests right now.</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Ready for your next adventure? Create your first real-life quest and earn XP and Gold!
            </p>
            <Link href="/quests">
              <Button variant="gold" size="md" className="mt-2 font-rpg">
                + Add Real Life Quest
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaysQuests.map((quest) => {
              const CategoryIcon = categoryIcons[quest.category as Category] || Brain;
              return (
                <Card
                  key={quest.id}
                  className="hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-slate-900 border border-white/10 text-amber-400">
                          <CategoryIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-rpg">
                          {quest.category}
                        </span>
                      </div>
                      <Badge type="difficulty" value={quest.difficulty} />
                    </div>

                    <h3 className="text-base font-bold text-slate-100 font-rpg">{quest.title}</h3>
                    {quest.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">{quest.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <span className="text-purple-400 font-rpg">+{quest.xpReward} XP</span>
                      <span className="text-amber-400 font-rpg">+{quest.goldReward} Gold</span>
                      <span className="text-emerald-400 font-rpg">+{quest.attributeReward} {quest.category.slice(0, 3)}</span>
                    </div>

                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={() => handleCompleteQuest(quest.id)}
                      className="font-rpg flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
