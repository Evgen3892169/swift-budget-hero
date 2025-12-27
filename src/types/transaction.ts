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
}

export interface Settings {
  currency: string;
  regularIncomes: RegularPayment[];
  regularExpenses: RegularPayment[];
}

export interface MonthData {
  month: number;
  year: number;
  transactions: Transaction[];
}
