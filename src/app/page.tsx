'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import {
  Home, BarChart3, Brain, Settings, Target, TrendingUp,
  Layers, Clock, ChevronRight, Plus, RefreshCw, ArrowUpRight,
  PiggyBank, Sparkles, Mail, Wallet, Shield, LogOut, Check,
  Percent, Send, AlertTriangle,
} from 'lucide-react';
import {
  YoGoalsLogo, GoalIllustration, ProgressRing, StrategyBar,
  SectionLabel, Card, VaultBadge, AllocBar, Button,
} from '@/components';
import { COLORS } from '@/constants/theme';
import { useGoalStore } from '@/lib/store';
import BottomNav from '@/components/BottomNav';

// Demo data — replace with live vault data
const DEMO_GOALS = [
  { id: '1', name: 'Japan Trip', ill: 'travel' as const, target: 3000, current: 1847,
    allocs: [{ vault: 'yoUSD' as const, weight: 7000, apy: 18.4 }, { vault: 'yoETH' as const, weight: 2000, apy: 13.2 }],
    bApy: 16.8, risk: 1, color: COLORS.orange, days: 365, dep: 1700, yld: 147 },
  { id: '2', name: 'Emergency Fund', ill: 'emergency' as const, target: 10000, current: 6230,
    allocs: [{ vault: 'yoUSD' as const, weight: 9000, apy: 18.4 }],
    bApy: 17.7, risk: 0, color: COLORS.lavender, days: 295, dep: 5800, yld: 430 },
  { id: '3', name: 'New MacBook', ill: 'tech' as const, target: 2500, current: 2380,
    allocs: [{ vault: 'yoUSD' as const, weight: 10000, apy: 18.4 }],
    bApy: 18.4, risk: 0, color: COLORS.success, days: 82, dep: 2200, yld: 180 },
  { id: '4', name: 'ETH Stack', ill: 'crypto' as const, target: 13000, current: 5460,
    allocs: [{ vault: 'yoETH' as const, weight: 6000, apy: 13.2 }, { vault: 'yoUSD' as const, weight: 4000, apy: 18.4 }],
    bApy: 15.3, risk: 2, color: COLORS.info, days: 447, dep: 4800, yld: 660 },
];

const ACTIVITY = [
  { action: 'Deposited $500', goal: 'Japan Trip', time: '2h ago', type: 'deposit' },
  { action: 'Rebalanced strategy', goal: 'ETH Stack', time: '1d ago', type: 'rebalance' },
  { action: 'Yield +$12.40', goal: 'New MacBook', time: '5d ago', type: 'yield' },
];

const RISKS = ['Conservative', 'Balanced', 'Growth'];

