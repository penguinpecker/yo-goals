// ─── YO GOALS DESIGN SYSTEM ─────────────────────────────────
// Derived from Metio-Mobile design language
// Orange primary, Lavender secondary, Brutalist shadows, 900-weight uppercase headers

export const COLORS = {
  // Primary — Metio orange
  orange: '#F26F21',
  orangeLight: '#FF8C42',
  orangeDark: '#D85A10',

  // Secondary — Metio lavender
  lavender: '#938EF2',
  lavenderLight: '#B5B1F7',
  lavenderDark: '#7570D1',

  // YO Protocol accent
  yoGreen: '#CCFF00',
  yoGreenDark: '#6C9700',

  // Neutrals
  black: '#080808',
  darkGray: '#1A1A1A',
  gray: '#D9D9D9',
  lightGray: '#F5F5F5',
  white: '#FFFFFF',

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Text
  textPrimary: '#080808',
  textSecondary: '#666666',
  textTertiary: '#888888',
  textLight: '#FFFFFF',

  // Background
  background: '#D9D9D9',
  backgroundDark: '#080808',
  card: '#FFFFFF',
} as const;

export const SHADOWS = {
  hard: (offset = 3) => `${offset}px ${offset}px 0px ${COLORS.black}`,
  hardColor: (offset: number, color: string) => `${offset}px ${offset}px 0px ${color}`,
  none: 'none',
} as const;

export const FONTS = {
  heading: "'Barlow', system-ui, sans-serif",
  body: "'Barlow', system-ui, sans-serif",
} as const;

// ─── RISK LEVELS ─────────────────────────────────────────────
export const RISK_LEVELS = [
  { id: 0, name: 'Conservative', label: 'Safe', description: 'Mostly stablecoins, lowest volatility' },
  { id: 1, name: 'Balanced', label: 'Mix', description: 'Mix of stable + growth assets' },
  { id: 2, name: 'Growth', label: 'Bold', description: 'Higher crypto exposure, higher upside' },
] as const;

// ─── GOAL ILLUSTRATION TYPES ─────────────────────────────────
export const GOAL_TYPES = [
  { id: 'travel', label: 'Travel' },
  { id: 'emergency', label: 'Safety' },
  { id: 'tech', label: 'Tech' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'car', label: 'Car' },
  { id: 'home', label: 'Home' },
  { id: 'education', label: 'Education' },
] as const;

export type GoalType = typeof GOAL_TYPES[number]['id'];
export type RiskLevel = 0 | 1 | 2;
