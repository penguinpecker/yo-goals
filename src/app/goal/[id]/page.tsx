'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, ArrowUpRight, TrendingUp, Sparkles, Clock, Percent, Eye, Lock, RefreshCw, Sliders, Check, Send, AlertTriangle, Shield } from 'lucide-react';
import { ProgressRing, GoalIllustration, VaultBadge, AllocBar, SectionLabel } from '@/components';
import { COLORS } from '@/constants/theme';
import BottomNav from '@/components/BottomNav';

const RISKS = ['Conservative', 'Balanced', 'Growth'];

const GOALS: Record<string, any> = {
  '1': { name: 'Japan Trip', ill: 'travel', target: 3000, current: 1847, allocs: [{ vault: 'yoUSD', weight: 7000, apy: 18.4 }, { vault: 'yoETH', weight: 2000, apy: 13.2 }, { vault: 'yoEUR', weight: 1000, apy: 11.6 }], bApy: 16.8, risk: 1, color: COLORS.orange, days: 365, dep: 1700, yld: 147 },
  '2': { name: 'Emergency Fund', ill: 'emergency', target: 10000, current: 6230, allocs: [{ vault: 'yoUSD', weight: 9000, apy: 18.4 }, { vault: 'yoEUR', weight: 1000, apy: 11.6 }], bApy: 17.7, risk: 0, color: COLORS.lavender, days: 295, dep: 5800, yld: 430 },
  '3': { name: 'New MacBook', ill: 'tech', target: 2500, current: 2380, allocs: [{ vault: 'yoUSD', weight: 10000, apy: 18.4 }], bApy: 18.4, risk: 0, color: COLORS.success, days: 82, dep: 2200, yld: 180 },
  '4': { name: 'ETH Stack', ill: 'crypto', target: 13000, current: 5460, allocs: [{ vault: 'yoETH', weight: 6000, apy: 13.2 }, { vault: 'yoUSD', weight: 4000, apy: 18.4 }], bApy: 15.3, risk: 2, color: COLORS.info, days: 447, dep: 4800, yld: 660 },
};

const POOLS = [
  { n: 'Morpho USDC/WETH', ch: 'Base', pct: 35, r: 'Low' },
  { n: 'Aave V3 USDC', ch: 'Ethereum', pct: 28, r: 'Low' },
  { n: 'Pendle PT-sUSDe', ch: 'Arbitrum', pct: 22, r: 'Moderate' },
  { n: 'Idle (Reserve)', ch: 'Base', pct: 15, r: 'Idle' },
];

const riskBg: Record<string, { bg: string; c: string }> = {
  Low: { bg: '#DCFCE7', c: '#22C55E' },
  Moderate: { bg: '#FEF3C7', c: '#F59E0B' },
  Idle: { bg: '#F5F5F5', c: '#888' },
};