// ─── MODALS ──────────────────────────────────────────────────
function DepositModal({ goal, onClose }: { goal: typeof DEMO_GOALS[0] | null; onClose: () => void }) {
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [amt, setAmt] = useState('');
  if (!goal) return null;
  const g = goal;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={() => { onClose(); setStep('input'); setAmt(''); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ background: COLORS.black, borderRadius: '24px 24px 0 0', padding: 24, paddingBottom: 48, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 24px' }} />

        {step === 'input' && <>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: g.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <GoalIllustration type={g.ill} size={28} color={COLORS.black} />
            </div>
            <div style={{ fontWeight: 900, fontSize: 18, color: COLORS.white, textTransform: 'uppercase' }}>ADD TO {g.name}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{g.allocs.length} vault{g.allocs.length > 1 ? 's' : ''} · {g.bApy}% blended APY</div>
          </div>
          <div style={{ background: '#1A1A1A', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16, border: `1px solid ${amt ? COLORS.orange : '#333'}` }}>
            <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Amount (USDC)</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: COLORS.white, opacity: amt ? 1 : 0.3 }}>$</span>
              <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0" autoFocus
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 42, fontWeight: 900, color: COLORS.white, width: 160, textAlign: 'center', fontFamily: 'inherit' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['25', '50', '100', '250'].map(a => (
              <button key={a} onClick={() => setAmt(a)} style={{ flex: 1, background: amt === a ? COLORS.orange : '#222', border: `1px solid ${amt === a ? COLORS.orange : '#444'}`, borderRadius: 100, padding: '10px 0', color: amt === a ? COLORS.black : COLORS.white, fontWeight: 600, fontSize: 13, fontFamily: 'inherit' }}>${a}</button>
            ))}
          </div>
          {amt && <div style={{ background: '#1A1A1A', borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Strategy Split</div>
            {g.allocs.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderTop: i > 0 ? '1px solid #333' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <VaultBadge vault={a.vault} size={22} />
                  <span style={{ fontSize: 12, color: COLORS.white, fontWeight: 600 }}>{a.vault}</span>
                  <span style={{ fontSize: 10, color: '#888' }}>{a.weight / 100}%</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.white }}>${(parseFloat(amt) * a.weight / 10000).toFixed(2)}</span>
              </div>
            ))}
          </div>}
          <button onClick={() => amt && setStep('confirm')} style={{ width: '100%', background: amt ? COLORS.orange : '#333', border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '16px 0', fontWeight: 700, fontSize: 16, color: amt ? COLORS.black : '#888', cursor: amt ? 'pointer' : 'not-allowed', fontFamily: 'inherit', boxShadow: amt ? '2px 2px 0 #080808' : 'none' }}>
            {amt ? `Deposit $${amt}` : 'Enter Amount'}
          </button>
        </>}

        {step === 'confirm' && <>
          <div style={{ textAlign: 'center', marginBottom: 16 }}><div style={{ fontWeight: 900, fontSize: 18, color: COLORS.white, textTransform: 'uppercase' }}>CONFIRM DEPOSIT</div></div>
          <div style={{ background: '#1A1A1A', borderRadius: 14, padding: 16, marginBottom: 12 }}>
            {[{ l: 'Total', v: `$${amt} USDC` }, { l: 'Strategy', v: `${RISKS[g.risk]} · ${g.allocs.length} vault${g.allocs.length > 1 ? 's' : ''}` }, { l: 'Transactions', v: `${g.allocs.length} on Base` }, { l: 'Gas', v: '< $0.03' }, { l: 'Blended APY', v: `${g.bApy}%` }].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? '1px solid #333' : 'none' }}>
                <span style={{ fontSize: 12, color: '#888' }}>{r.l}</span><span style={{ fontSize: 12, fontWeight: 700, color: COLORS.white }}>{r.v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#111', borderRadius: 10, padding: 10, marginBottom: 16, fontSize: 10, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={12} color={COLORS.warning} />10% fee on yield only. Principal never touched.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setStep('input')} style={{ flex: 1, background: 'transparent', border: '2px solid #444', borderRadius: 100, padding: '14px 0', color: '#888', fontWeight: 600, fontSize: 14, fontFamily: 'inherit' }}>Back</button>
            <button onClick={() => setStep('success')} style={{ flex: 2, background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '14px 0', fontWeight: 700, fontSize: 14, color: COLORS.black, fontFamily: 'inherit', boxShadow: '2px 2px 0 #080808', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Send size={14} />Confirm
            </button>
          </div>
        </>}

        {step === 'success' && <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: COLORS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Check size={36} color={COLORS.white} strokeWidth={3} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 22, color: COLORS.white }}>DEPOSITED</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 8, lineHeight: 1.5 }}>${amt} split across {g.allocs.length} vault{g.allocs.length > 1 ? 's' : ''}<br />earning {g.bApy}% blended APY</div>
          <button onClick={() => { onClose(); setStep('input'); setAmt(''); }} style={{ background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '14px 32px', fontWeight: 700, fontSize: 14, color: COLORS.black, fontFamily: 'inherit', boxShadow: '2px 2px 0 #080808', marginTop: 20 }}>Done</button>
        </div>}
      </div>
    </div>
  );
}

