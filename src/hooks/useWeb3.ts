'use client';

import { useCallback, useState } from 'react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { parseUnits, encodeFunctionData } from 'viem';
import { usePrivy } from '@privy-io/react-auth';
import { YO_VAULTS, YO_GOALS_CONTRACT } from '@/constants/contracts';
import { YOGOALS_ABI, ERC20_ABI } from '@/lib/abi';

const CONTRACT = YO_GOALS_CONTRACT;

export function useWeb3() {
  const { user } = usePrivy();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const [txStatus, setTxStatus] = useState<'idle' | 'approving' | 'depositing' | 'withdrawing' | 'creating' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const privyId = user?.id || '';

  const resetTx = useCallback(() => {
    setTxStatus('idle');
    setTxHash(null);
    setTxError(null);
  }, []);

  const syncUser = useCallback(async () => {
    if (!privyId) return;
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privyId,
          walletAddress: address,
          email: user?.email?.address || user?.google?.name || null,
        }),
      });
    } catch (e) { console.error('syncUser error', e); }
  }, [privyId, address, user]);

  const createGoal = useCallback(async (params: {
    name: string;
    targetAmount: string;
    deadline: string;
    riskLevel: number;
    asset: string;
    vaults: string[];
    weights: number[];
  }) => {
    if (!CONTRACT || !address) throw new Error('Not connected');
    setTxStatus('creating');
    setTxError(null);
    try {
      const firstVault = YO_VAULTS[params.vaults[0]];
      const decimals = firstVault?.decimals || 18;
      const assetAddr = firstVault?.assetAddress as `0x${string}`;
      const targetBigInt = parseUnits(params.targetAmount, decimals);
      const deadlineUnix = BigInt(Math.floor(new Date(params.deadline).getTime() / 1000));
      const vaultAddrs = params.vaults.map(v => YO_VAULTS[v]?.address) as `0x${string}`[];

      const hash = await writeContractAsync({
        address: CONTRACT,
        abi: YOGOALS_ABI,
        functionName: 'createGoal',
        args: [params.name, targetBigInt, deadlineUnix, params.riskLevel, assetAddr, vaultAddrs, params.weights],
      });

      setTxHash(hash);
      if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
      setTxStatus('success');

      // Log to supabase
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ privyId, type: 'deposit', amount: 0, txHash: hash, metadata: { action: 'create_goal' } }),
        });
      } catch (_) {}

      return { hash };
    } catch (e: any) {
      setTxError(e?.shortMessage || e?.message || 'Transaction failed');
      setTxStatus('error');
      throw e;
    }
  }, [address, privyId, writeContractAsync, publicClient]);

  const deposit = useCallback(async (params: {
    onchainGoalId: number;
    amount: string;
    vaultId: string;
    goalDbId?: string;
  }) => {
    if (!CONTRACT || !address) throw new Error('Not connected');
    setTxError(null);

    const vault = YO_VAULTS[params.vaultId];
    if (!vault) throw new Error('Unknown vault');
    const amountBigInt = parseUnits(params.amount, vault.decimals);

    try {
      // Step 1: Approve
      setTxStatus('approving');
      const approveHash = await writeContractAsync({
        address: vault.assetAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT, amountBigInt],
      });
      if (publicClient) await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // Step 2: Deposit
      setTxStatus('depositing');
      const depositHash = await writeContractAsync({
        address: CONTRACT,
        abi: YOGOALS_ABI,
        functionName: 'deposit',
        args: [BigInt(params.onchainGoalId), amountBigInt],
      });
      setTxHash(depositHash);
      if (publicClient) await publicClient.waitForTransactionReceipt({ hash: depositHash });
      setTxStatus('success');

      // Log to supabase
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ privyId, goalId: params.goalDbId, type: 'deposit', amount: parseFloat(params.amount), txHash: depositHash }),
        });
      } catch (_) {}

      return { hash: depositHash };
    } catch (e: any) {
      setTxError(e?.shortMessage || e?.message || 'Transaction failed');
      setTxStatus('error');
      throw e;
    }
  }, [address, privyId, writeContractAsync, publicClient]);

  const withdraw = useCallback(async (params: {
    onchainGoalId: number;
    goalDbId?: string;
    currentValue?: number;
  }) => {
    if (!CONTRACT || !address) throw new Error('Not connected');
    setTxError(null);
    setTxStatus('withdrawing');

    try {
      const hash = await writeContractAsync({
        address: CONTRACT,
        abi: YOGOALS_ABI,
        functionName: 'withdraw',
        args: [BigInt(params.onchainGoalId)],
      });
      setTxHash(hash);
      if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
      setTxStatus('success');

      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ privyId, goalId: params.goalDbId, type: 'withdraw', amount: params.currentValue, txHash: hash }),
        });
      } catch (_) {}

      return { hash };
    } catch (e: any) {
      setTxError(e?.shortMessage || e?.message || 'Transaction failed');
      setTxStatus('error');
      throw e;
    }
  }, [address, privyId, writeContractAsync, publicClient]);

  return {
    syncUser, createGoal, deposit, withdraw, resetTx,
    txStatus, txHash, txError,
    address, privyId,
    isConnected: !!address,
    contractAddress: CONTRACT,
  };
}
