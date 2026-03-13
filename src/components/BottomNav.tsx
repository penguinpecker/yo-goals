'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, BarChart3, Brain, Settings } from 'lucide-react';

const tabs = [
  { id: '/', label: 'Home', Icon: Home },
  { id: '/vaults', label: 'Vaults', Icon: BarChart3 },
  { id: '/advisor', label: 'Advisor', Icon: Brain },
  { id: '/settings', label: 'Settings', Icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = tabs.find(t => t.id === '/' ? pathname === '/' : pathname.startsWith(t.id))?.id || '/';

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480, background: '#FFF',
      borderTop: '2px solid #080808', padding: '6px 16px 10px',
      display: 'flex', justifyContent: 'space-around', zIndex: 50,
    }}>
      {tabs.map(t => {
        const a = activeTab === t.id;
        return (
          <div key={t.id} onClick={() => router.push(t.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 2, cursor: 'pointer', padding: '4px 12px',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: a ? '#F26F21' : 'transparent',
              border: a ? '1.5px solid #080808' : '1.5px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
              boxShadow: a ? '2px 2px 0 #080808' : 'none',
            }}>
              <t.Icon size={16} color={a ? '#080808' : '#888'} strokeWidth={a ? 2.5 : 2} />
            </div>
            <span style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const,
              letterSpacing: 0.5, color: a ? '#F26F21' : '#888',
            }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}
