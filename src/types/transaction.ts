export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  category?: string;
  isRegular?: boolean;
}

export interface RegularPayment {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  dayOfMonth?: number; // Day of month when payment is applied (1-31)
  createdAt?: string;  // When this regular payment was created/set
}

export interface Settings {
  currency: string;
  regularIncomes: RegularPayment[];
  regularExpenses: RegularPayment[];
  familyUserId?: string;
  categories?: string[];
}

export interface MonthData {
  month: number;
  year: number;
  transactions: Transaction[];
}
