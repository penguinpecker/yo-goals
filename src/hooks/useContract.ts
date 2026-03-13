import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { YOGOALS_ABI, ERC20_ABI } from '@/lib/abi';
import { YO_VAULTS, VaultId, YO_GOALS_CONTRACT } from '@/constants/contracts';

const CONTRACT = YO_GOALS_CONTRACT;

// ─── READ HOOKS ──────────────────────────────────────────────

export function useGoalDetails(goalId: number) {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACT,
    abi: YOGOALS_ABI,
    functionName: 'getGoalDetails',
    args: address ? [address, BigInt(goalId)] : undefined,
    query: { enabled: !!address && !!CONTRACT },
  });
}

export function useGoalCurrentValue(goalId: number) {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACT,
    abi: YOGOALS_ABI,
    functionName: 'getGoalCurrentValue',
    args: address ? [address, BigInt(goalId)] : undefined,
    query: { enabled: !!address && !!CONTRACT },
  });
}

export function useGoalProfit(goalId: number) {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACT,
    abi: YOGOALS_ABI,
    functionName: 'getGoalProfit',
    args: address ? [address, BigInt(goalId)] : undefined,
    query: { enabled: !!address && !!CONTRACT },
  });
}

export function useGoalFeePreview(goalId: number) {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACT,
    abi: YOGOALS_ABI,
    functionName: 'getGoalFeePreview',
    args: address ? [address, BigInt(goalId)] : undefined,
    query: { enabled: !!address && !!CONTRACT },
  });
}

export function useGoalAllocation(goalId: number, index: number) {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACT,
    abi: YOGOALS_ABI,
    functionName: 'getGoalAllocation',
    args: address ? [address, BigInt(goalId), BigInt(index)] : undefined,
    query: { enabled: !!address && !!CONTRACT },
  });
}

export function useUserGoalIds() {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACT,
    abi: YOGOALS_ABI,
    functionName: 'getUserGoalIds',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!CONTRACT },
  });
}

export function useTokenBalance(token: `0x${string}`) {
  const { address } = useAccount();
  return useReadContract({
    address: token,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useTokenAllowance(token: `0x${string}`, spender: `0x${string}`) {
  const { address } = useAccount();
  return useReadContract({
    address: token,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, spender] : undefined,
    query: { enabled: !!address },
  });
}

// ─── WRITE HOOKS ─────────────────────────────────────────────

export function useCreateGoal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createGoal = (params: {
    name: string;
    targetAmount: bigint;
    deadline: number;
    riskLevel: number;
    depositAsset: `0x${string}`;
    vaults: `0x${string}`[];
    weights: number[];
  }) => {
    writeContract({
      address: CONTRACT,
      abi: YOGOALS_ABI,
      functionName: 'createGoal',
      args: [
        params.name,
        params.targetAmount,
        BigInt(params.deadline),
        params.riskLevel,
        params.depositAsset,
        params.vaults,
        params.weights,
      ],
    });
  };

  return { createGoal, hash, isPending, isConfirming, isSuccess, error };
}

export function useDeposit() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const deposit = (goalId: number, amount: bigint) => {
    writeContract({
      address: CONTRACT,
      abi: YOGOALS_ABI,
      functionName: 'deposit',
      args: [BigInt(goalId), amount],
    });
  };

  return { deposit, hash, isPending, isConfirming, isSuccess, error };
}

export function useWithdraw() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const withdraw = (goalId: number) => {
    writeContract({
      address: CONTRACT,
      abi: YOGOALS_ABI,
      functionName: 'withdraw',
      args: [BigInt(goalId)],
    });
  };

  return { withdraw, hash, isPending, isConfirming, isSuccess, error };
}

export function useWithdrawPartial() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const withdrawPartial = (goalId: number, percentBps: number) => {
    writeContract({
      address: CONTRACT,
      abi: YOGOALS_ABI,
      functionName: 'withdrawPartial',
      args: [BigInt(goalId), percentBps],
    });
  };

  return { withdrawPartial, hash, isPending, isConfirming, isSuccess, error };
}

export function useRebalance() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const rebalance = (goalId: number, vaults: `0x${string}`[], weights: number[]) => {
    writeContract({
      address: CONTRACT,
      abi: YOGOALS_ABI,
      functionName: 'rebalance',
      args: [BigInt(goalId), vaults, weights],
    });
  };

  return { rebalance, hash, isPending, isConfirming, isSuccess, error };
}

export function useApproveToken() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (token: `0x${string}`, spender: `0x${string}`, amount: bigint) => {
    writeContract({
      address: token,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

// ─── HELPERS ─────────────────────────────────────────────────

export function vaultAddressToId(address: string): VaultId | null {
  const lower = address.toLowerCase();
  for (const [id, config] of Object.entries(YO_VAULTS)) {
    if (config.address.toLowerCase() === lower) return id as VaultId;
  }
  return null;
}

export function formatVaultAmount(amount: bigint, vault: VaultId): string {
  return formatUnits(amount, YO_VAULTS[vault].decimals);
}

export function parseVaultAmount(amount: string, vault: VaultId): bigint {
  return parseUnits(amount, YO_VAULTS[vault].decimals);
}
