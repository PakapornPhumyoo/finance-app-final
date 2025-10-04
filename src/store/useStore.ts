// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget, UserProfile, FinancialSummary, BudgetStatus } from '../types';

interface AppState {
  // User state
  user: UserProfile;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Transaction state
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  getFinancialSummary: () => FinancialSummary;

  // Budget state
  budgets: Budget[];
  setBudget: (category: string, limit: number) => void;
  deleteBudget: (category: string) => void;
  getBudgetStatus: () => BudgetStatus[];
  checkBudgetAlerts: () => string[];
}

const defaultUser: UserProfile = {
  username: 'moowan06',
  firstName: 'Moo',
  lastName: 'Wan',
  email: 'moowan@example.com',
  joinDate: '2024-01-01',
};

const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: defaultUser,
      isLoggedIn: false,
      login: (username: string, password: string) => {
        const state = get();
        if (username === state.user.username && password === '220506') {
          set({ isLoggedIn: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isLoggedIn: false }),
      updateProfile: (profile: Partial<UserProfile>) =>
        set((state) => ({
          user: { ...state.user, ...profile },
        })),

      // Transaction state
      transactions: [
        {
          id: '1',
          type: 'expense',
          category: 'อาหาร',
          amount: 150,
          date: new Date().toISOString().split('T')[0],
          description: 'อาหารเย็น',
        },
        {
          id: '2',
          type: 'expense',
          category: 'เดินทาง',
          amount: 80,
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          description: 'ค่าแท็กซี่',
        },
        {
          id: '3',
          type: 'income',
          category: 'เงินเดือน',
          amount: 30000,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: '4',
          type: 'expense',
          category: 'ค่าเช่า',
          amount: 8000,
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        },
        {
          id: '5',
          type: 'expense',
          category: 'บิล',
          amount: 2500,
          date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
          description: 'ค่าไฟ',
        },
      ],

      addTransaction: (transactionData: Omit<Transaction, 'id'>) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            {
              ...transactionData,
              id: Date.now().toString(),
            },
          ],
        })),

      updateTransaction: (id: string, updatedTransaction: Omit<Transaction, 'id'>) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...updatedTransaction, id } : t
          ),
        })),

      deleteTransaction: (id: string) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      getFinancialSummary: () => {
        const state = get();
        const totalIncome = state.transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = state.transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
        };
      },

      // Budget state
      budgets: [
        { category: 'อาหาร', limit: 3000 },
        { category: 'เดินทาง', limit: 2000 },
        { category: 'ค่าเช่า', limit: 8000 },
        { category: 'บิล', limit: 3000 },
      ],

      setBudget: (category: string, limit: number) =>
        set((state) => {
          const existing = state.budgets.find((b) => b.category === category);
          if (existing) {
            return {
              budgets: state.budgets.map((b) =>
                b.category === category ? { category, limit } : b
              ),
            };
          } else {
            return { budgets: [...state.budgets, { category, limit }] };
          }
        }),

      deleteBudget: (category: string) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.category !== category),
        })),

      getBudgetStatus: () => {
        const state = get();
        const { transactions, budgets } = state;
        return budgets.map((budget) => {
          const spent = transactions
            .filter((t) => t.type === 'expense' && t.category === budget.category)
            .reduce((sum, t) => sum + t.amount, 0);
          return {
            category: budget.category,
            spent,
            limit: budget.limit,
            status: spent > budget.limit ? 'over' : 'under',
          };
        });
      },

      checkBudgetAlerts: () => {
        const state = get();
        const budgetStatus = state.getBudgetStatus();
        const alerts: string[] = [];
        budgetStatus.forEach((budget) => {
          if (budget.status === 'over') {
            alerts.push(`⚠️ เกินงบประมาณในหมวดหมู่ "${budget.category}" ใช้ไป ${budget.spent.toLocaleString()} บาท จากงบ ${budget.limit.toLocaleString()} บาท`);
          } else if (budget.spent / budget.limit > 0.8) {
            alerts.push(`🔔 ใกล้เกินงบประมาณในหมวดหมู่ "${budget.category}" ใช้ไป ${((budget.spent / budget.limit) * 100).toFixed(1)}%`);
          }
        });
        return alerts;
      },
    }),
    {
      name: 'finance-storage',
    }
  )
);

export default useStore;