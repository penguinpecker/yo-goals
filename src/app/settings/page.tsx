'use client';

import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { ArrowLeft, User, Wallet, Globe, Percent, FileText, ExternalLink, LogOut, Shield, Zap } from 'lucide-react';
import { COLORS } from '@/constants/theme';
import BottomNav from '@/components/BottomNav';

export default function SettingsPage() {
  const router = useRouter();
  const { logout, user } = usePrivy();
  const { address } = useAccount();

  const email = user?.email?.address || user?.google?.name || 'Connected';
  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected';

  return (<>
    <div style={{ background: COLORS.background, padding: '20px 24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={() => router.push('/')} style={{ width: 36, height: 36, borderRadius: 18, border: `2px solid ${COLORS.black}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' }}>
          <ArrowLeft size={18} color={COLORS.black} strokeWidth={2.5} />
        </button>
        <span style={{ fontWeight: 900, fontSize: 13, letterSpacing: 2, color: COLORS.black, textTransform: 'uppercase' }}>SETTINGS</span>
      </div>
    </div>

    <div style={{ padding: '0 16px 100px' }}>
      {/* Account */}
      <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>ACCOUNT</div>
      <div style={{ background: COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
        {[
          { Icon: User, title: 'Signed in via Privy', sub: email, bg: COLORS.orange, ic: COLORS.black },
          { Icon: Wallet, title: 'Wallet', sub: `${shortAddr} · Embedded (Privy)`, bg: COLORS.lightGray, ic: '#888' },
          { Icon: Globe, title: 'Network', sub: 'Base Mainnet (8453)', bg: COLORS.lightGray, ic: '#888' },
        ].map((row, i) => (
          <div key={i} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < 2 ? `1px solid #E5E5E5` : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <row.Icon size={16} color={row.ic} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>{row.title}</div>
              <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{row.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Protocol */}
      <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>PROTOCOL</div>
      <div style={{ background: COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
        {[
          { l: 'Optimization Fee', v: '10% yield only', vc: COLORS.success },
          { l: 'Fees Collected', v: '$0.00' },
          { l: 'Contract', v: 'BaseScan', vc: COLORS.info, link: true },
          { l: 'YO Protocol', v: 'docs.yo.xyz', vc: COLORS.info, link: true },
        ].map((row, i) => (
          <div key={i} style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 3 ? '1px solid #E5E5E5' : 'none' }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>{row.l}</span>
            <span style={{ fontSize: row.link ? 11 : 13, color: row.vc || '#666', fontWeight: row.vc ? 700 : 400, display: 'flex', alignItems: 'center', gap: 4 }}>
              {row.v}{row.link && <ExternalLink size={10} />}
            </span>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>ABOUT</div>
      <div style={{ background: COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
        {[
          { l: 'Version', v: '0.1.0' },
          { l: 'x402 API', v: 'Treasury funded', vc: COLORS.lavender },
          { l: 'Built for', v: 'Hack with YO 2026' },
        ].map((row, i) => (
          <div key={i} style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', borderBottom: i < 2 ? '1px solid #E5E5E5' : 'none' }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>{row.l}</span>
            <span style={{ fontSize: 11, color: row.vc || '#666', fontWeight: row.vc ? 600 : 400 }}>{row.v}</span>
          </div>
        ))}
      </div>

      <button onClick={() => logout()} style={{ width: '100%', background: COLORS.white, border: `2px solid ${COLORS.error}`, borderRadius: 100, padding: 14, fontWeight: 700, fontSize: 14, color: COLORS.error, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
        <LogOut size={14} />Sign Out
      </button>
    </div>

    <BottomNav />
  </>);
}
