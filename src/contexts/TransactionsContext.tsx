import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { Transaction, Settings, RegularPayment } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';

const SETTINGS_KEY = 'expense-tracker-settings';

const defaultSettings: Settings = {
  currency: 'грн',
  regularIncomes: [],
  regularExpenses: [],
};

interface TransactionsContextType {
  transactions: Transaction[];
  settings: Settings;
  currentDate: Date;
  currentMonth: number;
  currentYear: number;
  isLoading: boolean;
  isSyncing: boolean;
  isInitialized: boolean;
  monthTransactions: Transaction[];
  monthlyStats: {
    income: number;
    expense: number;
    balance: number;
    regularIncomeTotal: number;
    regularExpenseTotal: number;
  };
  syncTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<Settings>) => void;
  addRegularPayment: (type: 'income' | 'expense', payment: Omit<RegularPayment, 'id'>) => void;
  deleteRegularPayment: (type: 'income' | 'expense', id: string) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  getMonthName: (date: Date) => string;
  setTelegramUserId: (id: string | null) => void;
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const useTransactionsContext = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactionsContext must be used within TransactionsProvider');
  }
  return context;
};

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsProvider = ({ children }: TransactionsProviderProps) => {
  const [telegramUserId, setTelegramUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync function - only gets data from n8n webhook, no local storage
  const syncTransactions = useCallback(async () => {
    if (!telegramUserId) return;
    
    setIsSyncing(true);
    
    try {
      console.log('Syncing data for user:', telegramUserId);
      
      const { data: syncData, error: syncError } = await supabase.functions.invoke('sync-user-data', {
        body: { telegram_user_id: telegramUserId }
      });

      console.log('Sync response:', syncData, syncError);

      if (syncError) {
        console.error('Error syncing data:', syncError);
        // On error, keep current transactions
      } else if (syncData?.transactions && Array.isArray(syncData.transactions)) {
        console.log('Synced transactions count:', syncData.transactions.length);
        // Replace ALL transactions with what we got from n8n - no database storage
        const appTransactions: Transaction[] = syncData.transactions.map((t: any) => ({
          id: t.id || crypto.randomUUID(),
          type: t.type as 'income' | 'expense',
          amount: Number(t.amount),
          description: t.description || t.category || '',
          date: t.transaction_date || t.date || new Date().toISOString(),
        }));
        setTransactions(appTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsSyncing(false);
      if (!isInitialized) {
        setIsInitialized(true);
        setIsLoading(false);
      }
    }
  }, [telegramUserId, isInitialized]);

  // Initial sync when userId is set
  useEffect(() => {
    if (telegramUserId && !isInitialized) {
      setIsLoading(true);
      syncTransactions();
    }
  }, [telegramUserId, isInitialized, syncTransactions]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error parsing settings:', e);
      }
    }
  }, []);

  // Save settings to localStorage
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

  // Add transaction - send to webhook only, add to local state
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    if (!telegramUserId) {
      console.error('No telegram user ID');
      return;
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };

    // Add to local state immediately
    setTransactions(prev => [newTransaction, ...prev]);

    // Send to webhook for Google Sheets storage
    try {
      const webhookData = {
        userid: telegramUserId,
        money: transaction.type === 'expense' ? -transaction.amount : transaction.amount,
        category: transaction.description,
        data: transaction.date,
        action: 'new_transaction'
      };
      
      console.log('Sending to webhook:', webhookData);
      
      await fetch('https://gdgsnbkw.app.n8n.cloud/webhook/4325a91a-d6f2-4445-baed-3103efc663d5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(webhookData),
      });
      
      console.log('Webhook sent successfully');
    } catch (webhookError) {
      console.error('Error sending to webhook:', webhookError);
    }
  }, [telegramUserId]);

  // Delete transaction - remove from local state only
  const deleteTransaction = useCallback(async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    // TODO: Could send delete event to webhook if needed
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const addRegularPayment = useCallback((type: 'income' | 'expense', payment: Omit<RegularPayment, 'id'>) => {
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
  }, []);

  const deleteRegularPayment = useCallback((type: 'income' | 'expense', id: string) => {
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
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const getMonthName = useCallback((date: Date) => {
    return date.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
  }, []);

  const value: TransactionsContextType = {
    transactions,
    settings,
    currentDate,
    currentMonth,
    currentYear,
    isLoading,
    isSyncing,
    isInitialized,
    monthTransactions,
    monthlyStats,
    syncTransactions,
    addTransaction,
    deleteTransaction,
    updateSettings,
    addRegularPayment,
    deleteRegularPayment,
    goToPreviousMonth,
    goToNextMonth,
    getMonthName,
    setTelegramUserId,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};
