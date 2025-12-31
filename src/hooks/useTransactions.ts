import { useState, useEffect, useMemo } from 'react';
import { Transaction, Settings, RegularPayment } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';

const SETTINGS_KEY = 'expense-tracker-settings';

const defaultSettings: Settings = {
  currency: 'грн',
  regularIncomes: [],
  regularExpenses: [],
  categories: [],
};

interface DbTransaction {
  id: string;
  telegram_user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string | null;
  description: string | null;
  transaction_date: string;
  created_at: string;
}

export const useTransactions = (telegramUserId: string | null) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync function that can be called manually
  const syncTransactions = async (showSyncIndicator = true) => {
    if (!telegramUserId) return;
    
    if (showSyncIndicator) setIsSyncing(true);
    
    try {
      console.log('Syncing data for user:', telegramUserId);
      
      const { data: syncData, error: syncError } = await supabase.functions.invoke('sync-user-data', {
        body: { telegram_user_id: telegramUserId }
      });

      console.log('Sync response:', syncData, syncError);

      if (syncError) {
        console.error('Error syncing data:', syncError);
        // Fall back to just fetching existing transactions
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('telegram_user_id', telegramUserId)
          .order('transaction_date', { ascending: false });

        if (!error && data) {
          const appTransactions = (data as DbTransaction[]).map(t => ({
            id: t.id,
            type: t.type,
            amount: Number(t.amount),
            description: t.description || t.category || '',
            date: t.transaction_date,
          }));
          setTransactions(appTransactions);
        }
      } else if (syncData?.transactions) {
        console.log('Synced transactions count:', syncData.transactions.length);
        console.log('Synced transactions data:', syncData.transactions);
        const appTransactions: Transaction[] = syncData.transactions.map((t: DbTransaction) => ({
          id: t.id,
          type: t.type,
          amount: Number(t.amount),
          description: t.description || t.category || '',
          date: t.transaction_date,
        }));
        setTransactions(appTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  // Initial sync on mount
  useEffect(() => {
    if (telegramUserId) {
      syncTransactions();
    } else {
      setIsLoading(false);
    }
  }, [telegramUserId]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!telegramUserId) return;

    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `telegram_user_id=eq.${telegramUserId}`,
        },
        (payload) => {
          console.log('New transaction received:', payload);
          const t = payload.new as DbTransaction;
          const newTransaction: Transaction = {
            id: t.id,
            type: t.type,
            amount: Number(t.amount),
            description: t.description || t.category || '',
            date: t.transaction_date,
          };
          setTransactions(prev => {
            // Avoid duplicates
            if (prev.some(tx => tx.id === newTransaction.id)) return prev;
            return [newTransaction, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [telegramUserId]);

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

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!telegramUserId) {
      console.error('No telegram user ID');
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        telegram_user_id: telegramUserId,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        transaction_date: transaction.date,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      return;
    }

    console.log('Transaction added:', data);

    // Send to webhook for Google Sheets
    try {
      const webhookData = {
        telegram_user_id: telegramUserId,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        date: transaction.date,
        created_at: new Date().toISOString(),
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
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      return;
    }

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

  return {
    transactions,
    monthTransactions,
    monthlyStats,
    settings,
    currentDate,
    currentMonth,
    currentYear,
    isLoading,
    isSyncing,
    syncTransactions,
    addTransaction,
    deleteTransaction,
    updateSettings,
    addRegularPayment,
    deleteRegularPayment,
    goToPreviousMonth,
    goToNextMonth,
    getMonthName,
  };
};