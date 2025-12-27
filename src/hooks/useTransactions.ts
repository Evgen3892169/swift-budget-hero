import { useState, useEffect, useMemo } from 'react';
import { Transaction, Settings, RegularPayment } from '@/types/transaction';

const TRANSACTIONS_KEY = 'expense-tracker-transactions';
const SETTINGS_KEY = 'expense-tracker-settings';

const defaultSettings: Settings = {
  currency: 'грн',
  regularIncomes: [],
  regularExpenses: [],
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Load from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  }, [transactions, currentMonth, currentYear]);

  const monthlyStats = useMemo(() => {
    const regularIncomeTotal = settings.regularIncomes.reduce((sum, r) => sum + r.amount, 0);
    const regularExpenseTotal = settings.regularExpenses.reduce((sum, r) => sum + r.amount, 0);
    
    const transactionIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const transactionExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = regularIncomeTotal + transactionIncome;
    const totalExpense = regularExpenseTotal + transactionExpense;
    const balance = totalIncome - totalExpense;

    return {
      income: totalIncome,
      expense: totalExpense,
      balance,
      regularIncomeTotal,
      regularExpenseTotal,
    };
  }, [monthTransactions, settings]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addRegularPayment = (type: 'income' | 'expense', payment: Omit<RegularPayment, 'id'>) => {
    const newPayment: RegularPayment = {
      ...payment,
      id: crypto.randomUUID(),
    };
    
    if (type === 'income') {
      setSettings(prev => ({
        ...prev,
        regularIncomes: [...prev.regularIncomes, newPayment],
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        regularExpenses: [...prev.regularExpenses, newPayment],
      }));
    }
  };

  const deleteRegularPayment = (type: 'income' | 'expense', id: string) => {
    if (type === 'income') {
      setSettings(prev => ({
        ...prev,
        regularIncomes: prev.regularIncomes.filter(p => p.id !== id),
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        regularExpenses: prev.regularExpenses.filter(p => p.id !== id),
      }));
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
  };

  // Webhook handler for n8n integration
  const addTransactionFromWebhook = (data: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date?: string;
  }) => {
    addTransaction({
      type: data.type,
      amount: data.amount,
      description: data.description,
      date: data.date || new Date().toISOString(),
    });
  };

  return {
    transactions,
    monthTransactions,
    monthlyStats,
    settings,
    currentDate,
    currentMonth,
    currentYear,
    addTransaction,
    deleteTransaction,
    updateSettings,
    addRegularPayment,
    deleteRegularPayment,
    goToPreviousMonth,
    goToNextMonth,
    getMonthName,
    addTransactionFromWebhook,
  };
};
