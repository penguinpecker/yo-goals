'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Eye, Shield, ExternalLink, Plus } from 'lucide-react';
import { SectionLabel } from '@/components';
import { YO_VAULTS, YO_GOALS_CONTRACT } from '@/constants/contracts';
import BottomNav from '@/components/BottomNav';

const COLORS = { black:'#080808',white:'#FFF',gray:'#D9D9D9',lightGray:'#F5F5F5',success:'#22C55E',info:'#3B82F6',lavender:'#938EF2',orange:'#F26F21' };
const riskBg: Record<string,{bg:string;c:string}> = { Low:{bg:'#DCFCE7',c:'#22C55E'}, Moderate:{bg:'#FEF3C7',c:'#F59E0B'}, Idle:{bg:'#F5F5F5',c:'#888'} };

export default function VaultDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const v = YO_VAULTS[id];
  if (!v) return <div style={{padding:32,textAlign:'center',color:'#888'}}>Vault not found</div>;

  const vaultBasescan = `https://basescan.org/address/${v.address}`;
  const contractBasescan = YO_GOALS_CONTRACT ? `https://basescan.org/address/${YO_GOALS_CONTRACT}` : '#';
  const contractShort = YO_GOALS_CONTRACT ? `${YO_GOALS_CONTRACT.slice(0,6)}...${YO_GOALS_CONTRACT.slice(-4)}` : 'Not deployed';

  return (<>
    <div style={{background:v.color,padding:'20px 24px 40px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-40,right:-40,width:160,height:160,borderRadius:'50%',background:'rgba(255,255,255,.08)'}} />
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
        <button onClick={()=>router.push('/vaults')} style={{width:36,height:36,borderRadius:18,border:'2px solid #080808',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,.2)',cursor:'pointer'}}>
          <ArrowLeft size={18} color="#080808" strokeWidth={2.5} />
        </button>
        <span style={{fontWeight:900,fontSize:13,letterSpacing:2,color:'#080808',textTransform:'uppercase'}}>VAULT DETAIL</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <div style={{width:56,height:56,borderRadius:16,background:'#080808',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:22,color:v.color,border:'2px solid #080808'}}>
          {id.replace('yo','')[0]}
        </div>
        <div>
          <div style={{fontWeight:900,fontSize:28,color:'#080808',lineHeight:1}}>{id}</div>
          <div style={{fontSize:13,color:'#080808',opacity:.7,marginTop:2}}>{v.asset} · Base Mainnet</div>
        </div>
      </div>
    </div>

    <div style={{background:COLORS.gray,borderRadius:'24px 24px 0 0',marginTop:-12,position:'relative',zIndex:1,padding:'20px 16px 100px'}}>
      {/* APY + Deposit */}
      <div style={{background:COLORS.white,border:'2px solid #080808',borderRadius:16,padding:20,marginBottom:12,boxShadow:'3px 3px 0 #080808',textAlign:'center'}}>
        <div style={{fontSize:10,fontWeight:600,color:'#888',textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>CURRENT APY</div>
        <div style={{fontWeight:900,fontSize:48,color:COLORS.success,lineHeight:1}}>{v.apy}%</div>
        <div style={{fontSize:11,color:'#888',marginTop:4}}>Risk Rating: <strong style={{color:'#080808'}}>{v.risk} (Moderate)</strong> · Exponential.fi</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:16}}>
          {[{v:v.tvl,l:'TVL'},{v:`${v.decimals}`,l:'DECIMALS'},{v:'0%',l:'VAULT FEE'}].map((s,i)=>(
            <div key={i} style={{background:COLORS.lightGray,borderRadius:10,padding:10}}>
              <div style={{fontWeight:900,fontSize:16,color:'#080808'}}>{s.v}</div>
              <div style={{fontSize:8,fontWeight:600,color:'#888',textTransform:'uppercase',marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>router.push('/')} style={{width:'100%',background:COLORS.orange,border:'2px solid #080808',borderRadius:100,padding:'14px 0',fontWeight:700,fontSize:14,color:'#080808',fontFamily:'inherit',boxShadow:'2px 2px 0 #080808',marginTop:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
          <Plus size={16} strokeWidth={3} />Deposit into {id}
        </button>
      </div>

      {/* Chart */}
      <SectionLabel>YIELD HISTORY (30D)</SectionLabel>
      <div style={{background:COLORS.white,border:'2px solid #080808',borderRadius:16,padding:16,marginBottom:12}}>
        <div style={{height:120,display:'flex',alignItems:'flex-end',gap:3,padding:'0 4px'}}>
          {v.chart.map((h: number,i: number)=>(
            <div key={i} style={{flex:1,background:v.color,borderRadius:'3px 3px 0 0',height:`${h}%`,opacity:.7+(i/v.chart.length)*.3}} />
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:8,fontSize:9,color:'#888'}}><span>30d ago</span><span>Today</span></div>
      </div>

      {/* Pools */}
      <SectionLabel icon={Eye}>UNDERLYING POOLS</SectionLabel>
      <div style={{background:COLORS.white,border:'2px solid #080808',borderRadius:16,padding:14,marginBottom:12}}>
        {v.pools.map((p: any,i: number)=>{
          const rb = riskBg[p.risk]||riskBg.Idle;
          return(
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:i<v.pools.length-1?'1px solid #F5F5F5':'none'}}>
              <div><div style={{fontWeight:600,fontSize:12,color:'#080808'}}>{p.name}</div><div style={{fontSize:10,color:'#888'}}>{p.chain}</div></div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:9,fontWeight:600,padding:'2px 6px',borderRadius:4,background:rb.bg,color:rb.c}}>{p.risk}</span>
                <span style={{fontWeight:800,fontSize:12,color:'#080808'}}>{p.pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vault Contract */}
      <SectionLabel>VAULT CONTRACT</SectionLabel>
      <div style={{background:COLORS.white,border:'1.5px solid #080808',borderRadius:12,padding:14,marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <span style={{fontSize:11,color:'#888'}}>Vault Address</span>
          <a href={vaultBasescan} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:COLORS.info,fontWeight:600,display:'flex',alignItems:'center',gap:4,textDecoration:'none'}}>
            {v.address.slice(0,6)}...{v.address.slice(-4)} <ExternalLink size={10} />
          </a>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <span style={{fontSize:11,color:'#888'}}>Standard</span>
          <span style={{fontSize:11,color:'#080808',fontWeight:600}}>ERC-4626</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:11,color:'#888'}}>Chain</span>
          <span style={{fontSize:11,color:'#080808',fontWeight:600}}>Base (8453)</span>
        </div>
      </div>

      {/* YoGoals Contract */}
      <SectionLabel>YOGOALS CONTRACT</SectionLabel>
      <div style={{background:COLORS.white,border:'1.5px solid #080808',borderRadius:12,padding:14,marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <span style={{fontSize:11,color:'#888'}}>YoGoals</span>
          <a href={contractBasescan} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:COLORS.info,fontWeight:600,display:'flex',alignItems:'center',gap:4,textDecoration:'none'}}>
            {contractShort} <ExternalLink size={10} />
          </a>
        </div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:11,color:'#888'}}>Status</span>
          <span style={{fontSize:11,color:COLORS.success,fontWeight:700}}>Verified</span>
        </div>
      </div>

      <div style={{padding:'10px 14px',background:COLORS.white,border:'1px solid #D9D9D9',borderRadius:10,fontSize:10,color:'#888',lineHeight:1.4,display:'flex',alignItems:'flex-start',gap:8}}>
        <Shield size={14} color="#888" style={{flexShrink:0,marginTop:1}} />
        <span>YO Protocol rebalances this vault daily. No deposit or withdrawal fees. Redemptions may pend up to 24h if liquidity is low.</span>
      </div>
    </div>
    <BottomNav />
  </>);
}
