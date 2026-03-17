'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import {
  Target, TrendingUp, Layers, Clock, ChevronRight, Plus, RefreshCw,
  ArrowUpRight, Sparkles, Mail, Brain, Shield, LogOut, Check,
  Percent, BarChart3,
} from 'lucide-react';
import {
  YoGoalsLogo, GoalIllustration, ProgressRing, StrategyBar,
  SectionLabel, Card, VaultBadge, AllocBar,
} from '@/components';
import { COLORS } from '@/constants/theme';
import { YO_VAULTS } from '@/constants/contracts';
import { useWeb3 } from '@/hooks/useWeb3';
import BottomNav from '@/components/BottomNav';

const DEMO_GOALS = [
  { id: '1', name: 'Japan Trip', ill: 'travel' as const, target: 3000, current: 1847,
    allocs: [{ vault: 'yoETH', weight: 7000, apy: 13.2 }, { vault: 'yoBTC', weight: 2000, apy: 1.4 }, { vault: 'yoGOLD', weight: 1000, apy: 11.1 }],
    bApy: 10.8, risk: 1, color: COLORS.orange, days: 365, dep: 1700, yld: 147 },
  { id: '2', name: 'Emergency Fund', ill: 'emergency' as const, target: 10000, current: 6230,
    allocs: [{ vault: 'yoETH', weight: 9000, apy: 13.2 }, { vault: 'yoGOLD', weight: 1000, apy: 11.1 }],
    bApy: 13.0, risk: 0, color: COLORS.lavender, days: 295, dep: 5800, yld: 430 },
  { id: '3', name: 'New MacBook', ill: 'tech' as const, target: 2500, current: 2380,
    allocs: [{ vault: 'yoETH', weight: 10000, apy: 13.2 }],
    bApy: 13.2, risk: 0, color: COLORS.success, days: 82, dep: 2200, yld: 180 },
  { id: '4', name: 'ETH Stack', ill: 'crypto' as const, target: 13000, current: 5460,
    allocs: [{ vault: 'yoETH', weight: 6000, apy: 13.2 }, { vault: 'yoBTC', weight: 4000, apy: 1.4 }],
    bApy: 8.5, risk: 2, color: COLORS.info, days: 447, dep: 4800, yld: 660 },
];

const ACTIVITY = [
  { action: 'Deposited 0.5 ETH', goal: 'Japan Trip', time: '2h ago', type: 'deposit' },
  { action: 'Rebalanced strategy', goal: 'ETH Stack', time: '1d ago', type: 'rebalance' },
  { action: 'Yield +$12.40', goal: 'New MacBook', time: '5d ago', type: 'yield' },
];

const RISKS = ['Conservative', 'Balanced', 'Growth'];
const GOAL_TYPES = ['travel', 'emergency', 'tech', 'crypto'] as const;

const STRATEGY_PRESETS: Record<number, { vault: string; weight: number }[]> = {
  0: [{ vault: 'yoETH', weight: 10000 }],
  1: [{ vault: 'yoETH', weight: 7000 }, { vault: 'yoBTC', weight: 3000 }],
  2: [{ vault: 'yoETH', weight: 5000 }, { vault: 'yoBTC', weight: 5000 }],
};

