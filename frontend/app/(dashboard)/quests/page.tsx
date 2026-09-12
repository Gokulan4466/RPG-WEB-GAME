'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Swords,
  Plus,
  Filter,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  Brain,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Palette,
  Users,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { apiRequest } from '../../../lib/api';
import { Quest, Category, Difficulty, QuestCompletionResponse } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
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

export default function QuestsPage() {
  const { updateCharacterState } = useAuth();

  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  // Create/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('INTELLIGENCE');
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>('EASY');
  const [formDueDate, setFormDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const fetchQuests = useCallback(async () => {
    setLoading(true);
    let endpoint = `/quests?status=${activeTab}`;
    if (selectedCategory !== 'ALL') endpoint += `&category=${selectedCategory}`;
    if (selectedDifficulty !== 'ALL') endpoint += `&difficulty=${selectedDifficulty}`;

    const res = await apiRequest<Quest[]>(endpoint);
    if (res.success && res.data) {
      setQuests(res.data);
    }
    setLoading(false);
  }, [activeTab, selectedCategory, selectedDifficulty]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const handleOpenCreateModal = () => {
    setEditingQuest(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('INTELLIGENCE');
    setFormDifficulty('EASY');
    setFormDueDate('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (quest: Quest) => {
    setEditingQuest(quest);
    setFormTitle(quest.title);
    setFormDescription(quest.description || '');
    setFormCategory(quest.category);
    setFormDifficulty(quest.difficulty);
    setFormDueDate(quest.dueDate ? new Date(quest.dueDate).toISOString().slice(0, 10) : '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim()) {
      setFormError('Quest title is required.');
      return;
    }

    setSubmitting(true);
    const body = {
      title: formTitle,
      description: formDescription || null,
      category: formCategory,
      difficulty: formDifficulty,
      dueDate: formDueDate ? new Date(formDueDate).toISOString() : null,
    };

    let res;
    if (editingQuest) {
      res = await apiRequest<Quest>(`/quests/${editingQuest.id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    } else {
      res = await apiRequest<Quest>('/quests', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    }

    setSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      fetchQuests();
    } else {
      setFormError(res.error?.message || 'Failed to save quest.');
    }
  };

  const handleDeleteQuest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quest?')) return;

    // Optimistic delete
    setQuests((prev) => prev.filter((q) => q.id !== id));

    const res = await apiRequest(`/quests/${id}`, { method: 'DELETE' });
    if (!res.success) {
      alert(res.error?.message || 'Failed to delete quest.');
      fetchQuests();
    }
  };

  const handleCompleteQuest = async (questId: string) => {
    const questToComplete = quests.find((q) => q.id === questId);
    if (!questToComplete) return;

    // Optimistic removal from active board
    setQuests((prev) => prev.filter((q) => q.id !== questId));

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
      // Revert optimistic update
      setQuests((prev) => [questToComplete, ...prev]);
      alert(res.error?.message || 'Failed to complete quest.');
    }
  };

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

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 font-rpg">
            QUESTS BOARD
          </h1>
          <p className="text-xs text-slate-400">
            Convert real-life tasks into RPG quests. Complete quests to gain XP, Gold, and Attributes!
          </p>
        </div>

        <Button variant="gold" size="lg" onClick={handleOpenCreateModal} className="font-rpg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>New RPG Quest</span>
        </Button>
      </div>

      {/* Tab Selectors & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
        {/* Active vs Completed Tabs */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-rpg transition-all ${
              activeTab === 'ACTIVE'
                ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Quests
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-rpg transition-all ${
              activeTab === 'COMPLETED'
                ? 'bg-emerald-500 text-white shadow-emerald-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completed Quests
          </button>
        </div>

        {/* Category & Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-semibold text-slate-200 focus:border-amber-400"
          >
            <option value="ALL">All Categories</option>
            <option value="STRENGTH">Strength</option>
            <option value="INTELLIGENCE">Intelligence</option>
            <option value="HEALTH">Health</option>
            <option value="DISCIPLINE">Discipline</option>
            <option value="CREATIVITY">Creativity</option>
            <option value="CHARISMA">Charisma</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-semibold text-slate-200 focus:border-amber-400"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
            <option value="EPIC">Epic</option>
          </select>
        </div>
      </div>

      {/* Quest Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-900/60 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : quests.length === 0 ? (
        <Card className="text-center py-16 space-y-4">
          <Swords className="w-16 h-16 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-slate-300 font-rpg">
            No {activeTab.toLowerCase()} quests found.
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {activeTab === 'ACTIVE'
              ? 'No active quests match your criteria. Create your next quest to continue your adventure!'
              : 'You have not completed any quests yet. Complete active quests to see them listed here!'}
          </p>
          {activeTab === 'ACTIVE' && (
            <Button variant="gold" size="md" onClick={handleOpenCreateModal} className="font-rpg">
              + Create Quest
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests.map((quest) => {
            const CategoryIcon = categoryIcons[quest.category] || Brain;
            const isCompleted = quest.status === 'COMPLETED';

            return (
              <Card
                key={quest.id}
                className={`flex flex-col justify-between space-y-4 transition-all duration-300 ${
                  isCompleted ? 'opacity-70 border-emerald-500/20' : 'hover:border-amber-500/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-900 border border-white/10 text-amber-400">
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-rpg">
                        {quest.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge type="difficulty" value={quest.difficulty} />
                      {!isCompleted && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(quest)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-900 transition"
                            title="Edit quest"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuest(quest.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
                            title="Delete quest"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 font-rpg leading-tight">
                    {quest.title}
                  </h3>
                  {quest.description && (
                    <p className="text-xs text-slate-400 line-clamp-3">{quest.description}</p>
                  )}

                  {quest.dueDate && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Due: {new Date(quest.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Rewards & Complete CTA */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-purple-400 font-rpg">+{quest.xpReward} XP</span>
                    <span className="text-amber-400 font-rpg">+{quest.goldReward} Gold</span>
                    <span className="text-emerald-400 font-rpg">
                      +{quest.attributeReward} {quest.category.slice(0, 3)}
                    </span>
                  </div>

                  {!isCompleted ? (
                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={() => handleCompleteQuest(quest.id)}
                      className="w-full font-rpg flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Quest</span>
                    </Button>
                  ) : (
                    <div className="text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed on {new Date(quest.completedAt!).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Quest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl glass-panel-gold border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-amber-300 font-rpg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{editingQuest ? 'EDIT QUEST' : 'CREATE NEW QUEST'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveQuest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-rpg">
                  Quest Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Study Java Data Structures for 1 hour"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 placeholder-slate-600 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-rpg">
                  Description / Notes
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Details about what needs to be accomplished..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 placeholder-slate-600 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-rpg">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Category)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-semibold text-slate-100 focus:border-amber-400"
                  >
                    <option value="INTELLIGENCE">Intelligence (Coding, Study)</option>
                    <option value="STRENGTH">Strength (Gym, Workout)</option>
                    <option value="HEALTH">Health (Running, Diet)</option>
                    <option value="DISCIPLINE">Discipline (Meditation, Early rise)</option>
                    <option value="CREATIVITY">Creativity (Reading, Art)</option>
                    <option value="CHARISMA">Charisma (Public speaking, Social)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-rpg">
                    Difficulty
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-semibold text-slate-100 focus:border-amber-400"
                  >
                    <option value="EASY">Easy (+30 XP, +15 Gold)</option>
                    <option value="MEDIUM">Medium (+60 XP, +30 Gold)</option>
                    <option value="HARD">Hard (+100 XP, +50 Gold)</option>
                    <option value="EPIC">Epic (+200 XP, +100 Gold)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-rpg">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-sm focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gold" size="md" disabled={submitting} className="font-rpg">
                  {submitting ? 'Saving...' : editingQuest ? 'Save Changes' : 'Create Quest'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
