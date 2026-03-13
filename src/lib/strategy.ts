// ─── STRATEGY ENGINE ─────────────────────────────────────────
// Generates optimal multi-vault allocations based on goal parameters
// Called internally (free for app users) and via x402 API (paid for agents)

import { VaultId, YO_VAULTS, STRATEGY_PRESETS } from '@/constants/contracts';
import { RiskLevel } from '@/constants/theme';

export interface VaultData {
  id: VaultId;
  apy: number;
  tvl: number;
  risk: string;
}

export interface StrategyAllocation {
  vault: VaultId;
  weight: number; // basis points
  apy: number;
  color: string;
}

export interface Strategy {
  allocations: StrategyAllocation[];
  blendedApy: number;
  riskProfile: string;
  reasoning: string;
}

// Current vault APYs (in production, fetch from YO API)
// These are live numbers from Exponential.fi as of research
const CURRENT_APYS: Record<VaultId, number> = {
  yoUSD: 18.4,
  yoETH: 13.2,
  yoBTC: 1.4,
};

export function generateStrategy(params: {
  riskLevel: RiskLevel;
  depositAsset: 'USD' | 'ETH' | 'BTC';
  targetAmount: number;
  deadlineMonths: number;
}): Strategy {
  const { riskLevel, depositAsset, deadlineMonths } = params;

  // If very short timeline (< 3 months), override to conservative regardless
  const effectiveRisk = deadlineMonths < 3 ? 0 : riskLevel;

  // Get preset allocations for this risk level and asset
  const preset = STRATEGY_PRESETS[effectiveRisk][depositAsset];

  // Build allocations with current APY data
  const allocations: StrategyAllocation[] = preset.map(p => ({
    vault: p.vault,
    weight: p.weight,
    apy: CURRENT_APYS[p.vault],
    color: YO_VAULTS[p.vault].color,
  }));

  // Calculate blended APY
  const blendedApy = allocations.reduce(
    (sum, a) => sum + (a.apy * a.weight) / 10000,
    0
  );

  // Risk profile label
  const riskLabels = ['Conservative', 'Balanced', 'Growth'];

  // Generate reasoning
  const reasoning = generateReasoning(effectiveRisk, depositAsset, deadlineMonths, allocations, blendedApy);

  return {
    allocations,
    blendedApy: Math.round(blendedApy * 10) / 10,
    riskProfile: riskLabels[effectiveRisk],
    reasoning,
  };
}

function generateReasoning(
  risk: number,
  asset: string,
  months: number,
  allocs: StrategyAllocation[],
  blendedApy: number
): string {
  const vaultNames = allocs.map(a => `${a.vault} (${a.weight / 100}%)`).join(', ');

  if (risk === 0) {
    return `Conservative strategy for your ${months}-month horizon. ` +
      `Allocated across ${vaultNames}. ` +
      `Prioritizes capital preservation with ${blendedApy.toFixed(1)}% blended APY. ` +
      `Minimal volatility exposure.`;
  }

  if (risk === 1) {
    return `Balanced strategy splitting across ${allocs.length} vaults: ${vaultNames}. ` +
      `Blended APY of ${blendedApy.toFixed(1)}% optimized for your ${months}-month timeline. ` +
      `Core stablecoin position with measured growth exposure.`;
  }

  return `Growth strategy with higher crypto exposure: ${vaultNames}. ` +
    `${blendedApy.toFixed(1)}% blended APY targets maximum yield for your ${months}-month horizon. ` +
    `Accepts higher short-term volatility for long-term upside.`;
}

// ─── REBALANCING ADVISOR ─────────────────────────────────────

export interface RebalanceAdvice {
  shouldRebalance: boolean;
  suggestion: string;
  newAllocations?: StrategyAllocation[];
  impactDescription: string;
}

export function analyzeRebalance(
  currentAllocations: StrategyAllocation[],
  riskLevel: RiskLevel,
  deadlineMonths: number,
): RebalanceAdvice {
  // Check if any vault's APY has shifted significantly
  const deviations = currentAllocations.map(a => {
    const currentApy = CURRENT_APYS[a.vault];
    const diff = Math.abs(currentApy - a.apy);
    return { vault: a.vault, diff, currentApy, oldApy: a.apy };
  });

  const significantShift = deviations.find(d => d.diff > 2.0); // > 2% APY change

  if (!significantShift) {
    return {
      shouldRebalance: false,
      suggestion: 'Your current allocation is still optimal. No rebalancing needed.',
      impactDescription: 'Strategy performing within expected parameters.',
    };
  }

  // Generate new strategy with current data
  const newStrategy = generateStrategy({
    riskLevel,
    depositAsset: 'USD', // Simplified — expand for multi-asset
    targetAmount: 0,
    deadlineMonths,
  });

  return {
    shouldRebalance: true,
    suggestion: `${significantShift.vault} APY shifted from ${significantShift.oldApy}% to ${significantShift.currentApy}%. ` +
      `Recommend rebalancing to optimize yield.`,
    newAllocations: newStrategy.allocations,
    impactDescription: `New blended APY: ${newStrategy.blendedApy}%. ` +
      `Optimized for your remaining ${deadlineMonths}-month timeline.`,
  };
}
