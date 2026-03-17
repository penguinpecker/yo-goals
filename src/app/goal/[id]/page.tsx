'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, ArrowUpRight, TrendingUp, Sparkles, Clock, Percent, Eye, RefreshCw, Sliders, Check, AlertTriangle, Shield, ExternalLink } from 'lucide-react';
import { ProgressRing, GoalIllustration, VaultBadge, AllocBar, SectionLabel } from '@/components';
import { COLORS } from '@/constants/theme';
import { YO_VAULTS, YO_GOALS_CONTRACT } from '@/constants/contracts';
import { useWeb3 } from '@/hooks/useWeb3';
import BottomNav from '@/components/BottomNav';

const RISKS = ['Conservative', 'Balanced', 'Growth'];

const GOALS: Record<string, any> = {
  '1': { name: 'Japan Trip', ill: 'travel', target: 3000, current: 1847, allocs: [{ vault: 'yoETH', weight: 7000, apy: 13.2 }, { vault: 'yoBTC', weight: 3000, apy: 1.4 }], bApy: 9.7, risk: 1, color: COLORS.orange, days: 365, dep: 1700, yld: 147, onchainId: 0 },
  '2': { name: 'Emergency Fund', ill: 'emergency', target: 10000, current: 6230, allocs: [{ vault: 'yoETH', weight: 10000, apy: 13.2 }], bApy: 13.2, risk: 0, color: COLORS.lavender, days: 295, dep: 5800, yld: 430, onchainId: 1 },
  '3': { name: 'New MacBook', ill: 'tech', target: 2500, current: 2380, allocs: [{ vault: 'yoETH', weight: 10000, apy: 13.2 }], bApy: 13.2, risk: 0, color: COLORS.success, days: 82, dep: 2200, yld: 180, onchainId: 2 },
  '4': { name: 'ETH Stack', ill: 'crypto', target: 13000, current: 5460, allocs: [{ vault: 'yoETH', weight: 5000, apy: 13.2 }, { vault: 'yoBTC', weight: 5000, apy: 1.4 }], bApy: 7.3, risk: 2, color: COLORS.info, days: 447, dep: 4800, yld: 660, onchainId: 3 },
};

const riskBg: Record<string, { bg: string; c: string }> = { Low: { bg: '#DCFCE7', c: '#22C55E' }, Moderate: { bg: '#FEF3C7', c: '#F59E0B' }, Idle: { bg: '#F5F5F5', c: '#888' } };

