'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Brain, TrendingUp, Shield, Clock, ChevronRight,
  RefreshCw, Sparkles, Check, Target, AlertTriangle, Plus,
} from 'lucide-react';
import { GoalIllustration, VaultBadge, SectionLabel } from '@/components';
import { COLORS } from '@/constants/theme';
import { YO_VAULTS } from '@/constants/contracts';
import BottomNav from '@/components/BottomNav';

const DEMO_GOALS = [
  { id: '1', name: 'Japan Trip', ill: 'travel', pct: 62, current: 1847, target: 3000, status: 'on-track', color: '#F26F21' },
  { id: '2', name: 'Emergency Fund', ill: 'emergency', pct: 62, current: 6230, target: 10000, status: 'rebalance', color: '#938EF2' },
  { id: '3', name: 'New MacBook', ill: 'tech', pct: 95, current: 2380, target: 2500, status: 'almost-done', color: '#22C55E' },
  { id: '4', name: 'ETH Stack', ill: 'crypto', pct: 42, current: 5460, target: 13000, status: 'behind', color: '#3B82F6' },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  'on-track': { bg: '#0d2a14', text: '#22C55E', label: 'On Track' },
  'rebalance': { bg: '#1a1500', text: '#F59E0B', label: 'Rebalance' },
  'almost-done': { bg: '#0d2a14', text: '#22C55E', label: 'Almost Done' },
  'behind': { bg: '#1a1500', text: '#F59E0B', label: 'Behind' },
};

