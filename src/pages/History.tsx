import { useState, useMemo, useEffect } from 'react';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { TransactionItem } from '@/components/TransactionItem';
import { MonthNavigator } from '@/components/MonthNavigator';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner, TransactionLoadingSkeleton } from '@/components/LoadingSpinner';
import { DatePickerPopover } from '@/components/DatePickerPopover';
import { CalendarDays, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const History = () => {
  const { telegramUserId, isLoading: isUserLoading } = useTelegramUser();
  
  const {
    transactions,
    settings,
    currentDate,
    isLoading,
    isInitialized,
    goToPreviousMonth,
    goToNextMonth,
    getMonthName,
    deleteTransaction,
    currentMonth,
    currentYear,
    setTelegramUserId,
  } = useTransactionsContext();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Set telegram user ID in context
  useEffect(() => {
    if (telegramUserId) {
      setTelegramUserId(telegramUserId);
    }
  }, [telegramUserId, setTelegramUserId]);

  const isPageLoading = isUserLoading || (isLoading && !isInitialized);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    // If a specific date is selected, filter to that date
    if (selectedDate) {
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date.toDateString() === selectedDate.toDateString();
      });
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentMonth, currentYear, selectedDate]);

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

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" text="Завантаження історії..." />
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Історія операцій</h1>
        </div>
        
        <MonthNavigator
          monthName={getMonthName(currentDate)}
          currentDate={currentDate}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
          onDateSelect={setSelectedDate}
        />

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <DatePickerPopover
            date={selectedDate}
            onDateChange={setSelectedDate}
            placeholder="Фільтр по даті"
            className="flex-1"
          />
          {selectedDate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(undefined)}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!isInitialized ? (
          <div className="bg-card rounded-lg p-4 space-y-2">
            <LoadingSpinner size="sm" text="Завантаження транзакцій..." />
            <TransactionLoadingSkeleton />
            <TransactionLoadingSkeleton />
            <TransactionLoadingSkeleton />
          </div>
        ) : Object.keys(groupedTransactions).length === 0 ? (
          <div className="bg-card rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              {selectedDate ? 'Немає операцій за вибрану дату' : 'Немає операцій за цей місяць'}
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

      <BottomNav />
    </div>
  );
};

export default History;
