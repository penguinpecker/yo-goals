// ─── YO GOALS LOGO — CONCEPT A: MULTI-VAULT FILL ────────────
// White YO letterforms on orange, O filled with multi-vault color bands
// Represents: savings filling up across multiple vault strategies

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full' | 'wordmark';
  background?: 'orange' | 'black' | 'white' | 'transparent';
  className?: string;
}

// The core YO mark SVG — reused across all sizes
const YOMark = ({ width, height, letterColor = '#FFF', showFill = true }: {
  width: number; height: number; letterColor?: string; showFill?: boolean;
}) => (
  <svg width={width} height={height} viewBox="0 0 68 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Y letterform */}
    <path d="M4 4L16 20V36" stroke={letterColor} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 4L16 20" stroke={letterColor} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
    {/* O letterform */}
    <circle cx="48" cy="20" r="16" stroke={letterColor} strokeWidth="9" fill="none"/>
    {/* Multi-vault fill bands inside O (the narrative) */}
    {showFill && <>
      <clipPath id="yo-o-fill">
        <circle cx="48" cy="20" r="11.5"/>
      </clipPath>
      {/* Bottom layer — lavender (yoETH allocation) */}
      <rect x="32" y="24" width="32" height="16" fill="#938EF2" clipPath="url(#yo-o-fill)" opacity="0.6"/>
      {/* Top layer — YO green (yield growth) */}
      <rect x="32" y="30" width="32" height="10" fill="#CCFF00" clipPath="url(#yo-o-fill)" opacity="0.7"/>
    </>}
  </svg>
);

const SIZES = {
  xs: { icon: 16, mark: { w: 11, h: 7 }, radius: 4, border: 0, shadow: 0 },
  sm: { icon: 24, mark: { w: 16, h: 10 }, radius: 6, border: 1, shadow: 0 },
  md: { icon: 32, mark: { w: 22, h: 14 }, radius: 8, border: 1.5, shadow: 2 },
  lg: { icon: 40, mark: { w: 28, h: 18 }, radius: 10, border: 2, shadow: 2 },
  xl: { icon: 56, mark: { w: 40, h: 26 }, radius: 16, border: 2, shadow: 3 },
};

export default function YoGoalsLogo({ size = 'lg', variant = 'full', background = 'orange', className }: LogoProps) {
  const s = SIZES[size];
  const showFill = size !== 'xs' && size !== 'sm';

  const bgColors = {
    orange: { bg: '#F26F21', letter: '#FFF', text: '#080808' },
    black: { bg: '#080808', letter: '#F26F21', text: '#FFF' },
    white: { bg: '#FFF', letter: '#080808', text: '#080808' },
    transparent: { bg: 'transparent', letter: '#080808', text: '#080808' },
  };

  const colors = bgColors[background];

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <div className={className} style={{
        width: s.icon, height: s.icon,
        borderRadius: s.radius,
        background: background === 'transparent' ? '#F26F21' : colors.bg,
        border: s.border ? `${s.border}px solid #080808` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: s.shadow ? `${s.shadow}px ${s.shadow}px 0px #080808` : 'none',
        flexShrink: 0,
      }}>
        <YOMark
          width={s.mark.w} height={s.mark.h}
          letterColor={background === 'black' ? '#F26F21' : '#FFF'}
          showFill={showFill}
        />
      </div>
    );
  }

  // Full variant: icon + "YO GOALS" text
  if (variant === 'full') {
    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center', gap: size === 'xl' ? 12 : 10 }}>
        <div style={{
          width: s.icon, height: s.icon,
          borderRadius: s.radius,
          background: background === 'orange' ? '#080808' : '#F26F21',
          border: `${s.border}px solid #080808`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: s.shadow ? `${s.shadow}px ${s.shadow}px 0px #080808` : 'none',
          flexShrink: 0,
        }}>
          <YOMark
            width={s.mark.w} height={s.mark.h}
            letterColor={background === 'orange' ? '#F26F21' : '#FFF'}
            showFill={showFill}
          />
        </div>
        <span style={{
          fontWeight: 900,
          fontSize: size === 'xl' ? 16 : size === 'lg' ? 13 : 11,
          letterSpacing: 2,
          textTransform: 'uppercase' as const,
          color: colors.text,
          fontFamily: "'Barlow', system-ui, sans-serif",
        }}>
          YO GOALS
        </span>
      </div>
    );
  }

  // Wordmark variant: just the YO letters, no container
  return (
    <YOMark
      width={s.mark.w * 2} height={s.mark.h * 2}
      letterColor={colors.letter}
      showFill={showFill}
    />
  );
}

// Export the standalone mark for use in headers, splash screens etc.
export { YOMark };