// ─── CREATE GOAL MODAL (WIRED TO CONTRACT) ─────────────────
function CreateGoalModal({ onClose }: { onClose: () => void }) {
  const { createGoal, txStatus, txHash, txError, resetTx, isConnected } = useWeb3();
  const [selCat, setSelCat] = useState<string>('travel');
  const [selRisk, setSelRisk] = useState<number>(1);
  const [goalName, setGoalName] = useState('');
  const [targetAmt, setTargetAmt] = useState('');
  const [deadline, setDeadline] = useState('');

  const isLoading = txStatus === 'creating';
  const isDone = txStatus === 'success';
  const isError = txStatus === 'error';

  const strategy = STRATEGY_PRESETS[selRisk] || STRATEGY_PRESETS[1];
  const blendedApy = strategy.reduce((s, a) => {
    const v = YO_VAULTS[a.vault];
    return s + ((v?.apy || 0) * a.weight) / 10000;
  }, 0).toFixed(1);

  const handleCreate = async () => {
    if (!goalName || !targetAmt || !deadline || !isConnected) return;
    try {
      await createGoal({
        name: goalName,
        targetAmount: targetAmt,
        deadline,
        riskLevel: selRisk,
        asset: 'WETH',
        vaults: strategy.map(s => s.vault),
        weights: strategy.map(s => s.weight),
      });
    } catch (e) { console.error('Create goal failed:', e); }
  };

  const handleClose = () => { resetTx(); onClose(); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={handleClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ background: COLORS.white, borderRadius: '24px 24px 0 0', padding: 24, paddingBottom: 48, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, background: COLORS.gray, borderRadius: 2, margin: '0 auto 24px' }} />

        {/* SUCCESS */}
        {isDone && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: COLORS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Check size={36} color="#FFF" strokeWidth={3} /></div>
            <div style={{ fontWeight: 900, fontSize: 22, color: COLORS.black }}>GOAL CREATED</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>{goalName} — {RISKS[selRisk]} strategy</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{strategy.length} vaults · {blendedApy}% blended APY</div>
            {txHash && (
              <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: COLORS.lavender, marginTop: 12, textDecoration: 'none' }}>
                View on BaseScan <ArrowUpRight size={10} />
              </a>
            )}
            <br /><button onClick={handleClose} style={{ background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '14px 32px', fontWeight: 700, fontSize: 14, color: COLORS.black, fontFamily: 'inherit', boxShadow: '3px 3px 0 #080808', marginTop: 20, cursor: 'pointer' }}>Done</button>
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: 56, height: 56, border: `3px solid ${COLORS.gray}`, borderTopColor: COLORS.orange, borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.black }}>Creating goal on-chain...</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Confirm in your wallet</div>
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Target size={36} color="#FFF" /></div>
            <div style={{ fontWeight: 900, fontSize: 18, color: COLORS.black }}>FAILED</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>{txError}</div>
            <button onClick={() => resetTx()} style={{ background: COLORS.gray, border: `1px solid ${COLORS.black}`, borderRadius: 100, padding: '12px 24px', fontWeight: 600, color: COLORS.black, fontFamily: 'inherit', marginTop: 20, cursor: 'pointer' }}>Try Again</button>
          </div>
        )}

        {/* FORM */}
        {!isLoading && !isDone && !isError && (<>
          <div style={{ fontWeight: 900, fontSize: 22, color: COLORS.black, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>NEW GOAL</div>

          {!isConnected && <div style={{ background: '#FEF2F2', border: '1px solid #EF4444', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 11, color: '#EF4444', fontWeight: 600 }}>Wallet not connected — connect via Privy to create on-chain goals</div>}

          <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Category</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {GOAL_TYPES.map(t => (
              <div key={t} onClick={() => setSelCat(t)} style={{
                flex: 1, height: 56, borderRadius: 14, border: `2px solid ${COLORS.black}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                background: selCat === t ? COLORS.orange : COLORS.white,
                boxShadow: selCat === t ? '2px 2px 0 #080808' : 'none', transition: 'all 0.15s',
              }}>
                <GoalIllustration type={t} size={24} color={COLORS.black} />
              </div>
            ))}
          </div>

          <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Goal Name</div>
          <input value={goalName} onChange={e => setGoalName(e.target.value)} placeholder="e.g. Japan Trip 2027" style={{ width: '100%', padding: '14px 16px', border: `2px solid ${COLORS.black}`, borderRadius: 12, fontSize: 15, fontWeight: 600, marginBottom: 16, fontFamily: 'inherit', boxSizing: 'border-box' }} />

          <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Target Amount (ETH)</div>
          <input value={targetAmt} onChange={e => setTargetAmt(e.target.value)} placeholder="0.0" type="number" step="0.001" style={{ width: '100%', padding: '14px 16px', border: `2px solid ${COLORS.black}`, borderRadius: 12, fontSize: 15, fontWeight: 600, marginBottom: 16, fontFamily: 'inherit', boxSizing: 'border-box' }} />

          <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Deadline</div>
          <input value={deadline} onChange={e => setDeadline(e.target.value)} type="date" style={{ width: '100%', padding: '14px 16px', border: `2px solid ${COLORS.black}`, borderRadius: 12, fontSize: 15, fontWeight: 600, marginBottom: 16, fontFamily: 'inherit', color: COLORS.black, boxSizing: 'border-box' }} />

          <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Risk Tolerance</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {RISKS.map((r, i) => (
              <button key={r} onClick={() => setSelRisk(i)} style={{
                flex: 1, padding: '12px 8px', border: `2px solid ${COLORS.black}`, borderRadius: 12,
                fontWeight: 700, fontSize: 12, color: selRisk === i ? COLORS.white : COLORS.black,
                background: selRisk === i ? COLORS.black : COLORS.white, fontFamily: 'inherit',
                boxShadow: selRisk === i ? `2px 2px 0 ${COLORS.orange}` : 'none', textAlign: 'center',
                transition: 'all 0.15s', cursor: 'pointer',
              }}>
                {r}
              </button>
            ))}
          </div>

          {/* Strategy preview */}
          <div style={{ background: COLORS.lightGray, borderRadius: 12, padding: '12px 14px', marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>AI STRATEGY PREVIEW · {blendedApy}% BLENDED APY</div>
            {strategy.map((s, i) => {
              const v = YO_VAULTS[s.vault];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <VaultBadge vault={s.vault} size={18} />
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{s.vault}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: '#888' }}>{s.weight / 100}%</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.success }}>{v?.apy || 0}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: COLORS.lightGray, borderRadius: 12, padding: '10px 14px', marginBottom: 20, fontSize: 11, color: '#666', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={14} color={COLORS.lavender} style={{ flexShrink: 0 }} />
            Creates goal on-chain. You can deposit funds after creation.
          </div>

          <button onClick={handleCreate} disabled={!goalName || !targetAmt || !deadline || !isConnected} style={{
            width: '100%', background: (goalName && targetAmt && deadline && isConnected) ? COLORS.orange : COLORS.gray,
            border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '16px 0', fontWeight: 700, fontSize: 16,
            color: (goalName && targetAmt && deadline && isConnected) ? COLORS.black : '#888',
            fontFamily: 'inherit', boxShadow: (goalName && targetAmt && deadline && isConnected) ? '3px 3px 0 #080808' : 'none',
            cursor: (goalName && targetAmt && deadline && isConnected) ? 'pointer' : 'not-allowed',
          }}>
            {!isConnected ? 'Connect Wallet First' : 'Create Goal On-Chain'}
          </button>
        </>)}
      </div>
    </div>
  );
}

// ─── LANDING PAGE ────────────────────────────────────────────
function Landing({ onLogin }: { onLogin: () => void }) {
  return (<>
    <div style={{ background: COLORS.orange, padding: '20px 24px 40px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, position: 'relative' }}>
        <YoGoalsLogo size="lg" variant="full" background="orange" />
      </div>
      <div style={{ fontWeight: 900, fontSize: 34, color: COLORS.black, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1 }}>THE SMARTEST<br />SAVINGS IN<br />DEFI</div>
      <div style={{ fontSize: 14, color: COLORS.black, opacity: 0.7, marginTop: 8, lineHeight: 1.5 }}>Set a goal. AI builds your strategy.<br />Earn up to 13.2% APY on Base.</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        {[{ v: '13.2%', l: 'yoETH APY' }, { v: '$27M+', l: 'TVL' }, { v: '3', l: 'Vaults' }].map((s, i) => (
          <div key={i} style={{ background: COLORS.white, border: `1.5px solid ${COLORS.black}`, borderRadius: 100, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600 }}>
            <span style={{ fontWeight: 900, color: COLORS.success }}>{s.v}</span>{s.l}
          </div>
        ))}
      </div>
    </div>

    <div style={{ background: COLORS.background, borderRadius: '24px 24px 0 0', marginTop: -12, position: 'relative', zIndex: 1, padding: '24px 16px 32px' }}>
      <SectionLabel icon={Check}>How It Works</SectionLabel>
      {[{ n: '1', t: 'Create a Goal', d: 'Name it, set a target amount, pick a deadline.' },
        { n: '2', t: 'AI Builds Your Strategy', d: 'Multi-vault split across yoETH, yoBTC, yoGOLD based on your risk tolerance.' },
        { n: '3', t: 'Deposit & Earn', d: 'One tap deposits on Base (< $0.01 gas). YO Protocol auto-compounds yield.' },
        { n: '4', t: 'Withdraw Anytime', d: '90% of yield is yours. 10% fee on profit only — principal never touched.' },
      ].map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.orange, border: `2px solid ${COLORS.black}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: COLORS.black, flexShrink: 0, boxShadow: '2px 2px 0 #080808' }}>{s.n}</div>
          <div><div style={{ fontWeight: 800, fontSize: 14, color: COLORS.black, marginBottom: 2 }}>{s.t}</div><div style={{ fontSize: 12, color: '#666', lineHeight: 1.4 }}>{s.d}</div></div>
        </div>
      ))}

      <SectionLabel icon={BarChart3}>Powered by YO Protocol</SectionLabel>
      <div style={{ background: COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 16, padding: 14, marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[{ apy: '13.2%', v: 'yoETH', c: '#938EF2', bg: '#F5F3FF' }, { apy: '1.4%', v: 'yoBTC', c: '#F59E0B', bg: '#FEFCE8' }, { apy: '11.1%', v: 'yoGOLD', c: '#6C9700', bg: '#F0FDF4' }].map((v, i) => (
            <div key={i} style={{ flex: 1, background: v.bg, borderRadius: 10, padding: 10, textAlign: 'center', border: `1px solid ${v.c}` }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: v.c }}>{v.apy}</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: '#888', marginTop: 2 }}>{v.v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: '#888', textAlign: 'center', lineHeight: 1.4 }}>ERC-4626 vaults on Base · Risk rated by Exponential.fi</div>
      </div>

      <SectionLabel icon={Shield}>Why YO Goals</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {[{ t: 'Your Keys', d: 'Non-custodial. yoTokens stay in your wallet.', I: Shield, bg: '#F0FDF4', ic: COLORS.success },
          { t: 'AI Optimized', d: 'Multi-vault strategies for your timeline.', I: Brain, bg: '#EFF6FF', ic: COLORS.info },
          { t: 'Fair Fees', d: '10% on yield only. Principal never touched.', I: Percent, bg: '#FFF7ED', ic: COLORS.orange },
          { t: 'No Wallet Needed', d: 'Sign in with email or Google via Privy.', I: Mail, bg: '#F5F3FF', ic: COLORS.lavender },
        ].map((c, i) => (
          <div key={i} style={{ background: COLORS.white, border: `1.5px solid ${COLORS.black}`, borderRadius: 12, padding: 12 }}>
            <div style={{ width: 28, height: 28, background: c.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}><c.I size={14} color={c.ic} /></div>
            <div style={{ fontWeight: 700, fontSize: 12, color: COLORS.black, marginBottom: 2 }}>{c.t}</div>
            <div style={{ fontSize: 10, color: '#888', lineHeight: 1.3 }}>{c.d}</div>
          </div>
        ))}
      </div>

      <button onClick={onLogin} style={{ width: '100%', background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: 16, fontWeight: 700, fontSize: 16, color: COLORS.black, fontFamily: 'inherit', boxShadow: '3px 3px 0 #080808', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
        <ArrowUpRight size={18} />Start Saving Now
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12, fontSize: 10, color: '#888' }}>
        <span>Email</span><span>Google</span><span>MetaMask</span>
      </div>
      <div style={{ textAlign: 'center', fontSize: 9, color: '#AAA', marginTop: 16, lineHeight: 1.4 }}>
        Powered by YO Protocol · Built on Base · Contract verified on BaseScan
      </div>
    </div>
  </>);
}

// ─── DASHBOARD ───────────────────────────────────────────────
function Dashboard() {
  const { logout } = usePrivy();
  const { address: walletAddr } = useAccount();
  const router = useRouter();
  const { syncUser } = useWeb3();
  const [showCreate, setShowCreate] = useState(false);

  // Sync user to Supabase on mount
  useEffect(() => { syncUser(); }, [syncUser]);

  const shortAddr = walletAddr ? `${walletAddr.slice(0, 4)}...${walletAddr.slice(-4)}` : '0x...';
  const totSaved = DEMO_GOALS.reduce((s, g) => s + g.current, 0);
  const totYield = DEMO_GOALS.reduce((s, g) => s + g.current * g.bApy / 100, 0);

  return (<>
    <div style={{ background: COLORS.orange, padding: '20px 24px 32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, position: 'relative' }}>
        <YoGoalsLogo size="lg" variant="full" background="orange" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: COLORS.success, borderRadius: 100, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: COLORS.white }} />
            <span style={{ fontSize: 9, fontWeight: 600, color: COLORS.white, textTransform: 'uppercase' }}>{shortAddr}</span>
          </div>
          <button onClick={() => logout()} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,0,0,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><LogOut size={12} color={COLORS.black} /></button>
        </div>
      </div>
      <div style={{ fontWeight: 900, fontSize: 32, color: COLORS.black, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1 }}>SAVINGS HQ</div>
      <div style={{ fontSize: 12, color: COLORS.black, opacity: 0.65, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Layers size={12} />AI-optimized multi-vault strategies</div>
    </div>

    <div style={{ background: COLORS.background, borderRadius: '24px 24px 0 0', marginTop: -12, position: 'relative', zIndex: 1, padding: '20px 16px 100px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[{ v: `$${totSaved.toLocaleString()}`, l: 'TOTAL SAVED', a: true }, { v: `$${Math.round(totYield).toLocaleString()}/yr`, l: 'EARNING' }, { v: `${DEMO_GOALS.length}`, l: 'STRATEGIES' }].map((m, i) => (
          <div key={i} style={{ background: m.a ? '#CCFF00' : COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 14, padding: '14px 10px', textAlign: 'center', boxShadow: m.a ? '2px 2px 0 #080808' : 'none' }}>
            <div style={{ fontWeight: 900, fontSize: m.a ? 19 : 17, color: COLORS.black, lineHeight: 1.1 }}>{m.v}</div>
            <div style={{ fontSize: 8, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{m.l}</div>
          </div>
        ))}
      </div>

      <SectionLabel icon={Target}>Your Goals</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DEMO_GOALS.map(g => {
          const pct = (g.current / g.target) * 100;
          return (
            <div key={g.id} onClick={() => router.push(`/goal/${g.id}`)}
              style={{ background: COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 16, padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <ProgressRing progress={pct} size={64} strokeWidth={5} color={g.color} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}><GoalIllustration type={g.ill} size={24} color={g.color} /></div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.black }}>{g.name}</div>
                  <div style={{ background: g.color, borderRadius: 100, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: COLORS.black }}>{Math.round(pct)}%</div>
                </div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>${g.current.toLocaleString()} <span style={{ color: '#888' }}>of</span> ${g.target.toLocaleString()}</div>
                <StrategyBar allocations={g.allocs.map(a => ({ vault: a.vault, weight: a.weight }))} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <div style={{ fontSize: 10, color: '#888' }}><span style={{ fontWeight: 700, color: COLORS.success }}>{g.bApy}%</span> · {g.allocs.length} vault{g.allocs.length > 1 ? 's' : ''}</div>
                  <div style={{ fontSize: 10, color: '#888', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={9} />{g.days}d</div>
                </div>
              </div>
              <ChevronRight size={16} color="#CCC" style={{ flexShrink: 0 }} />
            </div>
          );
        })}
      </div>

      <Card variant="outlined" onClick={() => setShowCreate(true)} style={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center', padding: '20px 16px', cursor: 'pointer' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, border: `2px solid ${COLORS.black}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={20} strokeWidth={2.5} /></div>
        <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.black }}>Create New Goal</div>
        <div style={{ fontSize: 11, color: '#888' }}>AI builds your strategy automatically</div>
      </Card>

      <Card variant="dark" onClick={() => router.push('/advisor')} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '3px 3px 0 #7570D1', cursor: 'pointer' }}>
        <div style={{ width: 44, height: 44, background: COLORS.lavender, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Brain size={22} color={COLORS.white} /></div>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 14, color: COLORS.white }}>AI SAVINGS ADVISOR</div><div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Free for you · Powered by x402 under the hood</div></div>
        <Sparkles size={16} color="#CCFF00" />
      </Card>

      <SectionLabel icon={RefreshCw}>Recent Activity</SectionLabel>
      {ACTIVITY.map((a, i) => (
        <div key={i} style={{ background: COLORS.white, border: `1px solid ${COLORS.black}`, borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: a.type === 'yield' ? '#F0FDF4' : a.type === 'deposit' ? '#FFF7ED' : '#F5F3FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {a.type === 'yield' ? <TrendingUp size={16} color={COLORS.success} /> : a.type === 'deposit' ? <ArrowUpRight size={16} color={COLORS.orange} /> : <RefreshCw size={16} color={COLORS.lavender} />}
          </div>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>{a.action}</div><div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{a.goal} · {a.time}</div></div>
        </div>
      ))}
    </div>

    {showCreate && <CreateGoalModal onClose={() => setShowCreate(false)} />}
    <BottomNav />
  </>);
}

// ─── MAIN EXPORT ─────────────────────────────────────────────
export default function HomePage() {
  const { login, authenticated, ready } = usePrivy();

  if (!ready) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background }}>
      <div style={{ width: 48, height: 48, border: `3px solid ${COLORS.gray}`, borderTopColor: COLORS.orange, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!authenticated) return <Landing onLogin={login} />;
  return <Dashboard />;
}
