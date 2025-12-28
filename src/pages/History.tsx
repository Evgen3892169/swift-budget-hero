import { useState, useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { TransactionItem } from '@/components/TransactionItem';
import { MonthNavigator } from '@/components/MonthNavigator';
import { BottomNav } from '@/components/BottomNav';
import { AddTransactionModal } from '@/components/AddTransactionModal';

const History = () => {
  const { telegramUserId, isLoading: isUserLoading } = useTelegramUser();
  
  const {
    transactions,
    settings,
    currentDate,
    isLoading: isTransactionsLoading,
    goToPreviousMonth,
    goToNextMonth,
    getMonthName,
    addTransaction,
    deleteTransaction,
    currentMonth,
    currentYear,
  } = useTransactions(telegramUserId);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isLoading = isUserLoading || isTransactionsLoading;

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentMonth, currentYear]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof filteredTransactions } = {};
    
    filteredTransactions.forEach(t => {
      const dateKey = new Date(t.date).toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(t);
    });
    
    return groups;
  }, [filteredTransactions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Завантаження даних...</p>
        </div>
      </div>
    );
  }

  if (!telegramUserId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Будь ласка, відкрийте додаток через Telegram</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Історія операцій</h1>
        
        <MonthNavigator
          monthName={getMonthName(currentDate)}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
        />

        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="bg-card rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Немає операцій за цей місяць
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
              <div key={date} className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {date}
                </h3>
                <div>
                  {transactions.map(transaction => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      currency={settings.currency}
                      onDelete={deleteTransaction}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav onAddClick={() => setIsAddModalOpen(true)} />
      
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addTransaction}
        currency={settings.currency}
      />
    </div>
  );
};

export default History;