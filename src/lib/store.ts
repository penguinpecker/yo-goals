import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VaultId } from '@/constants/contracts';
import { GoalType, RiskLevel } from '@/constants/theme';

export interface Allocation {
  vault: VaultId;
  weight: number; // basis points (7000 = 70%)
}

export interface Goal {
  id: string;
  name: string;
  illustration: GoalType;
  targetAmount: number;
  deadline: string; // ISO date
  riskLevel: RiskLevel;
  depositAsset: 'USD' | 'ETH' | 'BTC';
  allocations: Allocation[];
  totalDeposited: number;
  createdAt: string;
  onchainGoalId?: number; // from YoGoals contract
  active: boolean;
}

interface GoalStore {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'active' | 'totalDeposited'>) => string;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  getGoal: (id: string) => Goal | undefined;
  addDeposit: (id: string, amount: number) => void;
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: [],

      addGoal: (goalData) => {
        const id = `goal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const goal: Goal = {
          ...goalData,
          id,
          createdAt: new Date().toISOString(),
          active: true,
          totalDeposited: 0,
        };
        set(state => ({ goals: [...state.goals, goal] }));
        return id;
      },

      updateGoal: (id, updates) => {
        set(state => ({
          goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g),
        }));
      },

      removeGoal: (id) => {
        set(state => ({
          goals: state.goals.map(g => g.id === id ? { ...g, active: false } : g),
        }));
      },

      getGoal: (id) => get().goals.find(g => g.id === id),

      addDeposit: (id, amount) => {
        set(state => ({
          goals: state.goals.map(g =>
            g.id === id ? { ...g, totalDeposited: g.totalDeposited + amount } : g
          ),
        }));
      },
    }),
    {
      name: 'yo-goals-storage',
    }
  )
);