function WithdrawModal({ goal, onClose }: { goal: typeof DEMO_GOALS[0] | null; onClose: () => void }) {
  const [done, setDone] = useState(false);
  if (!goal) return null;
  const g = goal;
  const fee = (g.yld * 0.1).toFixed(2);
  const gets = (g.current - parseFloat(fee)).toFixed(2);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={() => { onClose(); setDone(false); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ background: COLORS.black, borderRadius: '24px 24px 0 0', padding: 24, paddingBottom: 48, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div style={{ width: 40, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 24px' }} />
        {!done ? <>
          <div style={{ textAlign: 'center', marginBottom: 20 }}><div style={{ fontWeight: 900, fontSize: 18, color: COLORS.white, textTransform: 'uppercase' }}>WITHDRAW FROM {g.name}</div></div>
          <div style={{ background: '#1A1A1A', borderRadius: 14, padding: 16, marginBottom: 12 }}>
            {[{ l: 'Total Value', v: `$${g.current.toLocaleString()}`, bold: true }, { l: 'Your Deposits', v: `$${g.dep.toLocaleString()}` }, { l: 'Yield Earned', v: `$${g.yld}`, c: COLORS.success }, { l: 'Fee (10%)', v: `-$${fee}`, c: COLORS.lavender }, { l: 'You Receive', v: `$${gets}`, bold: true, c: '#CCFF00' }].map((r: any, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid #333' : 'none' }}>
                <span style={{ fontSize: 12, color: '#888', fontWeight: r.bold ? 700 : 400 }}>{r.l}</span>
                <span style={{ fontSize: r.bold ? 14 : 12, fontWeight: r.bold ? 900 : 700, color: r.c || COLORS.white }}>{r.v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#111', borderRadius: 10, padding: 10, marginBottom: 16, fontSize: 10, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={12} color={COLORS.success} />Principal fully returned. Fee only on profit.
          </div>
          <button onClick={() => setDone(true)} style={{ width: '100%', background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '16px 0', fontWeight: 700, fontSize: 16, color: COLORS.black, fontFamily: 'inherit', boxShadow: '2px 2px 0 #080808' }}>Confirm Withdrawal</button>
        </> : <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: COLORS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Check size={36} color={COLORS.white} strokeWidth={3} /></div>
          <div style={{ fontWeight: 900, fontSize: 22, color: COLORS.white }}>WITHDRAWN</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#CCFF00', marginTop: 8 }}>${gets}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>sent to your wallet</div>
          <button onClick={() => { onClose(); setDone(false); }} style={{ background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '14px 32px', fontWeight: 700, fontSize: 14, color: COLORS.black, fontFamily: 'inherit', marginTop: 20 }}>Done</button>
        </div>}
      </div>
    </div>
  );
}

function AdvisorModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'init' | 'load' | 'result'>('init');

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={() => { onClose(); setStep('init'); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ background: COLORS.black, borderRadius: '24px 24px 0 0', padding: 24, paddingBottom: 48, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div style={{ width: 40, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 24px' }} />

        {step === 'init' && <>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 72, height: 72, background: COLORS.lavender, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '3px 3px 0 #7570D1' }}><Brain size={32} color={COLORS.white} /></div>
            <div style={{ fontWeight: 900, fontSize: 18, color: COLORS.white, textTransform: 'uppercase' }}>AI ADVISOR</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Free for you · x402 costs paid by treasury</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {['"Optimize allocations"', '"Am I on track?"', '"Rebalance suggestions"'].map((q, i) => (
              <div key={i} style={{ background: '#222', border: '1px solid #444', borderRadius: 100, padding: '8px 14px', fontSize: 11, color: COLORS.white }}>{q}</div>
            ))}
          </div>
          <button onClick={() => { setStep('load'); setTimeout(() => setStep('result'), 2000); }} style={{ width: '100%', background: COLORS.lavender, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '16px 0', fontWeight: 700, fontSize: 14, color: COLORS.white, fontFamily: 'inherit', boxShadow: '2px 2px 0 #5550a0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Brain size={16} />Get Advice
          </button>
        </>}

        {step === 'load' && <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #333', borderTopColor: COLORS.lavender, borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ fontSize: 13, color: '#888' }}>Analyzing your portfolio...</div>
        </div>}

        {step === 'result' && <>
          <div style={{ background: '#1A1A1A', borderRadius: 14, padding: 16, border: `1px solid ${COLORS.lavender}`, marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: COLORS.white, lineHeight: 1.6 }}>Your Emergency Fund is 90% yoUSD. Shifting 15% to yoETH could boost blended APY from 17.7% to 18.5% — an extra $80 in yield over 10 months.</div>
          </div>
          <div style={{ background: '#1A1A1A', borderRadius: 14, padding: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#2a2a2a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={16} color={COLORS.lavender} /></div>
            <div><div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Action</div><div style={{ fontSize: 12, color: COLORS.white, fontWeight: 600, marginTop: 2 }}>Rebalance: 75% yoUSD + 15% yoETH + 10% yoEUR</div></div>
          </div>
          <div style={{ background: '#0a2010', borderRadius: 14, padding: 14, border: `1px solid ${COLORS.success}`, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#0d2a14', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={16} color={COLORS.success} /></div>
            <div><div style={{ fontSize: 10, color: COLORS.success, textTransform: 'uppercase', letterSpacing: 1 }}>Impact</div><div style={{ fontSize: 14, color: COLORS.success, fontWeight: 800, marginTop: 2 }}>$80 additional yield</div></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { onClose(); setStep('init'); }} style={{ flex: 1, background: 'transparent', border: '1px solid #444', borderRadius: 100, padding: '12px 0', fontWeight: 600, fontSize: 13, color: '#888', fontFamily: 'inherit' }}>Dismiss</button>
            <button onClick={() => { onClose(); setStep('init'); }} style={{ flex: 2, background: COLORS.lavender, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '12px 0', fontWeight: 700, fontSize: 13, color: COLORS.white, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <RefreshCw size={13} />Apply Rebalance
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}

function CreateGoalModal({ onClose }: { onClose: () => void }) {
  const GOAL_TYPES = ['travel', 'emergency', 'tech', 'crypto'] as const;
  const [selCat, setSelCat] = useState<string | null>(null);
  const [selRisk, setSelRisk] = useState<number | null>(null);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ background: COLORS.white, borderRadius: '24px 24px 0 0', padding: 24, paddingBottom: 48, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, background: COLORS.gray, borderRadius: 2, margin: '0 auto 24px' }} />
        <div style={{ fontWeight: 900, fontSize: 22, color: COLORS.black, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>NEW GOAL</div>

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
        <input placeholder="e.g. Japan Trip 2027" style={{ width: '100%', padding: '14px 16px', border: `2px solid ${COLORS.black}`, borderRadius: 12, fontSize: 15, fontWeight: 600, marginBottom: 16, fontFamily: 'inherit' }} />

        <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Target Amount</div>
        <input placeholder="$0" type="number" style={{ width: '100%', padding: '14px 16px', border: `2px solid ${COLORS.black}`, borderRadius: 12, fontSize: 15, fontWeight: 600, marginBottom: 16, fontFamily: 'inherit' }} />

        <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Deadline</div>
        <input type="date" style={{ width: '100%', padding: '14px 16px', border: `2px solid ${COLORS.black}`, borderRadius: 12, fontSize: 15, fontWeight: 600, marginBottom: 16, fontFamily: 'inherit', color: COLORS.black }} />

        <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Risk Tolerance</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {RISKS.map((r, i) => (
            <button key={r} onClick={() => setSelRisk(i)} style={{
              flex: 1, padding: '12px 8px', border: `2px solid ${COLORS.black}`, borderRadius: 12,
              fontWeight: 700, fontSize: 12, color: selRisk === i ? COLORS.white : COLORS.black,
              background: selRisk === i ? COLORS.black : COLORS.white, fontFamily: 'inherit',
              boxShadow: selRisk === i ? `2px 2px 0 ${COLORS.orange}` : 'none', textAlign: 'center', transition: 'all 0.15s',
            }}>
              {r}<br /><span style={{ fontWeight: 400, fontSize: 9, opacity: 0.6 }}>{['Safe', 'Mix', 'Bold'][i]}</span>
            </button>
          ))}
        </div>

        <div style={{ background: COLORS.lightGray, borderRadius: 12, padding: '12px 14px', marginBottom: 20, fontSize: 11, color: '#666', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={14} color={COLORS.lavender} style={{ flexShrink: 0 }} />
          AI will automatically build your multi-vault strategy based on risk preference and timeline.
        </div>

        <button onClick={onClose} style={{ width: '100%', background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '16px 0', fontWeight: 700, fontSize: 16, color: COLORS.black, fontFamily: 'inherit', boxShadow: '3px 3px 0 #080808' }}>
          Create Goal
        </button>
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
      <div style={{ fontSize: 14, color: COLORS.black, opacity: 0.7, marginTop: 8, lineHeight: 1.5 }}>Set a goal. AI builds your strategy.<br />Earn up to 18.4% APY on Base.</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        {[{ v: '18.4%', l: 'yoUSD APY' }, { v: '$60M+', l: 'TVL' }, { v: '5', l: 'Vaults' }].map((s, i) => (
          <div key={i} style={{ background: COLORS.white, border: `1.5px solid ${COLORS.black}`, borderRadius: 100, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600 }}>
            <span style={{ fontWeight: 900, color: COLORS.success }}>{s.v}</span>{s.l}
          </div>
        ))}
      </div>
    </div>

    <div style={{ background: COLORS.background, borderRadius: '24px 24px 0 0', marginTop: -12, position: 'relative', zIndex: 1, padding: '24px 16px 32px' }}>
      <SectionLabel icon={Check}>How It Works</SectionLabel>
      {[{ n: '1', t: 'Create a Goal', d: 'Name it, set a target amount, pick a deadline. "Japan Trip — $3,000 by March 2027."' },
        { n: '2', t: 'AI Builds Your Strategy', d: 'Our engine splits your savings across multiple YO vaults based on your risk tolerance and timeline.' },
        { n: '3', t: 'Deposit & Earn', d: 'One tap deposits on Base (< $0.03 gas). YO Protocol auto-rebalances for best risk-adjusted yield.' },
        { n: '4', t: 'Withdraw Anytime', d: 'Get your principal + 90% of yield. We take 10% of profit only — your deposits are never touched.' },
      ].map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.orange, border: `2px solid ${COLORS.black}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: COLORS.black, flexShrink: 0, boxShadow: '2px 2px 0 #080808' }}>{s.n}</div>
          <div><div style={{ fontWeight: 800, fontSize: 14, color: COLORS.black, marginBottom: 2 }}>{s.t}</div><div style={{ fontSize: 12, color: '#666', lineHeight: 1.4 }}>{s.d}</div></div>
        </div>
      ))}

      <SectionLabel icon={BarChart3}>Powered by YO Protocol</SectionLabel>
      <div style={{ background: COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 16, padding: 14, marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[{ apy: '18.4%', v: 'yoUSD', c: COLORS.orange, bg: '#FFF7ED' }, { apy: '13.2%', v: 'yoETH', c: COLORS.lavender, bg: '#F5F3FF' }, { apy: '1.4%', v: 'yoBTC', c: COLORS.warning, bg: '#FEFCE8' }].map((v, i) => (
            <div key={i} style={{ flex: 1, background: v.bg, borderRadius: 10, padding: 10, textAlign: 'center', border: `1px solid ${v.c}` }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: v.c }}>{v.apy}</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: '#888', marginTop: 2 }}>{v.v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: '#888', textAlign: 'center', lineHeight: 1.4 }}>ERC-4626 vaults on Base · Risk rated by Exponential.fi<br />Auto-rebalances across Morpho, Aave, Pendle & more</div>
      </div>

      <SectionLabel icon={Shield}>Why YO Goals</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {[{ t: 'Your Keys', d: 'Non-custodial. yoTokens stay in your wallet.', I: Shield, bg: '#F0FDF4', ic: COLORS.success },
          { t: 'AI Optimized', d: 'Multi-vault strategies built for your timeline.', I: Brain, bg: '#EFF6FF', ic: COLORS.info },
          { t: 'Fair Fees', d: '10% on yield only. Principal never touched.', I: Percent, bg: '#FFF7ED', ic: COLORS.orange },
          { t: 'No Wallet Needed', d: 'Sign in with email or Google. Privy handles the rest.', I: Mail, bg: '#F5F3FF', ic: COLORS.lavender },
        ].map((c, i) => (
          <div key={i} style={{ background: COLORS.white, border: `1.5px solid ${COLORS.black}`, borderRadius: 12, padding: 12 }}>
            <div style={{ width: 28, height: 28, background: c.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}><c.I size={14} color={c.ic} /></div>
            <div style={{ fontWeight: 700, fontSize: 12, color: COLORS.black, marginBottom: 2 }}>{c.t}</div>
            <div style={{ fontSize: 10, color: '#888', lineHeight: 1.3 }}>{c.d}</div>
          </div>
        ))}
      </div>

      <button onClick={onLogin} style={{ width: '100%', background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: 16, fontWeight: 700, fontSize: 16, color: COLORS.black, fontFamily: 'inherit', boxShadow: '3px 3px 0 #080808', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <ArrowUpRight size={18} />Start Saving Now
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12, fontSize: 10, color: '#888' }}>
        <span>Email</span><span>Google</span><span>MetaMask</span>
      </div>
      <div style={{ textAlign: 'center', fontSize: 9, color: '#AAA', marginTop: 16, lineHeight: 1.4 }}>Powered by YO Protocol · Built on Base · $24M funded by Paradigm, Coinbase Ventures</div>
    </div>
  </>);
}

// ─── DASHBOARD ───────────────────────────────────────────────
function Dashboard() {
  const { logout } = usePrivy();
  const router = useRouter();
  const [showDep, setShowDep] = useState(false);
  const [showWith, setShowWith] = useState(false);
  const [showAdv, setShowAdv] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selGoal, setSelGoal] = useState<typeof DEMO_GOALS[0] | null>(null);

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
            <span style={{ fontSize: 9, fontWeight: 600, color: COLORS.white, textTransform: 'uppercase' }}>0x1a...f3d2</span>
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
          const txtC = [COLORS.success, COLORS.info].includes(g.color) ? COLORS.white : COLORS.black;
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
                  <div style={{ background: g.color, borderRadius: 100, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: txtC }}>{Math.round(pct)}%</div>
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

      <Card variant="outlined" onClick={() => setShowCreate(true)} style={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center', padding: '20px 16px' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, border: `2px solid ${COLORS.black}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={20} strokeWidth={2.5} /></div>
        <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.black }}>Create New Goal</div>
        <div style={{ fontSize: 11, color: '#888' }}>AI builds your strategy automatically</div>
      </Card>

      <Card variant="dark" onClick={() => setShowAdv(true)} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '3px 3px 0 #7570D1' }}>
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

    {showDep && <DepositModal goal={selGoal} onClose={() => setShowDep(false)} />}
    {showWith && <WithdrawModal goal={selGoal} onClose={() => setShowWith(false)} />}
    {showAdv && <AdvisorModal onClose={() => setShowAdv(false)} />}
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
