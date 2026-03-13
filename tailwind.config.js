/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        orange: { DEFAULT: '#F26F21', light: '#FF8C42', dark: '#D85A10' },
        lavender: { DEFAULT: '#938EF2', light: '#B5B1F7', dark: '#7570D1' },
        'yo-green': { DEFAULT: '#CCFF00', dark: '#6C9700' },
        ink: { DEFAULT: '#080808', gray: '#1A1A1A' },
      },
      fontFamily: { barlow: ['var(--font-barlow)', 'system-ui', 'sans-serif'] },
      borderRadius: { brutalist: '16px' },
      boxShadow: { hard: '3px 3px 0px #080808', 'hard-sm': '2px 2px 0px #080808' },
    },
  },
  plugins: [],
};
