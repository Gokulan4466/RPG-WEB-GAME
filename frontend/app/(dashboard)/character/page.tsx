'use client';

import React from 'react';
import {
  User,
  Shield,
  Flame,
  Coins,
  Brain,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Palette,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';

export default function CharacterPage() {
  const { user, character } = useAuth();

  if (!character) return null;

  const equippedTitle = character.equippedCosmetics?.find((item) => item.category === 'TITLE');
  const equippedFrame = character.equippedCosmetics?.find((item) => item.category === 'FRAME');

  const attributes = [
    {
      name: 'Strength',
      val: character.strength,
      icon: Dumbbell,
      color: 'from-rose-600 to-rose-400',
      desc: 'Gym, Physical training, Heavy Lifting',
    },
    {
      name: 'Intelligence',
      val: character.intelligence,
      icon: Brain,
      color: 'from-cyan-600 to-cyan-400',
      desc: 'Coding, Algorithm practice, Studying',
    },
    {
      name: 'Health',
      val: character.health,
      icon: HeartPulse,
      color: 'from-emerald-600 to-emerald-400',
      desc: 'Running, Cardio, Meal prep, Sleep',
    },
    {
      name: 'Discipline',
      val: character.discipline,
      icon: ShieldCheck,
      color: 'from-amber-600 to-amber-400',
      desc: 'Meditation, Morning routines, Willpower',
    },
    {
      name: 'Creativity',
      val: character.creativity,
      icon: Palette,
      color: 'from-purple-600 to-purple-400',
      desc: 'Reading, Writing, Design, Art creation',
    },
    {
      name: 'Charisma',
      val: character.charisma,
      icon: Users,
      color: 'from-pink-600 to-pink-400',
      desc: 'Public speaking, Social activities, Networking',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 font-rpg">
          HERO CHARACTER SHEET
        </h1>
        <p className="text-xs text-slate-400">
          Inspect your hero attribute scores, equipped cosmetics, and experience progression.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character Card Main Column */}
        <Card variant="gold" className="lg:col-span-1 space-y-6 text-center relative overflow-hidden">
          {/* Avatar Container */}
          <div className="relative inline-block mx-auto mt-4">
            <div
              className={`w-32 h-32 rounded-3xl bg-slate-950 p-1.5 mx-auto flex items-center justify-center relative shadow-gold-glow ${
                equippedFrame ? 'border-4 border-amber-400 animate-pulse' : 'border-2 border-amber-500/40'
              }`}
            >
              <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-slate-900 to-purple-950 flex items-center justify-center">
                <User className="w-16 h-16 text-amber-400" />
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs font-rpg shadow-gold-glow">
              LVL {character.level}
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <h2 className="text-2xl font-black text-slate-100 font-rpg">{character.name}</h2>
            <p className="text-xs text-amber-400 font-bold uppercase tracking-widest font-rpg">
              {equippedTitle ? equippedTitle.name : 'Novice Hero'}
            </p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4 text-left">
            <ProgressBar
              current={character.currentXp}
              max={character.requiredXpForNextLevel || 100}
              label="XP PROGRESS"
              variant="xp"
            />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/20">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Gold Wallet</div>
                <div className="text-lg font-bold text-amber-400 font-rpg flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  <span>{character.gold}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/20">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Streak</div>
                <div className="text-lg font-bold text-rose-400 font-rpg flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  <span>{character.currentStreak} Days</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Attribute Scores & Breakdown */}
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-extrabold text-slate-100 font-rpg">ATTRIBUTES & SKILLS</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Updated via server quests</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributes.map((attr) => {
              const Icon = attr.icon;
              return (
                <div
                  key={attr.name}
                  className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2 hover:border-amber-500/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-950 border border-white/10">
                        <Icon className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-200 font-rpg">{attr.name}</span>
                    </div>
                    <span className="text-lg font-black text-amber-300 font-rpg">
                      {attr.val} <span className="text-xs text-slate-400 font-normal">PTS</span>
                    </span>
                  </div>

                  {/* Attribute Bar fill representation */}
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${attr.color}`}
                      style={{ width: `${Math.min(100, attr.val * 3)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 italic">{attr.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Equipped Cosmetics Badge Section */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-slate-300 font-rpg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>EQUIPPED HERO COSMETICS</span>
            </h3>

            {character.equippedCosmetics && character.equippedCosmetics.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {character.equippedCosmetics.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-rpg"
                  >
                    <Award className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No cosmetics currently equipped. Visit the Shop to unlock titles, frames, and themes!
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
