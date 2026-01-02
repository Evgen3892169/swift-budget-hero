import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { Transaction, Settings, RegularPayment } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';

const SETTINGS_KEY = 'expense-tracker-settings';

const defaultSettings: Settings = {
  currency: 'грн',
  regularIncomes: [],
  regularExpenses: [],
  categories: [],
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
        // On error, keep current transactions and settings
      } else if (syncData) {
        const rawTransactions = Array.isArray(syncData.transactions)
          ? syncData.transactions
          : [];

        console.log('Synced transactions count:', rawTransactions.length);

        // Replace ALL transactions with what we got from n8n - no database storage
        const appTransactions: Transaction[] = rawTransactions.map((t: any) => ({
          id: t.id || crypto.randomUUID(),
          type: t.type as 'income' | 'expense',
          amount: Number(t.amount),
          description: t.description || t.category || '',
          date: t.transaction_date || t.date || new Date().toISOString(),
          category: t.category || undefined,
        }));
        setTransactions(appTransactions);

        // Optional settings coming from webhook: categories, regular payments, family budget
        setSettings(() => {
          const raw = syncData as any;

          const categories = Array.isArray(raw.categories)
            ? raw.categories.map((c: any) => String(c))
            : [];

          const mapRegular = (
            items: any[] | undefined | null,
            fallbackType: 'income' | 'expense'
          ): RegularPayment[] => {
            if (!items || !Array.isArray(items)) return [];
            return items
              .map((item: any) => {
                const amount = Number(
                  item.amount ?? item.money ?? item['сума'] ?? item['amount']
                );
                if (!amount || isNaN(amount)) return null;

                const dayOfMonthRaw =
                  item.dayOfMonth ??
                  item.day_of_month ??
                  item['день'] ??
                  item['day'] ??
                  item['число'] ??
                  item.date ??
                  item['дата'];

                let dayOfMonth: number | undefined;
                if (typeof dayOfMonthRaw === 'number') {
                  dayOfMonth = dayOfMonthRaw;
                } else if (dayOfMonthRaw) {
                  // Try to parse from string or date
                  const asNumber = Number(dayOfMonthRaw);
                  if (!isNaN(asNumber) && asNumber > 0 && asNumber <= 31) {
                    dayOfMonth = asNumber;
                  } else {
                    const parsed = new Date(dayOfMonthRaw);
                    const day = parsed.getDate();
                    if (!isNaN(day)) {
                      dayOfMonth = day;
                    }
                  }
                }

                const createdAtRaw =
                  item.createdAt ??
                  item.created_at ??
                  item.date ??
                  item['дата'] ??
                  item['дата коли поставли '] ??
                  item['дата коли поставили'];

                const createdAt = createdAtRaw ? String(createdAtRaw) : undefined;

                const type: 'income' | 'expense' =
                  item.type === 'income' || item.type === 'expense'
                    ? item.type
                    : fallbackType;

                return {
                  id: item.id || crypto.randomUUID(),
                  type,
                  amount,
                  description:
                    item.description ||
                    item.name ||
                    item.title ||
                    item['назва'] ||
                    item['Назва'] ||
                    item['назва '] ||
                    item['опис'] ||
                    '',
                  dayOfMonth,
                  createdAt,
                } as RegularPayment;
              })
              .filter((p): p is RegularPayment => !!p && p.amount > 0);
          };

          const regularIncomes = mapRegular(
            raw.regularIncomes ?? raw.regular_incomes ?? raw['регулярні_доходи'],
            'income'
          );
          const regularExpenses = mapRegular(
            raw.regularExpenses ?? raw.regular_expenses ?? raw['регулярні_витрати'],
            'expense'
          );

          const familyUserIdRaw =
            raw.familyUserId ?? raw.family_user_id ?? raw['сімейний_кабінет'];

          return {
            currency: 'грн',
            categories,
            regularIncomes,
            regularExpenses,
            familyUserId: familyUserIdRaw ? String(familyUserIdRaw) : undefined,
          } as Settings;
        });

        // --- Extra webhooks: categories + regular payments as single source of truth ---
        let extraCategories: string[] | null = null;
        let extraRegularIncomes: RegularPayment[] | null = null;
        let extraRegularExpenses: RegularPayment[] | null = null;

        // Helper to normalise categories from dedicated webhook
        const parseCategoriesFromWebhook = (data: any): string[] => {
          const rawList = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : [];

          return rawList
            .map((item: any) => {
              if (typeof item === 'string') return item.trim();
              const name =
                item?.category ??
                item?.['категория'] ??
                item?.['Категорія'] ??
                item?.['Категорія '];
              return name ? String(name).trim() : '';
            })
            .filter((c: string) => c.length > 0);
        };

        // Helper to normalise regular payments from dedicated webhook
        const parseRegularsFromWebhook = (
          data: any
        ): { incomes: RegularPayment[]; expenses: RegularPayment[] } => {
          const rawList = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : [];

          const incomes: RegularPayment[] = [];
          const expenses: RegularPayment[] = [];

          rawList.forEach((item: any, index: number) => {
            const rawAmount =
              item.amount ?? item.money ?? item['сума'] ?? item['сума '];
            const amount = Number(rawAmount);
            if (!amount || isNaN(amount)) return;

            const rawType = (item.type ?? item['тип'] ?? '').toString().toLowerCase();
            let type: 'income' | 'expense';

            if (rawType === 'income') {
              type = 'income';
            } else if (rawType === 'expense') {
              type = 'expense';
            } else {
              const isExpense =
                rawType.includes('розход') ||
                rawType.includes('витрат') ||
                amount < 0;
              type = isExpense ? 'expense' : 'income';
            }

            const dayRaw =
              item.dayOfMonth ??
              item.day_of_month ??
              item['день'] ??
              item['число'] ??
              item.date ??
              item['дата'];
            let dayOfMonth: number | undefined;
            if (typeof dayRaw === 'number') {
              dayOfMonth = dayRaw;
            } else if (dayRaw) {
              const asNumber = Number(dayRaw);
              if (!isNaN(asNumber) && asNumber > 0 && asNumber <= 31) {
                dayOfMonth = asNumber;
              } else {
                const parsed = new Date(dayRaw);
                const day = parsed.getDate();
                if (!isNaN(day)) {
                  dayOfMonth = day;
                }
              }
            }

            const createdAtRaw =
              item.createdAt ??
              item.created_at ??
              item.date ??
              item['дата'] ??
              item['дата коли поставли '] ??
              item['дата коли поставили'];

            const createdAt = createdAtRaw ? String(createdAtRaw) : undefined;

            const payment: RegularPayment = {
              id:
                item.id ||
                `reg-${type}-${index}-${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2, 7)}`,
              type,
              amount: Math.abs(amount),
              description:
                item.description ||
                item.name ||
                item.title ||
                item['назва'] ||
                item['Назва'] ||
                item['назва '] ||
                item['опис'] ||
                item['Категорія'] ||
                '',
              dayOfMonth,
              createdAt,
            };

            if (type === 'income') incomes.push(payment);
            else expenses.push(payment);
          });

          return { incomes, expenses };
        };

        try {
          // 1. Categories webhook
          const categoriesResp = await fetch(
            'https://shinespiceclover.app.n8n.cloud/webhook/e40b9a22-f95d-428e-8c80-b9e47192b124',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: telegramUserId }),
            }
          );

          if (categoriesResp.ok) {
            const categoriesJson = await categoriesResp.json();
            extraCategories = parseCategoriesFromWebhook(categoriesJson);
            console.log('Loaded categories from dedicated webhook:', extraCategories);
          } else {
            console.warn('Categories webhook returned non-OK status');
          }
        } catch (e) {
          console.error('Error loading categories from webhook:', e);
        }

        try {
          // 2. Regular payments webhook
          const regularResp = await fetch(
            'https://shinespiceclover.app.n8n.cloud/webhook/0e884f09-4ba5-4049-9605-916d80181c50',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: telegramUserId }),
            }
          );

          if (regularResp.ok) {
            const regularJson = await regularResp.json();
            const { incomes, expenses } = parseRegularsFromWebhook(regularJson);
            extraRegularIncomes = incomes;
            extraRegularExpenses = expenses;
            console.log('Loaded regulars from dedicated webhook:', {
              incomesCount: incomes.length,
              expensesCount: expenses.length,
            });
          } else {
            console.warn('Regular payments webhook returned non-OK status');
          }
        } catch (e) {
          console.error('Error loading regular payments from webhook:', e);
        }

        // If we successfully loaded extra data, override settings parts with them
        if (
          extraCategories !== null ||
          extraRegularIncomes !== null ||
          extraRegularExpenses !== null
        ) {
          setSettings(prev => ({
            ...prev,
            categories: extraCategories ?? prev.categories,
            regularIncomes: extraRegularIncomes ?? prev.regularIncomes,
            regularExpenses: extraRegularExpenses ?? prev.regularExpenses,
          }));
        }
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
        user_id: telegramUserId,
        type: transaction.type,
        date: transaction.date,
        amount: transaction.amount,
        // legacy fields for backward compatibility
        userid: telegramUserId,
        money: transaction.type === 'expense' ? -transaction.amount : transaction.amount,
        category: transaction.description,
        data: transaction.date,
        action: 'new_transaction',
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

  // Delete transaction - remove from local state and send webhook
  const deleteTransaction = useCallback(async (id: string) => {
    setTransactions(prev => {
      const tx = prev.find(t => t.id === id);

      // fire-and-forget webhook with basic info if we found the transaction
      if (tx && telegramUserId) {
        const webhookData = {
          user_id: telegramUserId,
          type: tx.type,
          date: tx.date,
          amount: tx.amount,
          action: 'delete_transaction',
        };

        try {
          fetch('https://gdgsnbkw.app.n8n.cloud/webhook/4325a91a-d6f2-4445-baed-3103efc663d5', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'no-cors',
            body: JSON.stringify(webhookData),
          }).catch((err) => console.error('Error sending delete webhook:', err));
        } catch (err) {
          console.error('Error preparing delete webhook:', err);
        }
      }

      return prev.filter(t => t.id !== id);
    });
  }, [telegramUserId]);

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