function DepositModal({ goal: g, onClose }: { goal: any; onClose: () => void }) {
  const [amt, setAmt] = useState('');
  const { deposit, txStatus, txHash, txError, resetTx, isConnected, contractAddress } = useWeb3();

  const primaryVault = g.allocs[0]?.vault || 'yoETH';
  const vaultInfo = YO_VAULTS[primaryVault];
  const isLoading = txStatus === 'approving' || txStatus === 'depositing';
  const isDone = txStatus === 'success';
  const isError = txStatus === 'error';

  const handleDeposit = async () => {
    if (!amt || !isConnected) return;
    try {
      await deposit({ onchainGoalId: g.onchainId, amount: amt, vaultId: primaryVault });
    } catch (e) { console.error('Deposit failed:', e); }
  };

  const handleClose = () => { resetTx(); setAmt(''); onClose(); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={handleClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ background: COLORS.black, borderRadius: '24px 24px 0 0', padding: 24, paddingBottom: 48, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 24px' }} />

        {isDone && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: COLORS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Check size={36} color="#FFF" strokeWidth={3} /></div>
            <div style={{ fontWeight: 900, fontSize: 22, color: '#FFF' }}>DEPOSITED</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>{amt} {vaultInfo?.asset || 'ETH'} into {g.name}</div>
            <div style={{ background: '#1A1A1A', borderRadius: 12, padding: 14, marginTop: 16, textAlign: 'left' }}>
              <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>VAULT SPLIT</div>
              {g.allocs.map((a: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <VaultBadge vault={a.vault} size={18} />
                    <span style={{ fontSize: 11, color: '#FFF', fontWeight: 600 }}>{a.vault}</span>
                    <span style={{ fontSize: 10, color: '#888' }}>{a.weight / 100}%</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#FFF' }}>{(parseFloat(amt) * a.weight / 10000).toFixed(4)} {vaultInfo?.asset}</span>
                </div>
              ))}
            </div>
            {txHash && (
              <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: COLORS.lavender, marginTop: 12, textDecoration: 'none' }}>
                View transaction on BaseScan <ExternalLink size={10} />
              </a>
            )}
            <br /><button onClick={handleClose} style={{ background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '14px 32px', fontWeight: 700, color: COLORS.black, fontFamily: 'inherit', marginTop: 16, cursor: 'pointer' }}>Done</button>
          </div>
        )}

        {isError && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><AlertTriangle size={36} color="#FFF" /></div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#FFF' }}>TRANSACTION FAILED</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 8, maxWidth: 280, margin: '8px auto 0', lineHeight: 1.4 }}>{txError || 'Something went wrong'}</div>
            <button onClick={() => resetTx()} style={{ background: '#333', border: '1px solid #555', borderRadius: 100, padding: '12px 24px', fontWeight: 600, color: '#FFF', fontFamily: 'inherit', marginTop: 20, cursor: 'pointer' }}>Try Again</button>
          </div>
        )}

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: 56, height: 56, border: '3px solid #333', borderTopColor: COLORS.orange, borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#FFF', marginBottom: 4 }}>
              {txStatus === 'approving' ? 'Approving token spend...' : 'Depositing into vaults...'}
            </div>
            <div style={{ fontSize: 11, color: '#888' }}>Confirm in your wallet</div>
          </div>
        )}

        {!isLoading && !isDone && !isError && (<>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: g.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><GoalIllustration type={g.ill} size={28} color={COLORS.black} /></div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#FFF', textTransform: 'uppercase' }}>ADD TO {g.name}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{g.allocs.length} vault{g.allocs.length > 1 ? 's' : ''} · {g.bApy}% blended APY</div>
            {!isConnected && <div style={{ fontSize: 11, color: '#EF4444', marginTop: 8 }}>Wallet not connected</div>}
          </div>

          <div style={{ background: '#1A1A1A', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16, border: `1px solid ${amt ? COLORS.orange : '#333'}` }}>
            <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Amount ({vaultInfo?.asset || 'ETH'})</div>
            <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0.0" autoFocus
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 42, fontWeight: 900, color: '#FFF', width: 200, textAlign: 'center', fontFamily: 'inherit' }} />
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['0.001', '0.005', '0.01', '0.05'].map(a => (
              <button key={a} onClick={() => setAmt(a)} style={{ flex: 1, background: amt === a ? COLORS.orange : '#222', border: `1px solid ${amt === a ? COLORS.orange : '#444'}`, borderRadius: 100, padding: '10px 0', color: amt === a ? COLORS.black : '#FFF', fontWeight: 600, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer' }}>{a}</button>
            ))}
          </div>

          {amt && <div style={{ background: '#1A1A1A', borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>STRATEGY SPLIT</div>
            {g.allocs.map((a: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderTop: i ? '1px solid #333' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <VaultBadge vault={a.vault} size={22} />
                  <span style={{ fontSize: 12, color: '#FFF', fontWeight: 600 }}>{a.vault}</span>
                  <span style={{ fontSize: 10, color: '#888' }}>{a.weight / 100}%</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#FFF' }}>{(parseFloat(amt) * a.weight / 10000).toFixed(4)}</span>
              </div>
            ))}
          </div>}

          <div style={{ background: '#111', borderRadius: 10, padding: 10, marginBottom: 16, fontSize: 10, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={12} color={COLORS.success} />
            Two transactions: approve + deposit. Gas {'<'} $0.01 on Base.
          </div>

          <button onClick={handleDeposit} disabled={!amt || !isConnected} style={{ width: '100%', background: amt && isConnected ? COLORS.orange : '#333', border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '16px 0', fontWeight: 700, fontSize: 16, color: amt && isConnected ? COLORS.black : '#888', fontFamily: 'inherit', boxShadow: amt && isConnected ? '2px 2px 0 #080808' : 'none', cursor: amt && isConnected ? 'pointer' : 'not-allowed' }}>
            {!isConnected ? 'Connect Wallet' : amt ? `Deposit ${amt} ${vaultInfo?.asset || 'ETH'}` : 'Enter Amount'}
          </button>
        </>)}
      </div>
    </div>
  );
}

function WithdrawModal({ goal: g, onClose }: { goal: any; onClose: () => void }) {
  const { withdraw, txStatus, txHash, txError, resetTx, isConnected } = useWeb3();
  const fee = (g.yld * 0.1).toFixed(2);
  const gets = (g.current - parseFloat(fee)).toFixed(2);

  const isLoading = txStatus === 'withdrawing';
  const isDone = txStatus === 'success';
  const isError = txStatus === 'error';

  const handleWithdraw = async () => {
    try { await withdraw({ onchainGoalId: g.onchainId, currentValue: g.current }); } catch (e) { console.error('Withdraw failed:', e); }
  };
  const handleClose = () => { resetTx(); onClose(); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={handleClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ background: COLORS.black, borderRadius: '24px 24px 0 0', padding: 24, paddingBottom: 48, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div style={{ width: 40, height: 4, background: '#444', borderRadius: 2, margin: '0 auto 24px' }} />

        {isDone ? <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: COLORS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Check size={36} color="#FFF" strokeWidth={3} /></div>
          <div style={{ fontWeight: 900, fontSize: 22, color: '#FFF' }}>WITHDRAWN</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#CCFF00', marginTop: 8 }}>${gets}</div>
          {txHash && <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: COLORS.lavender, marginTop: 8, textDecoration: 'none' }}>View on BaseScan <ExternalLink size={10} /></a>}
          <br /><button onClick={handleClose} style={{ background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '14px 32px', fontWeight: 700, color: COLORS.black, fontFamily: 'inherit', marginTop: 20, cursor: 'pointer' }}>Done</button>
        </div>

        : isLoading ? <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ width: 56, height: 56, border: '3px solid #333', borderTopColor: COLORS.orange, borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#FFF' }}>Withdrawing from vaults...</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Confirm in your wallet</div>
        </div>

        : isError ? <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><AlertTriangle size={36} color="#FFF" /></div>
          <div style={{ fontWeight: 900, fontSize: 18, color: '#FFF' }}>FAILED</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>{txError}</div>
          <button onClick={() => resetTx()} style={{ background: '#333', border: '1px solid #555', borderRadius: 100, padding: '12px 24px', fontWeight: 600, color: '#FFF', fontFamily: 'inherit', marginTop: 20, cursor: 'pointer' }}>Try Again</button>
        </div>

        : <>
          <div style={{ textAlign: 'center', marginBottom: 20 }}><div style={{ fontWeight: 900, fontSize: 18, color: '#FFF', textTransform: 'uppercase' }}>WITHDRAW FROM {g.name}</div></div>
          <div style={{ background: '#1A1A1A', borderRadius: 14, padding: 16, marginBottom: 12 }}>
            {[{ l: 'Total Value', v: `$${g.current.toLocaleString()}`, b: true }, { l: 'Deposits', v: `$${g.dep.toLocaleString()}` }, { l: 'Yield', v: `$${g.yld}`, c: COLORS.success }, { l: 'Fee (10%)', v: `-$${fee}`, c: COLORS.lavender }, { l: 'You Receive', v: `$${gets}`, b: true, c: '#CCFF00' }].map((r: any, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid #333' : 'none' }}>
                <span style={{ fontSize: 12, color: '#888', fontWeight: r.b ? 700 : 400 }}>{r.l}</span><span style={{ fontSize: r.b ? 14 : 12, fontWeight: r.b ? 900 : 700, color: r.c || '#FFF' }}>{r.v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#111', borderRadius: 10, padding: 10, marginBottom: 16, fontSize: 10, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={12} color={COLORS.success} />Principal fully returned. Fee only on profit.
          </div>
          <button onClick={handleWithdraw} disabled={!isConnected} style={{ width: '100%', background: isConnected ? COLORS.orange : '#333', border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '16px 0', fontWeight: 700, fontSize: 16, color: isConnected ? COLORS.black : '#888', fontFamily: 'inherit', boxShadow: isConnected ? '2px 2px 0 #080808' : 'none', cursor: isConnected ? 'pointer' : 'not-allowed' }}>
            {isConnected ? 'Confirm Withdrawal' : 'Connect Wallet'}
          </button>
        </>}
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
  const contractUrl = `https://basescan.org/address/${YO_GOALS_CONTRACT}`;

  return (<>
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

    <div style={{ background: '#D9D9D9', borderRadius: '24px 24px 0 0', marginTop: -12, position: 'relative', zIndex: 1, padding: '24px 16px 100px' }}>
      <div style={{ background: '#FFF', border: `2px solid ${COLORS.black}`, borderRadius: 16, padding: 24, marginBottom: 12, textAlign: 'center', boxShadow: '3px 3px 0 #080808' }}>
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
          <button onClick={() => setShowDep(true)} style={{ background: COLORS.orange, border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '12px 20px', fontWeight: 700, fontSize: 14, color: COLORS.black, fontFamily: 'inherit', boxShadow: '2px 2px 0 #080808', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><Plus size={16} strokeWidth={3} />Add Funds</button>
          <button onClick={() => setShowWith(true)} style={{ background: '#FFF', border: `2px solid ${COLORS.black}`, borderRadius: 100, padding: '12px 20px', fontWeight: 700, fontSize: 14, color: COLORS.black, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><ArrowUpRight size={16} />Withdraw</button>
        </div>
      </div>

      <SectionLabel icon={Sliders}>Your Strategy</SectionLabel>
      <div style={{ background: '#FFF', border: `2px solid ${COLORS.black}`, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '2px 2px 0 #080808' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.black, textTransform: 'uppercase', letterSpacing: 0.5 }}>{RISKS[g.risk]}</span>
          <div style={{ background: '#CCFF00', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 900, color: COLORS.black }}>{g.bApy}% blended</div>
        </div>
        {g.allocs.map((a: any, i: number) => (
          <AllocBar key={i} vault={a.vault} weight={a.weight} apy={a.apy} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        {[
          { l: 'YIELD EARNED', v: `$${g.yld}`, bg: '#F0FDF4', ic: COLORS.success, I: TrendingUp },
          { l: 'PROJECTED 1YR', v: `$${proj.toLocaleString()}`, bg: '#EFF6FF', ic: COLORS.info, I: Sparkles },
          { l: 'DAYS LEFT', v: `${g.days}`, bg: '#FEFCE8', ic: '#F59E0B', I: Clock },
          { l: 'OPT. FEE (10%)', v: `$${fee}`, bg: '#F5F3FF', ic: COLORS.lavender, I: Percent },
        ].map((s, i) => (
          <div key={i} style={{ background: '#FFF', border: `1px solid ${COLORS.black}`, borderRadius: 14, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, background: s.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.I size={14} color={s.ic} /></div>
              <span style={{ fontSize: 8, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>{s.l}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.black }}>{s.v}</div>
          </div>
        ))}
      </div>

      <SectionLabel>CONTRACT</SectionLabel>
      <div style={{ background: '#FFF', border: '1.5px solid #080808', borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: '#888' }}>YoGoals</span>
          <a href={contractUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#3B82F6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            {YO_GOALS_CONTRACT.slice(0,6)}...{YO_GOALS_CONTRACT.slice(-4)} <ExternalLink size={10} />
          </a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#888' }}>Status</span>
          <span style={{ fontSize: 11, color: COLORS.success, fontWeight: 700 }}>Verified on BaseScan</span>
        </div>
      </div>

      <div style={{ padding: '12px 14px', background: '#FFF', border: '1px solid #D9D9D9', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ width: 28, height: 28, background: '#F5F3FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Percent size={13} color={COLORS.lavender} /></div>
        <div style={{ fontSize: 11, color: '#666', lineHeight: 1.5 }}>
          <strong style={{ color: COLORS.black }}>10% optimization fee on yield only.</strong> Principal never touched. Fees fund the AI strategy engine.
        </div>
      </div>
    </div>

    {showDep && <DepositModal goal={g} onClose={() => setShowDep(false)} />}
    {showWith && <WithdrawModal goal={g} onClose={() => setShowWith(false)} />}
    <BottomNav />
  </>);
}
