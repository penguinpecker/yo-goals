export const CHAIN_ID = 8453;

export const YO_VAULTS: Record<string, {
  address: `0x${string}`; asset: string; assetAddress: `0x${string}`;
  decimals: number; color: string; apy: number; tvl: string; risk: string; desc: string;
  pools: { name: string; chain: string; pct: number; risk: string }[];
  chart: number[];
}> = {
  yoETH: {
    address: '0x3a43aec53490cb9fa922847385d82fe25d0e9de7',
    asset: 'WETH', assetAddress: '0x4200000000000000000000000000000000000006',
    decimals: 18, color: '#938EF2', apy: 13.2, tvl: '$14M', risk: 'B',
    desc: 'ETH yield optimizer',
    pools: [
      { name: 'Lido stETH', chain: 'Ethereum', pct: 40, risk: 'Low' },
      { name: 'Pendle PT-weETH', chain: 'Arbitrum', pct: 30, risk: 'Moderate' },
      { name: 'Morpho ETH/USDC', chain: 'Base', pct: 20, risk: 'Low' },
      { name: 'Idle (Reserve)', chain: 'Base', pct: 10, risk: 'Idle' },
    ],
    chart: [55,60,58,65,62,70,68,72,75,70,78,76],
  },
  yoBTC: {
    address: '0xbCbc8cb4D1e8ED048a6276a5E94A3e952660BcbC',
    asset: 'cbBTC', assetAddress: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    decimals: 8, color: '#F59E0B', apy: 1.4, tvl: '$9M', risk: 'B',
    desc: 'Bitcoin yield optimizer',
    pools: [
      { name: 'Morpho cbBTC/USDC', chain: 'Base', pct: 50, risk: 'Low' },
      { name: 'Balancer Stable', chain: 'Base', pct: 35, risk: 'Low' },
      { name: 'Idle (Reserve)', chain: 'Base', pct: 15, risk: 'Idle' },
    ],
    chart: [40,42,38,45,43,48,44,46,50,47,52,48],
  },
  yoGOLD: {
    address: '0x0000000000000000000000000000000000000000',
    asset: 'XAUT', assetAddress: '0x0000000000000000000000000000000000000000',
    decimals: 6, color: '#6C9700', apy: 11.1, tvl: '$4M', risk: 'B',
    desc: 'Gold-backed yield',
    pools: [
      { name: 'Morpho XAUT Pool', chain: 'Ethereum', pct: 55, risk: 'Low' },
      { name: 'Reserve Pool', chain: 'Ethereum', pct: 30, risk: 'Low' },
      { name: 'Idle (Reserve)', chain: 'Ethereum', pct: 15, risk: 'Idle' },
    ],
    chart: [45,48,50,52,48,55,53,58,56,60,58,55],
  },
};

export type VaultId = keyof typeof YO_VAULTS;
export const VAULT_IDS = Object.keys(YO_VAULTS);
export const YO_GATEWAY = '0xF1EeE0957267b1A474323Ff9CfF7719E964969FA' as `0x${string}`;
export const YO_GOALS_CONTRACT = (process.env.NEXT_PUBLIC_YOGOALS_CONTRACT || '') as `0x${string}`;
export const FEE_BPS = 1000;
export const BPS_DENOMINATOR = 10000;
