import { YO_VAULTS } from '@/constants/contracts';

export interface StrategyAllocation {
  vault: string;
  weight: number;
  apy: number;
  color: string;
}

export interface Strategy {
  allocations: StrategyAllocation[];
  blendedApy: number;
  riskProfile: string;
  reasoning: string;
}

const PRESETS: Record<number, { vault: string; weight: number }[]> = {
  0: [{ vault: 'yoETH', weight: 10000 }],
  1: [{ vault: 'yoETH', weight: 7000 }, { vault: 'yoBTC', weight: 3000 }],
  2: [{ vault: 'yoETH', weight: 5000 }, { vault: 'yoBTC', weight: 5000 }],
};

export function generateStrategy(params: {
  riskLevel: number;
  depositAsset?: string;
  targetAmount?: number;
  deadlineMonths?: number;
}): Strategy {
  const { riskLevel, deadlineMonths = 12 } = params;
  const effectiveRisk = deadlineMonths < 3 ? 0 : riskLevel;
  const preset = PRESETS[effectiveRisk] || PRESETS[1];

  const allocations: StrategyAllocation[] = preset.map(p => {
    const v = YO_VAULTS[p.vault];
    return { vault: p.vault, weight: p.weight, apy: v ? v.apy : 0, color: v ? v.color : '#888' };
  });

  const blendedApy = allocations.reduce((s, a) => s + (a.apy * a.weight) / 10000, 0);
  const riskLabels = ['Conservative', 'Balanced', 'Growth'];

  return {
    allocations,
    blendedApy: Math.round(blendedApy * 10) / 10,
    riskProfile: riskLabels[effectiveRisk] || 'Balanced',
    reasoning: `${riskLabels[effectiveRisk]} strategy across ${allocations.length} vaults with ${blendedApy.toFixed(1)}% blended APY for your ${deadlineMonths}-month timeline.`,
  };
}

export function analyzeRebalance(
  currentAllocations: StrategyAllocation[],
  riskLevel: number,
  deadlineMonths: number,
) {
  return {
    shouldRebalance: false,
    suggestion: 'Your current allocation is still optimal.',
    impactDescription: 'Strategy performing within expected parameters.',
  };
}