// Deposit modal (inline)
function DepositModal({ goal: g, onClose }: { goal: any; onClose: () => void }) {
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [amt, setAmt] = useState('');

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={() => { onClose(); setStep('input'); setAmt(''); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ background: COLORS.black, borderRadius: '24px 24px 0 0', padding: 24, paddingBottom: 48, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 24px' }} />
        {step === 'input' && <>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: g.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><GoalIllustration type={g.ill} size={28} color={COLORS.black} /></div>
            <div style={{ fontWeight: 900, fontSize: 18, color: COLORS.white, textTransform: 'uppercase' }}>ADD TO {g.name}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{g.allocs.length} vaults · {g.bApy}% blended APY</div>
          </div>
          <div style={{ background: '#1A1A1A', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16, border: `1px solid ${amt ? COLORS.orange : '#333'}` }}>
            <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Amount</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: '#FFF', opacity: amt ? 1 : 0.3 }}>$</span>
              <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0" autoFocus style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 42, fontWeight: 900, color: '#FFF', width: 160, textAlign: 'center', fontFamily: 'inherit' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['25', '50', '100', '250'].map(a => (
              <button key={a} onClick={() => setAmt(a)} style={{ flex: 1, background: amt === a ? COLORS.orange : '#222', border: `1px solid ${amt === a ? COLORS.orange : '#444'}`, borderRadius: 100, padding: '10px 0', color: amt === a ? COLORS.black : '#FFF', fontWeight: 600, fontSize: 13, fontFamily: 'inherit' }}>${a}</button>
            ))}
          </div>
          {amt && <div style={{ background: '#1A1A1A', borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Strategy Split</div>
            {g.allocs.map((a: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderTop: i ? '1px solid #333' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <VaultBadge vault={a.vault} size={22} />
                  <span style={{ fontSize: 12, color: '#FFF', fontWeight: 600 }}>{a.vault}</span>
                  <span style={{ fontSize: 10, color: '#888' }}>{a.weight / 100}%</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#FFF' }}>${(parseFloat(amt) * a.weight / 10000).toFixed(2)}</span>
              </div>
            ))}
          </div>}
          <button onClick={() => amt && setStep('confirm')} style={{ width: '100%', background: amt ? COLORS.orange : '#333', border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '16px 0', fontWeight: 700, fontSize: 16, color: amt ? COLORS.black : '#888', fontFamily: 'inherit', boxShadow: amt ? '2px 2px 0 #080808' : 'none' }}>{amt ? `Deposit $${amt}` : 'Enter Amount'}</button>
        </>}
        {step === 'confirm' && <>
          <div style={{ textAlign: 'center', marginBottom: 16 }}><div style={{ fontWeight: 900, fontSize: 18, color: '#FFF' }}>CONFIRM DEPOSIT</div></div>
          <div style={{ background: '#1A1A1A', borderRadius: 14, padding: 16, marginBottom: 12 }}>
            {[{ l: 'Total', v: `$${amt}` }, { l: 'Strategy', v: `${RISKS[g.risk]} · ${g.allocs.length} vaults` }, { l: 'Gas', v: '< $0.03' }, { l: 'APY', v: `${g.bApy}%` }].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid #333' : 'none' }}><span style={{ fontSize: 12, color: '#888' }}>{r.l}</span><span style={{ fontSize: 12, fontWeight: 700, color: '#FFF' }}>{r.v}</span></div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setStep('input')} style={{ flex: 1, background: 'transparent', border: '2px solid #444', borderRadius: 100, padding: '14px 0', color: '#888', fontWeight: 600, fontFamily: 'inherit' }}>Back</button>
            <button onClick={() => setStep('success')} style={{ flex: 2, background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '14px 0', fontWeight: 700, color: COLORS.black, fontFamily: 'inherit', boxShadow: '2px 2px 0 #080808' }}>Confirm</button>
          </div>
        </>}
        {step === 'success' && <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: COLORS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Check size={36} color="#FFF" strokeWidth={3} /></div>
          <div style={{ fontWeight: 900, fontSize: 22, color: '#FFF' }}>DEPOSITED</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>${amt} across {g.allocs.length} vaults at {g.bApy}% APY</div>
          <button onClick={() => { onClose(); setStep('input'); setAmt(''); }} style={{ background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '14px 32px', fontWeight: 700, color: COLORS.black, fontFamily: 'inherit', marginTop: 20 }}>Done</button>
        </div>}
      </div>
    </div>
  );
}

