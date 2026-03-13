import { ReactNode } from 'react';
import { COLORS } from '@/constants/theme';
import { YO_VAULTS } from '@/constants/contracts';

export function ProgressRing({ progress, size = 120, strokeWidth = 8, color = COLORS.orange }: { progress: number; size?: number; strokeWidth?: number; color?: string }) {
  const r = (size - strokeWidth) / 2, ci = r * 2 * Math.PI, off = ci - (progress / 100) * ci;
  return (<svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={COLORS.gray} strokeWidth={strokeWidth} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={ci} strokeDashoffset={off} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} /></svg>);
}

export function VaultBadge({ vault, size = 26 }: { vault: string; size?: number }) {
  const config = YO_VAULTS[vault] || { color: '#888' };
  const letter = vault.replace('yo', '').charAt(0);
  return (<div style={{ width: size, height: size, borderRadius: size * 0.25, background: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: size * 0.32, color: COLORS.black, letterSpacing: -0.5, border: `1.5px solid ${COLORS.black}`, flexShrink: 0 }}>{letter}</div>);
}

export function SectionLabel({ icon: Icon, children }: { icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>; children: ReactNode }) {
  return (<div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, marginTop: 20, display: 'flex', alignItems: 'center', gap: 6 }}>{Icon && <Icon size={12} strokeWidth={2.5} />}{children}</div>);
}

export function AllocBar({ vault, weight, apy }: { vault: string; weight: number; apy: number }) {
  const config = YO_VAULTS[vault] || { color: '#888' };
  return (<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><VaultBadge vault={vault} /><div style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}><span style={{ fontSize: 11, fontWeight: 700, color: COLORS.black }}>{vault}</span><span style={{ fontSize: 10, color: '#888' }}>{weight / 100}%</span></div><div style={{ height: 6, background: '#F5F5F5', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', background: config.color, borderRadius: 3, width: `${weight / 100}%`, transition: 'width 0.8s' }} /></div></div><span style={{ fontSize: 10, fontWeight: 800, color: COLORS.success, minWidth: 40, textAlign: 'right' }}>{apy}%</span></div>);
}

export function StrategyBar({ allocations }: { allocations: { vault: string; weight: number }[] }) {
  return (<div style={{ display: 'flex', height: 5, borderRadius: 3, overflow: 'hidden', gap: 1 }}>{allocations.map((a, i) => { const c = (YO_VAULTS[a.vault] || { color: '#888' }).color; return <div key={i} style={{ height: '100%', background: c, flex: a.weight, borderRadius: i === 0 ? '3px 0 0 3px' : i === allocations.length - 1 ? '0 3px 3px 0' : '0' }} />; })}</div>);
}

export function Card({ children, variant = 'default', onClick, style: s }: { children: ReactNode; variant?: 'default' | 'dark' | 'outlined'; onClick?: () => void; style?: React.CSSProperties }) {
  const bg = variant === 'dark' ? '#080808' : variant === 'outlined' ? 'transparent' : '#FFF';
  const border = variant === 'outlined' ? '2px dashed #080808' : '2px solid #080808';
  return (<div onClick={onClick} style={{ background: bg, border, borderRadius: 16, padding: 16, cursor: onClick ? 'pointer' : 'default', transition: 'all 0.2s', ...s }}>{children}</div>);
}

export function Button({ children, onClick, style: s }: { children: ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (<button onClick={onClick} style={{ background: COLORS.orange, color: COLORS.black, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '12px 20px', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '2px 2px 0 #080808', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, ...s }}>{children}</button>);
}
