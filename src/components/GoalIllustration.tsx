// ─── GOAL ILLUSTRATIONS ──────────────────────────────────────
// Custom SVG graphics for each goal category
// No emojis — all proper vector art

import { GoalType } from '@/constants/theme';

interface IllProps {
  type: GoalType;
  size?: number;
  color?: string;
}

export default function GoalIllustration({ type, size = 28, color = '#080808' }: IllProps) {
  const s = size;

  const illustrations: Record<string, JSX.Element> = {
    travel: (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <path d="M6 13L14 2L22 13" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 10V22H17V17H11V22H6V10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="8" r="1.5" fill={color}/>
        <path d="M4 26H24" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    emergency: (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke={color} strokeWidth="2"/>
        <path d="M14 9V15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M10 14H18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="5" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
      </svg>
    ),
    tech: (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <rect x="4" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="2"/>
        <path d="M4 17H24" stroke={color} strokeWidth="1.5"/>
        <path d="M10 24H18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 20V24" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="14" cy="12" r="2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
      </svg>
    ),
    crypto: (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <path d="M14 4L22 9V19L14 24L6 19V9L14 4Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M14 4V24M6 9L22 19M22 9L6 19" stroke={color} strokeWidth="1" opacity="0.25"/>
        <circle cx="14" cy="14" r="4" stroke={color} strokeWidth="1.5"/>
        <circle cx="14" cy="14" r="1.5" fill={color}/>
      </svg>
    ),
    car: (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <path d="M4 18H24V22H4V18Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M6 18L9 11H19L22 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8" cy="22" r="2" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15"/>
        <circle cx="20" cy="22" r="2" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15"/>
        <path d="M12 14H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    home: (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <path d="M4 14L14 5L24 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 12V23H12V18H16V23H21V12" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <rect x="12" y="18" width="4" height="5" fill={color} fillOpacity="0.15"/>
      </svg>
    ),
    education: (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <path d="M14 6L3 12L14 18L25 12L14 6Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M7 14V20C7 20 10 23 14 23C18 23 21 20 21 20V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25 12V20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  };

  return illustrations[type] || (
    <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke={color} strokeWidth="2"/>
      <circle cx="14" cy="14" r="6" stroke={color} strokeWidth="2"/>
      <circle cx="14" cy="14" r="2" fill={color}/>
    </svg>
  );
}