function WithdrawModal({ goal: g, onClose }: { goal: any; onClose: () => void }) {
  const [done, setDone] = useState(false);
  const fee = (g.yld * 0.1).toFixed(2);
  const gets = (g.current - parseFloat(fee)).toFixed(2);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={() => { onClose(); setDone(false); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ background: COLORS.black, borderRadius: '24px 24px 0 0', padding: 24, paddingBottom: 48, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div style={{ width: 40, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 24px' }} />
        {!done ? <>
          <div style={{ textAlign: 'center', marginBottom: 20 }}><div style={{ fontWeight: 900, fontSize: 18, color: '#FFF', textTransform: 'uppercase' }}>WITHDRAW FROM {g.name}</div></div>
          <div style={{ background: '#1A1A1A', borderRadius: 14, padding: 16, marginBottom: 12 }}>
            {[{ l: 'Total Value', v: `$${g.current.toLocaleString()}`, b: true }, { l: 'Deposits', v: `$${g.dep.toLocaleString()}` }, { l: 'Yield', v: `$${g.yld}`, c: COLORS.success }, { l: 'Fee (10%)', v: `-$${fee}`, c: COLORS.lavender }, { l: 'You Receive', v: `$${gets}`, b: true, c: '#CCFF00' }].map((r: any, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid #333' : 'none' }}>
                <span style={{ fontSize: 12, color: '#888', fontWeight: r.b ? 700 : 400 }}>{r.l}</span><span style={{ fontSize: r.b ? 14 : 12, fontWeight: r.b ? 900 : 700, color: r.c || '#FFF' }}>{r.v}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setDone(true)} style={{ width: '100%', background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '16px 0', fontWeight: 700, fontSize: 16, color: COLORS.black, fontFamily: 'inherit', boxShadow: '2px 2px 0 #080808' }}>Confirm Withdrawal</button>
        </> : <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: COLORS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Check size={36} color="#FFF" strokeWidth={3} /></div>
          <div style={{ fontWeight: 900, fontSize: 22, color: '#FFF' }}>WITHDRAWN</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#CCFF00', marginTop: 8 }}>${gets}</div>
          <button onClick={() => { onClose(); setDone(false); }} style={{ background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '14px 32px', fontWeight: 700, color: COLORS.black, fontFamily: 'inherit', marginTop: 20 }}>Done</button>
        </div>}
      </div>
    </div>
  );
}

export default function GoalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const g = GOALS[params.id as string];
  const [showDep, setShowDep] = useState(false);
  const [showWith, setShowWith] = useState(false);

  if (!g) return <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>Goal not found</div>;

  const pct = (g.current / g.target) * 100;
  const proj = Math.round(g.current * (1 + g.bApy / 100));
  const fee = (g.yld * 0.1).toFixed(2);

  return (<>
    {/* Header */}
    <div style={{ background: g.color, padding: '20px 24px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={() => router.push('/')} style={{ width: 36, height: 36, borderRadius: 18, border: `2px solid ${COLORS.black}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.2)' }}>
          <ArrowLeft size={18} color={COLORS.black} strokeWidth={2.5} />
        </button>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 100, border: `1px solid ${COLORS.black}`, padding: '5px 10px', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sliders size={10} />{RISKS[g.risk]} · {g.bApy}% APY
        </div>
      </div>
      <div style={{ marginBottom: 8 }}><GoalIllustration type={g.ill} size={40} color={COLORS.black} /></div>
      <div style={{ fontWeight: 900, fontSize: 28, color: COLORS.black, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1 }}>{g.name}</div>
    </div>

    {/* Content */}
    <div style={{ background: COLORS.background, borderRadius: '24px 24px 0 0', marginTop: -12, position: 'relative', zIndex: 1, padding: '24px 16px 100px' }}>
      {/* Progress */}
      <div style={{ background: COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 16, padding: 24, marginBottom: 12, textAlign: 'center', boxShadow: '3px 3px 0 #080808' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <ProgressRing progress={pct} size={130} strokeWidth={10} color={g.color} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 26, color: COLORS.black, lineHeight: 1 }}>{Math.round(pct)}%</div>
              <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>complete</div>
            </div>
          </div>
        </div>
        <div style={{ fontWeight: 900, fontSize: 30, color: COLORS.black }}>${g.current.toLocaleString()}</div>
        <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>of ${g.target.toLocaleString()} goal</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <button onClick={() => setShowDep(true)} style={{ background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '12px 20px', fontWeight: 700, fontSize: 14, color: COLORS.black, fontFamily: 'inherit', boxShadow: '2px 2px 0 #080808', display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={16} strokeWidth={3} />Add Funds</button>
          <button onClick={() => setShowWith(true)} style={{ background: COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '12px 20px', fontWeight: 700, fontSize: 14, color: COLORS.black, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}><ArrowUpRight size={16} />Withdraw</button>
        </div>
      </div>

      {/* Strategy */}
      <SectionLabel icon={Sliders}>Your Strategy</SectionLabel>
      <div style={{ background: COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '2px 2px 0 #080808' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.black, textTransform: 'uppercase', letterSpacing: 0.5 }}>{RISKS[g.risk]}</span>
          <div style={{ background: '#CCFF00', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 900, color: COLORS.black }}>{g.bApy}% blended</div>
        </div>
        {g.allocs.map((a: any, i: number) => (
          <AllocBar key={i} vault={a.vault} weight={a.weight} apy={a.apy} />
        ))}
        <button style={{ width: '100%', background: COLORS.lightGray, border: `1px solid ${COLORS.gray}`, borderRadius: 100, padding: '10px 0', fontWeight: 600, fontSize: 12, color: '#666', fontFamily: 'inherit', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <RefreshCw size={12} />Reoptimize Strategy
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        {[
          { l: 'YIELD EARNED', v: `$${g.yld}`, bg: '#F0FDF4', ic: COLORS.success, I: TrendingUp },
          { l: 'PROJECTED 1YR', v: `$${proj.toLocaleString()}`, bg: '#EFF6FF', ic: COLORS.info, I: Sparkles },
          { l: 'DAYS LEFT', v: `${g.days}`, bg: '#FEFCE8', ic: COLORS.warning, I: Clock },
          { l: 'OPT. FEE (10%)', v: `$${fee}`, bg: '#F5F3FF', ic: COLORS.lavender, I: Percent },
        ].map((s, i) => (
          <div key={i} style={{ background: COLORS.white, border: `1px solid ${COLORS.black}`, borderRadius: 14, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, background: s.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.I size={14} color={s.ic} /></div>
              <span style={{ fontSize: 8, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>{s.l}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.black }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Underlying Pools */}
      <SectionLabel icon={Eye}>Underlying Pools</SectionLabel>
      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.black}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        {POOLS.map((p, i) => {
          const rb = riskBg[p.r] || riskBg.Idle;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: i > 0 ? `1px solid ${COLORS.lightGray}` : 'none' }}>
              <div><div style={{ fontSize: 12, fontWeight: 600, color: COLORS.black }}>{p.n}</div><div style={{ fontSize: 10, color: '#888' }}>{p.ch}</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: rb.bg, color: rb.c }}>{p.r}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.black }}>{p.pct}%</span>
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 12, padding: '10px 12px', background: COLORS.lightGray, borderRadius: 10, fontSize: 10, color: '#666', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Lock size={12} color="#888" /><span>yoTokens held by <strong>YoGoals contract</strong> on your behalf · Withdrawable anytime</span>
        </div>
      </div>

      {/* Fee info */}
      <div style={{ padding: '12px 14px', background: COLORS.white, border: `1px solid ${COLORS.gray}`, borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ width: 28, height: 28, background: '#F5F3FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Percent size={13} color={COLORS.lavender} /></div>
        <div style={{ fontSize: 11, color: '#666', lineHeight: 1.5 }}>
          <strong style={{ color: COLORS.black }}>10% optimization fee on yield only.</strong> Your principal is never touched. Fees fund the AI strategy engine so the app stays free for you.
        </div>
      </div>
    </div>

    {showDep && <DepositModal goal={g} onClose={() => setShowDep(false)} />}
    {showWith && <WithdrawModal goal={g} onClose={() => setShowWith(false)} />}
    <BottomNav />
  </>);
}
