/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: '#090b11',
          surface: '#121629',
          card: '#181d36',
          border: 'rgba(255, 255, 255, 0.08)',
          gold: '#fbbf24',
          goldDark: '#d97706',
          purple: '#a855f7',
          purpleDark: '#7e22ce',
          crimson: '#f43f5e',
          emerald: '#10b981',
          cyan: '#06b6d4',
          textMuted: '#94a3b8',
        },
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(251, 191, 36, 0.25)',
        'purple-glow': '0 0 20px rgba(168, 85, 247, 0.25)',
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.25)',
        'rpg-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        rpg: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
