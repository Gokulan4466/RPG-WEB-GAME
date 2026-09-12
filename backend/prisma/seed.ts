import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LifeRPG achievements and shop items...');

  // 1. Seed Achievements
  const achievements = [
    {
      code: 'FIRST_QUEST',
      title: 'First Step of the Hero',
      description: 'Complete your first quest.',
      icon: 'sparkles',
      reqType: 'FIRST_QUEST',
      reqValue: 1,
      rewardXp: 50,
      rewardGold: 20,
    },
    {
      code: 'WARRIOR_1',
      title: 'Iron Warrior',
      description: 'Complete 10 Strength quests.',
      icon: 'dumbbell',
      category: 'STRENGTH',
      reqType: 'CATEGORY_COUNT',
      reqValue: 10,
      rewardXp: 200,
      rewardGold: 100,
    },
    {
      code: 'SCHOLAR_1',
      title: 'Archmage Scholar',
      description: 'Complete 10 Intelligence quests.',
      icon: 'book-open',
      category: 'INTELLIGENCE',
      reqType: 'CATEGORY_COUNT',
      reqValue: 10,
      rewardXp: 200,
      rewardGold: 100,
    },
    {
      code: 'RUNNER_1',
      title: 'Vitality Sentinel',
      description: 'Complete 10 Health quests.',
      icon: 'heart-pulse',
      category: 'HEALTH',
      reqType: 'CATEGORY_COUNT',
      reqValue: 10,
      rewardXp: 200,
      rewardGold: 100,
    },
    {
      code: 'DISCIPLINE_1',
      title: 'Monk of Willpower',
      description: 'Complete 10 Discipline quests.',
      icon: 'shield-check',
      category: 'DISCIPLINE',
      reqType: 'CATEGORY_COUNT',
      reqValue: 10,
      rewardXp: 200,
      rewardGold: 100,
    },
    {
      code: 'CREATOR_1',
      title: 'Artisan Visionary',
      description: 'Complete 10 Creativity quests.',
      icon: 'palette',
      category: 'CREATIVITY',
      reqType: 'CATEGORY_COUNT',
      reqValue: 10,
      rewardXp: 200,
      rewardGold: 100,
    },
    {
      code: 'DIPLOMAT_1',
      title: 'Silver-Tongued Orator',
      description: 'Complete 10 Charisma quests.',
      icon: 'users',
      category: 'CHARISMA',
      reqType: 'CATEGORY_COUNT',
      reqValue: 10,
      rewardXp: 200,
      rewardGold: 100,
    },
    {
      code: 'STREAK_7',
      title: 'Streak Master',
      description: 'Maintain a 7-day consecutive activity streak.',
      icon: 'flame',
      reqType: 'STREAK',
      reqValue: 7,
      rewardXp: 300,
      rewardGold: 150,
    },
    {
      code: 'LEVEL_10',
      title: 'Mythic Champion',
      description: 'Reach Level 10.',
      icon: 'crown',
      reqType: 'LEVEL',
      reqValue: 10,
      rewardXp: 500,
      rewardGold: 300,
    },
    {
      code: 'CENTURION',
      title: 'Centurion of Progress',
      description: 'Complete 100 total quests.',
      icon: 'swords',
      reqType: 'QUEST_COUNT',
      reqValue: 100,
      rewardXp: 1000,
      rewardGold: 500,
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: ach,
      create: ach,
    });
  }

  // 2. Seed Shop Items
  const items = [
    {
      code: 'THEME_CYBERPUNK',
      name: 'Neon Cyberpunk Aura',
      description: 'Unlocks the dark glowing cyberpunk neon theme UI accent frame.',
      category: 'THEME',
      priceGold: 100,
      icon: 'zap',
      rarity: 'RARE',
    },
    {
      code: 'THEME_ELVEN',
      name: 'Elven Forest Essence',
      description: 'A magical emerald luminescent aura around your character card.',
      category: 'THEME',
      priceGold: 150,
      icon: 'feather',
      rarity: 'RARE',
    },
    {
      code: 'FRAME_GOLDEN_VALOR',
      name: 'Golden Crest Avatar Frame',
      description: 'A glowing metallic gold border surrounding your RPG avatar.',
      category: 'FRAME',
      priceGold: 75,
      icon: 'shield',
      rarity: 'RARE',
    },
    {
      code: 'FRAME_VOID_OBSIDIAN',
      name: 'Obsidian Void Frame',
      description: 'A dark shadow flame border of ancient shadow magic.',
      category: 'FRAME',
      priceGold: 200,
      icon: 'moon',
      rarity: 'EPIC',
    },
    {
      code: 'TITLE_DRAGON_SLAYER',
      name: 'Title: Dragon Slayer',
      description: 'Displays the prestigious title "Dragon Slayer" next to your name.',
      category: 'TITLE',
      priceGold: 120,
      icon: 'swords',
      rarity: 'EPIC',
    },
    {
      code: 'TITLE_ARCHMAGE',
      name: 'Title: Supreme Archmage',
      description: 'Displays the title "Supreme Archmage" under your profile avatar.',
      category: 'TITLE',
      priceGold: 250,
      icon: 'wand-2',
      rarity: 'EPIC',
    },
    {
      code: 'BADGE_PHOENIX',
      name: 'Badge of the Phoenix',
      description: 'A flaming fiery badge denoting eternal resilience.',
      category: 'BADGE',
      priceGold: 80,
      icon: 'flame',
      rarity: 'COMMON',
    },
    {
      code: 'EFFECT_ASTRAL_SPARKLES',
      name: 'Astral Particle Trail',
      description: 'Spawns subtle floating galaxy particles on completed quests.',
      category: 'EFFECT',
      priceGold: 300,
      icon: 'sparkles',
      rarity: 'LEGENDARY',
    },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { code: item.code },
      update: item,
      create: item,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
