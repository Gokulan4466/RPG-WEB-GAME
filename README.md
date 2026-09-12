# LifeRPG ⚔️
> "Turn Your Real Life Into An Adventure."

LifeRPG is a full-stack, production-grade role-playing game application that converts your real-life daily tasks, studying, coding sessions, and workouts into rewarding RPG quests. Complete real-world activities to gain XP, level up your character, earn Gold, boost your attributes, maintain habit streaks, unlock achievements, and customize your hero in the armory shop!

---

## 🌟 Problem & Solution

### Problem
Traditional productivity tools (to-do lists, habit trackers, SaaS dashboards) feel boring because the reward for self-improvement is delayed. Users lose motivation quickly.

### Solution
**LifeRPG** bridges real-life accomplishments directly into instant RPG gratification.
- **Study Java for 1 hour** -> Quest: *Master Java Basics* (+50 XP, +20 Gold, +5 Intelligence)
- **Go to the Gym** -> Quest: *Strength Training* (+40 XP, +15 Gold, +5 Strength)
- **Morning Meditation** -> Quest: *Mindful Focus* (+30 XP, +10 Gold, +3 Discipline)

Completing daily activities directly levels up your character, expands your attribute scores, and unlocks prestigious badges and armory cosmetics.

---

## 🚀 Key Features

- **Dark Fantasy RPG Design System**: Glassmorphic panels, obsidian theme, glowing accents, tactile RPG cards, and responsive sidebar navigation.
- **Server-Side XP Engine**: Non-linear level progression formula (`requiredXP(level) = Math.floor(100 * level^1.5)`). Multi-level level-up celebrations powered by Framer Motion & particle confetti.
- **Atomic Quest Completion**: Multi-table database transactions updating XP, Level, Gold, Attributes, Streak, Daily Activity, and Achievement Unlocks simultaneously with rollback safety.
- **Gold Economy & Armory Shop**: Virtual currency rewards spent on themes, avatar frames, titles, and glowing cosmetics.
- **Hero Inventory Backpack**: Equip and unequip purchased titles, frames, and custom styling.
- **Streak & Habit Tracking**: Automatic calendar-day streak processing ensuring a single daily increment regardless of quest volume.
- **Hall of Achievements**: Automatic requirement evaluation and unlocking for milestone feats.
- **30-Day Activity Heatmap**: GitHub-style activity grid visualizing daily quest volume and intensity.
- **Security & Authorization**: JWT token authorization, password hashing with bcrypt, strict session ownership verification.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS + Custom Dark Fantasy RPG CSS Design System
- **Animation**: Framer Motion + Canvas Confetti
- **Icons**: Lucide React
- **Validation**: Zod

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **ORM & DB Client**: Prisma ORM
- **Database**: PostgreSQL (Relational schema with cascade rules and unique constraints)
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs
- **Testing**: Jest + Supertest

---

## 📊 Database Schema

The database relies on PostgreSQL as the single source of truth.

```
                    +--------------------+
                    |       User         |
                    +---------+----------+
                              |
       +----------------------+----------------------+
       |                      |                      |
       v                      v                      v
+--------------+      +---------------+      +---------------+
|  Character   |      |    Quests     |      | DailyActivity |
+--------------+      +-------+-------+      +---------------+
                              |
                              v
                      +---------------+
                      |QuestCompletion|
                      +---------------+

       +----------------------+----------------------+
       |                      |                      |
       v                      v                      v
+--------------+      +---------------+      +---------------+
| Inventory    |      | Transaction   |      |UserAchievement|
+--------------+      +---------------+      +---------------+
```

---

## 🏁 Getting Started & Local Development

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose (or local PostgreSQL instance)

### 1. Database Setup
Start the local PostgreSQL container:
```bash
docker-compose up -d
```

### 2. Backend Setup
Navigate to the `backend/` directory:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```
The Express server will launch on `http://localhost:5000`.

### 3. Frontend Setup
In a separate terminal, navigate to `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🧪 Testing & Build Verification

Run backend unit & integration tests:
```bash
cd backend
npm test
```

Run TypeScript verification:
```bash
cd backend && npm run typecheck
cd frontend && npm run typecheck
```

Build production bundle:
```bash
cd frontend && npm run build
```

---

## 🎬 90-Second Hackathon Demo Flow

1. **Open LifeRPG**: Navigate to `http://localhost:3000`.
2. **Register**: Create a new hero character (e.g. *Arthur Pendragon*).
3. **Dashboard**: Inspect Level 1 character summary, initial 50 Gold, and empty active streak.
4. **Create Quest**: Click **+ New RPG Quest** (e.g., Title: *"Study Algorithms for 1 hour"*, Category: *Intelligence*, Difficulty: *Epic*).
5. **Complete Quest**: Click **Complete**. Watch instant optimistic UI feedback, XP bar fill, Gold increment (+100 G), Intelligence score increase, and 1-day 🔥 streak activation.
6. **Level-Up Celebration**: Cross the XP threshold to trigger the celebratory Level-Up modal with particle confetti!
7. **Shop Armory**: Open the Shop, select *"Golden Crest Avatar Frame"* or *"Title: Supreme Archmage"*, and purchase with earned Gold.
8. **Inventory & Equip**: Open Inventory, click **Equip** to attach your new title/frame to your hero sheet.
9. **Activity Heatmap**: Open Statistics to view your GitHub-style activity calendar block.
10. **Persistence Verification**: Refresh the browser or logout/login — all character progress, inventory, quests, and statistics remain persisted in PostgreSQL!

---

## 🌐 Deployment Configuration

- **Frontend**: Ready for deployment on **Vercel** (`npm run build`). Set `NEXT_PUBLIC_API_URL` environment variable.
- **Backend**: Ready for deployment on **Render / Railway / Fly.io**. Set `DATABASE_URL`, `JWT_SECRET`, `PORT`, and `CLIENT_URL`.
- **Database**: Hosted PostgreSQL on Supabase, Neon, or Railway PostgreSQL.