export default function AdvisorPage() {
  const router = useRouter();
  const [analysisMode, setAnalysisMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const runAnalysis = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setAnalysisMode(true); }, 2200);
  };

  return (<>
    {/* Header */}
    <div style={{ background: 'linear-gradient(135deg, #938EF2 0%, #7570D1 100%)', padding: '20px 24px 40px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', bottom: -20, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(0,0,0,0.08)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, position: 'relative' }}>
        <button onClick={() => router.push('/')} style={{ width: 36, height: 36, borderRadius: 18, border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' }}>
          <ArrowLeft size={18} color="#FFF" strokeWidth={2.5} />
        </button>
        <span style={{ fontWeight: 900, fontSize: 13, letterSpacing: 2, color: '#FFF', textTransform: 'uppercase' }}>AI ADVISOR</span>
        <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '4px 10px', fontSize: 9, fontWeight: 600, color: '#FFF', display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: '#CCFF00' }} />FREE
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)' }}>
          <Brain size={28} color="#FFF" />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22, color: '#FFF', lineHeight: 1 }}>
            {analysisMode ? 'HEALTH CHECK' : 'SAVINGS AI'}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>
            {analysisMode ? 'Generated just now · Live vault data' : 'Powered by x402 · Costs paid by treasury'}
          </div>
        </div>
      </div>
    </div>

    {/* Content */}
    <div style={{ background: COLORS.black, borderRadius: '24px 24px 0 0', marginTop: -12, position: 'relative', zIndex: 1, padding: '20px 16px 100px' }}>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: 56, height: 56, border: '3px solid #333', borderTopColor: COLORS.lavender, borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#FFF', marginBottom: 4 }}>Analyzing your portfolio...</div>
          <div style={{ fontSize: 11, color: '#888' }}>Checking 4 goals across 3 vaults</div>
        </div>
      )}

      {/* ─── INITIAL STATE ─────────────────────────────────── */}
      {!loading && !analysisMode && (<>
        {/* Portfolio summary */}
        <div style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>YOUR PORTFOLIO</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 24, color: '#FFF' }}>$12,697</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>across 4 goals</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.success }}>16.2%</div>
              <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>avg blended APY</div>
            </div>
          </div>
          <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
            <div style={{ flex: 50, background: '#938EF2', borderRadius: '4px 0 0 4px' }} />
            <div style={{ flex: 30, background: '#F59E0B' }} />
            <div style={{ flex: 20, background: '#6C9700', borderRadius: '0 4px 4px 0' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: '#888' }}>
            <span>50% yoETH</span><span>30% yoBTC</span><span>20% yoGOLD</span>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ fontSize: 9, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>ASK ANYTHING</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {['"Optimize my allocations"', '"Am I on track?"', '"Should I rebalance?"', '"Safest strategy?"', '"Compare yoETH vs yoGOLD"'].map((q, i) => (
            <div key={i} onClick={runAnalysis} style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 100, padding: '8px 14px', fontSize: 11, color: '#FFF', cursor: 'pointer', transition: 'all 0.15s' }}>{q}</div>
          ))}
        </div>

        {/* Insights */}
        <div style={{ fontSize: 9, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>AI INSIGHTS</div>

        {/* Insight 1 - Rebalance */}
        <div style={{ background: '#1A1A1A', border: `1px solid ${COLORS.lavender}`, borderRadius: 14, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: '#2a2040', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={18} color={COLORS.lavender} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#FFF', marginBottom: 3 }}>Rebalance Opportunity</div>
            <div style={{ fontSize: 11, color: '#888', lineHeight: 1.4 }}>Emergency Fund could earn $80 more by shifting 15% from yoETH to yoGOLD.</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button style={{ background: COLORS.lavender, border: '1.5px solid #080808', borderRadius: 100, padding: '6px 14px', fontSize: 10, fontWeight: 700, color: '#FFF', fontFamily: 'inherit', cursor: 'pointer' }}>Apply</button>
              <button style={{ background: 'transparent', border: '1px solid #444', borderRadius: 100, padding: '6px 14px', fontSize: 10, fontWeight: 600, color: '#888', fontFamily: 'inherit', cursor: 'pointer' }}>Dismiss</button>
            </div>
          </div>
        </div>

        {/* Insight 2 - Risk OK */}
        <div style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 14, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: '#0d2a14', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={18} color={COLORS.success} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#FFF', marginBottom: 3 }}>Risk Check Passed</div>
            <div style={{ fontSize: 11, color: '#888', lineHeight: 1.4 }}>All vaults rated B (Moderate) by Exponential.fi. No concentration risk.</div>
          </div>
        </div>

        {/* Insight 3 - On track */}
        <div style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 14, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: '#1a1a0a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={18} color="#CCFF00" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#FFF', marginBottom: 3 }}>Japan Trip On Track</div>
            <div style={{ fontSize: 11, color: '#888', lineHeight: 1.4 }}>At current rate, you'll hit $3,000 by Feb 2027 — 1 month ahead of deadline.</div>
          </div>
        </div>

        {/* CTA */}
        <button onClick={runAnalysis} style={{ width: '100%', background: COLORS.lavender, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '14px 0', fontWeight: 700, fontSize: 14, color: '#FFF', fontFamily: 'inherit', cursor: 'pointer', boxShadow: '2px 2px 0 #5550a0', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Brain size={16} />Get Full Analysis
        </button>

        <div style={{ textAlign: 'center', fontSize: 9, color: '#555', marginTop: 12, lineHeight: 1.4 }}>
          Free for you · x402 API costs paid by treasury fees<br />External agents pay $0.01 USDC per request
        </div>
      </>)}

      {/* ─── ANALYSIS RESULTS ──────────────────────────────── */}
      {!loading && analysisMode && (<>
        {/* Health score */}
        <div style={{ background: '#1A1A1A', border: '2px solid #333', borderRadius: 16, padding: 20, marginBottom: 16, textAlign: 'center', boxShadow: '2px 2px 0 #333' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>PORTFOLIO HEALTH</div>
          <div style={{ fontWeight: 900, fontSize: 56, color: COLORS.success, lineHeight: 1 }}>87</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>out of 100 · <span style={{ color: COLORS.success, fontWeight: 700 }}>Good</span></div>
          <div style={{ height: 8, background: '#222', borderRadius: 4, marginTop: 12, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '87%', background: 'linear-gradient(90deg, #22C55E, #CCFF00)', borderRadius: 4 }} />
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ fontSize: 9, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>RECOMMENDATIONS</div>

        {/* Rec 1 - Rebalance */}
        <div style={{ background: '#1A1A1A', border: `1px solid ${COLORS.lavender}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, background: '#2a2040', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={12} color={COLORS.lavender} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#FFF' }}>Rebalance Emergency Fund</div>
            <div style={{ marginLeft: 'auto', background: COLORS.lavender, borderRadius: 4, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: '#FFF' }}>HIGH</div>
          </div>
          <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5, marginBottom: 12 }}>Shift 15% from yoETH to yoGOLD for better risk-adjusted yield. Your 295-day horizon supports moderate diversification.</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, background: '#222', borderRadius: 10, padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#888', marginBottom: 2 }}>CURRENT</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#FFF' }}>17.7%</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} color={COLORS.lavender} />
            </div>
            <div style={{ flex: 1, background: '#0d2a14', border: `1px solid ${COLORS.success}`, borderRadius: 10, padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: COLORS.success, marginBottom: 2 }}>AFTER</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: COLORS.success }}>18.5%</div>
            </div>
          </div>
          <button style={{ width: '100%', background: COLORS.lavender, border: '1.5px solid #080808', borderRadius: 100, padding: '10px', fontWeight: 700, fontSize: 12, color: '#FFF', fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <RefreshCw size={12} />Apply Rebalance
          </button>
        </div>

        {/* Rec 2 - Deposit more */}
        <div style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, background: '#1a1a0a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={12} color="#CCFF00" />
            </div>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#FFF' }}>Increase ETH Stack deposits</div>
            <div style={{ marginLeft: 'auto', background: '#333', borderRadius: 4, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: '#888' }}>MED</div>
          </div>
          <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5 }}>Adding $200/month puts you on track for $13,000 by June 2027. Currently $260/month behind pace.</div>
        </div>

        {/* Rec 3 - Almost done */}
        <div style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, background: '#0d2a14', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={12} color={COLORS.success} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#FFF' }}>New MacBook almost funded</div>
            <div style={{ marginLeft: 'auto', background: '#0d2a14', borderRadius: 4, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: COLORS.success }}>DONE</div>
          </div>
          <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5 }}>$2,380 of $2,500 (95%). At 18.4% APY, you'll hit target in ~23 days. Consider withdrawing early.</div>
        </div>

        {/* Goal breakdown */}
        <div style={{ fontSize: 9, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 16 }}>GOAL BREAKDOWN</div>
        <div style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
          {DEMO_GOALS.map((g, i) => {
            const st = statusColors[g.status];
            return (
              <div key={g.id} onClick={() => router.push(`/goal/${g.id}`)} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < DEMO_GOALS.length - 1 ? '1px solid #222' : 'none', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: g.color }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12, color: '#FFF' }}>{g.name}</div>
                    <div style={{ fontSize: 10, color: '#888' }}>{g.pct}% · ${g.current.toLocaleString()} / ${g.target.toLocaleString()}</div>
                  </div>
                </div>
                <span style={{ fontWeight: 800, fontSize: 12, color: st.text }}>{st.label}</span>
              </div>
            );
          })}
        </div>

        {/* Back to insights */}
        <button onClick={() => setAnalysisMode(false)} style={{ width: '100%', background: 'transparent', border: '1px solid #444', borderRadius: 100, padding: '12px 0', fontWeight: 600, fontSize: 13, color: '#888', fontFamily: 'inherit', cursor: 'pointer', marginBottom: 8 }}>
          Back to Insights
        </button>

        <div style={{ textAlign: 'center', fontSize: 9, color: '#555', marginTop: 8, lineHeight: 1.4 }}>
          Analysis powered by x402 protocol<br />Treasury-funded · Zero cost to you
        </div>
      </>)}
    </div>

    <BottomNav />
  </>);
}
