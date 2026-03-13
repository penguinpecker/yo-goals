'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, ChevronRight, TrendingUp } from 'lucide-react';
import { VaultBadge, SectionLabel } from '@/components';
import { YO_VAULTS, VAULT_IDS } from '@/constants/contracts';
import BottomNav from '@/components/BottomNav';

export default function VaultsPage() {
  const router = useRouter();

  return (<>
    <div style={{ background:'#080808',padding:'20px 24px 32px' }}>
      <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:20 }}>
        <button onClick={()=>router.push('/')} style={{ width:36,height:36,borderRadius:18,border:'2px solid #FFF',display:'flex',alignItems:'center',justifyContent:'center',background:'transparent',cursor:'pointer' }}>
          <ArrowLeft size={18} color="#FFF" strokeWidth={2.5} />
        </button>
        <span style={{ fontWeight:900,fontSize:13,letterSpacing:2,color:'#FFF',textTransform:'uppercase' }}>YO VAULTS</span>
      </div>
      <div style={{ fontWeight:900,fontSize:28,color:'#FFF',textTransform:'uppercase',letterSpacing:1,lineHeight:1 }}>VAULT OVERVIEW</div>
      <div style={{ fontSize:12,color:'#888',marginTop:4 }}>Live yields from YO Protocol on Base</div>
    </div>

    <div style={{ background:'#D9D9D9',borderRadius:'24px 24px 0 0',marginTop:-12,position:'relative',zIndex:1,padding:'20px 16px 100px' }}>
      {/* Total stats */}
      <div style={{ display:'flex',gap:8,marginBottom:16 }}>
        <div style={{ flex:1,background:'#CCFF00',border:'2px solid #080808',borderRadius:12,padding:'12px 14px',textAlign:'center',boxShadow:'2px 2px 0 #080808' }}>
          <div style={{ fontWeight:900,fontSize:18,color:'#080808' }}>$27M+</div>
          <div style={{ fontSize:8,fontWeight:600,color:'#666',textTransform:'uppercase',letterSpacing:1,marginTop:2 }}>TOTAL TVL</div>
        </div>
        <div style={{ flex:1,background:'#FFF',border:'2px solid #080808',borderRadius:12,padding:'12px 14px',textAlign:'center' }}>
          <div style={{ fontWeight:900,fontSize:18,color:'#080808' }}>3</div>
          <div style={{ fontSize:8,fontWeight:600,color:'#666',textTransform:'uppercase',letterSpacing:1,marginTop:2 }}>ACTIVE VAULTS</div>
        </div>
        <div style={{ flex:1,background:'#FFF',border:'2px solid #080808',borderRadius:12,padding:'12px 14px',textAlign:'center' }}>
          <div style={{ fontWeight:900,fontSize:18,color:'#22C55E' }}>B</div>
          <div style={{ fontSize:8,fontWeight:600,color:'#666',textTransform:'uppercase',letterSpacing:1,marginTop:2 }}>RISK RATED</div>
        </div>
      </div>

      <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
        {VAULT_IDS.map(id => {
          const v = YO_VAULTS[id];
          return (
            <div key={id} onClick={()=>router.push(`/vaults/${id}`)}
              style={{
                background:'#FFF',border:`2px solid #080808`,borderRadius:16,
                padding:0,cursor:'pointer',transition:'all 0.2s',overflow:'hidden',
                display:'flex',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow='3px 3px 0 #080808';(e.currentTarget as HTMLElement).style.transform='translate(-2px,-2px)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='none';(e.currentTarget as HTMLElement).style.transform='translate(0,0)';}}
            >
              {/* Colored accent stripe */}
              <div style={{ width:6,background:v.color,flexShrink:0 }} />
              <div style={{ flex:1,padding:16,display:'flex',alignItems:'center',gap:14 }}>
                <VaultBadge vault={id} size={42} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800,fontSize:17,color:'#080808' }}>{id}</div>
                  <div style={{ fontSize:11,color:'#888',marginTop:3 }}>{v.asset} · TVL {v.tvl}</div>
                  <div style={{ display:'flex',gap:6,marginTop:6 }}>
                    <span style={{ fontSize:9,fontWeight:600,padding:'2px 8px',borderRadius:100,background:`${v.color}18`,color:v.color,border:`1px solid ${v.color}40` }}>Risk: {v.risk}</span>
                    <span style={{ fontSize:9,fontWeight:600,padding:'2px 8px',borderRadius:100,background:'#F0FDF4',color:'#22C55E',border:'1px solid #22C55E40' }}>ERC-4626</span>
                  </div>
                </div>
                <div style={{ textAlign:'right',marginRight:4 }}>
                  <div style={{ fontWeight:900,fontSize:24,color:'#22C55E',lineHeight:1 }}>{v.apy}%</div>
                  <div style={{ fontSize:9,color:'#888',textTransform:'uppercase',marginTop:2 }}>APY</div>
                </div>
                <ChevronRight size={16} color="#CCC" style={{ flexShrink:0 }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:16,padding:'12px 14px',background:'#FFF',border:'1px solid #D9D9D9',borderRadius:12,display:'flex',alignItems:'flex-start',gap:10 }}>
        <div style={{ width:28,height:28,background:'#F5F3FF',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          <Shield size={13} color="#938EF2" />
        </div>
        <div style={{ fontSize:11,color:'#666',lineHeight:1.5 }}>
          All vaults are <strong style={{ color:'#080808' }}>ERC-4626</strong> on Base mainnet. Yields auto-compound. Risk rated by <strong style={{ color:'#080808' }}>Exponential.fi</strong>. Rebalanced daily across Morpho, Aave, Pendle, and more.
        </div>
      </div>
    </div>

    <BottomNav />
  </>);
}
