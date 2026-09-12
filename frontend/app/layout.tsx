import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../lib/auth';

export const metadata: Metadata = {
  title: 'LifeRPG - Turn Your Real Life Into An Adventure',
  description: 'Convert real-life tasks, habits, and studying into RPG quests. Gain XP, gold, level up your character, and build consistency.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-rpg-bg text-slate-100 antialiased min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
