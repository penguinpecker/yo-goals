'use client';

import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { ArrowLeft, User, Wallet, Globe, ExternalLink, LogOut } from 'lucide-react';
import { COLORS } from '@/constants/theme';
import { YO_GOALS_CONTRACT } from '@/constants/contracts';
import BottomNav from '@/components/BottomNav';

export default function SettingsPage() {
  const router = useRouter();
  const { logout, user } = usePrivy();
  const { address } = useAccount();

  const email = user?.email?.address || user?.google?.name || 'Connected';
  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected';
  const contractAddr = YO_GOALS_CONTRACT || '0x208C305F9D1794461d7069be1003e7e979C38e3F';
  const contractShort = `${contractAddr.slice(0, 6)}...${contractAddr.slice(-4)}`;
  const contractUrl = `https://basescan.org/address/${contractAddr}`;

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
          { Icon: Wallet, title: 'Wallet', sub: shortAddr, bg: COLORS.lightGray, ic: '#888' },
          { Icon: Globe, title: 'Network', sub: 'Base Mainnet (8453)', bg: COLORS.lightGray, ic: '#888' },
        ].map((row, i) => (
          <div key={i} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < 2 ? '1px solid #E5E5E5' : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <row.Icon size={16} color={row.ic} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>{row.title}</div>
              <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{row.sub}</div>
            </div>
          </div>
        ))}
        {address && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid #E5E5E5' }}>
            <a href={`https://basescan.org/address/${address}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: COLORS.info, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              View wallet on BaseScan <ExternalLink size={10} />
            </a>
          </div>
        )}
      </div>

      {/* Protocol */}
      <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>PROTOCOL</div>
      <div style={{ background: COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E5E5' }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>Optimization Fee</span>
          <span style={{ fontSize: 13, color: COLORS.success, fontWeight: 700 }}>10% yield only</span>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E5E5' }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>YoGoals Contract</span>
          <a href={contractUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: COLORS.info, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            {contractShort} <ExternalLink size={10} />
          </a>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E5E5' }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>YO Protocol</span>
          <a href="https://docs.yo.xyz" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: COLORS.info, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            docs.yo.xyz <ExternalLink size={10} />
          </a>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>Chain</span>
          <a href="https://basescan.org" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: COLORS.info, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            Base Mainnet <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* About */}
      <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>ABOUT</div>
      <div style={{ background: COLORS.white, border: `2px solid ${COLORS.black}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E5E5' }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>Version</span>
          <span style={{ fontSize: 11, color: '#666' }}>0.1.0</span>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E5E5' }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>x402 API</span>
          <span style={{ fontSize: 11, color: COLORS.lavender, fontWeight: 600 }}>Treasury funded</span>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E5E5' }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>Built for</span>
          <span style={{ fontSize: 11, color: '#666' }}>Hack with YO 2026</span>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.black }}>GitHub</span>
          <a href="https://github.com/penguinpecker/yo-goals" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: COLORS.info, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            penguinpecker/yo-goals <ExternalLink size={10} />
          </a>
        </div>
      </div>

      <button onClick={() => logout()} style={{ width: '100%', background: COLORS.white, border: `2px solid #EF4444`, borderRadius: 100, padding: 14, fontWeight: 700, fontSize: 14, color: '#EF4444', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
        <LogOut size={14} />Sign Out
      </button>
    </div>

    <BottomNav />
  </>);
}
