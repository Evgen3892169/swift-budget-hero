import { useState, useMemo, useEffect } from 'react';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { TransactionItem } from '@/components/TransactionItem';
import { MonthNavigator } from '@/components/MonthNavigator';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner, TransactionLoadingSkeleton } from '@/components/LoadingSpinner';
import { DatePickerPopover } from '@/components/DatePickerPopover';
import { X, List } from 'lucide-react';
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
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    if (telegramUserId) {
      setTelegramUserId(telegramUserId);
    }
  }, [telegramUserId, setTelegramUserId]);

  const isPageLoading = isUserLoading || (isLoading && !isInitialized);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    
    if (!showAllHistory) {
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
    }
    
    if (startDate || endDate) {
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        if (startDate && date < startDate) return false;
        if (endDate && date > endDate) return false;
        return true;
      });
    }
 
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentMonth, currentYear, startDate, endDate, showAllHistory]);

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
        <LoadingSpinner size="lg" text="Завантаження..." />
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
    <div className="min-h-screen bg-background pb-28">
      <div className="p-4 space-y-5 max-w-lg mx-auto">
        <header className="pt-3">
          <h1 className="text-xl font-bold text-foreground tracking-tight">Історія</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Всі операції</p>
        </header>
        
        {!showAllHistory && (
          <MonthNavigator
            monthName={getMonthName(currentDate)}
            onPrevious={goToPreviousMonth}
            onNext={goToNextMonth}
          />
        )}

        {/* Filters */}
        <div className="flex items-center gap-2">
          <DatePickerPopover
            date={startDate}
            onDateChange={setStartDate}
            placeholder="З дати"
            className="flex-1"
          />
          <DatePickerPopover
            date={endDate}
            onDateChange={setEndDate}
            placeholder="По дату"
            className="flex-1"
          />
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setStartDate(undefined);
                setEndDate(undefined);
              }}
              className="shrink-0 rounded-xl h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant={showAllHistory ? "default" : "outline"}
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="shrink-0 rounded-xl gap-2 h-10"
          >
            <List className="h-4 w-4" />
            <span className="text-xs">{showAllHistory ? 'Місяць' : 'Все'}</span>
          </Button>
        </div>

        {!isInitialized ? (
          <div className="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
            <LoadingSpinner size="sm" text="Завантаження..." />
            <TransactionLoadingSkeleton />
            <TransactionLoadingSkeleton />
            <TransactionLoadingSkeleton />
          </div>
        ) : Object.keys(groupedTransactions).length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center border border-border/50">
            <p className="text-muted-foreground text-sm">
              {showAllHistory ? 'Немає операцій' : 'Немає операцій за місяць'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
              <div key={date} className="bg-card rounded-2xl p-4 border border-border/50">
                <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  {date}
                </h3>
                <div className="space-y-1">
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
