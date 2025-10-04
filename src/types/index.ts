// src/types/index.ts
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description?: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  joinDate: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface BudgetStatus {
  category: string;
  spent: number;
  limit: number;
  status: 'over' | 'under';
}

export const CATEGORIES = [
  'อาหาร',
  'เดินทาง',
  'ค่าเช่า',
  'บิล',
  'ความบันเทิง',
  'สุขภาพ',
  'การศึกษา',
  'อื่นๆ',
  'เงินเดือน',
  'เงินโบนัส',
  'รายได้เสริม',
] as const;

export type Category = typeof CATEGORIES[number];