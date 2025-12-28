export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  isRegular?: boolean;
}

export interface RegularPayment {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  dayOfMonth?: number; // Day of month when payment is applied (1-31)
}

export interface Settings {
  currency: string;
  regularIncomes: RegularPayment[];
  regularExpenses: RegularPayment[];
  familyUserId?: string;
}

export interface MonthData {
  month: number;
  year: number;
  transactions: Transaction[];
}
