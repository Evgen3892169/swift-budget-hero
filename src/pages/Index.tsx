import { useEffect } from 'react';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { MonthNavigator } from '@/components/MonthNavigator';
import { BalanceCard } from '@/components/BalanceCard';
import { StatsCard } from '@/components/StatsCard';
import { RecentTransactions } from '@/components/RecentTransactions';
import { MiniChart } from '@/components/MiniChart';
import { BottomNav } from '@/components/BottomNav';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { telegramUserId, isLoading: isUserLoading } = useTelegramUser();
  
  const {
    transactions,
    monthTransactions,
    monthlyStats,
    settings,
    currentDate,
    isLoading,
    isSyncing,
    isInitialized,
    syncTransactions,
    goToPreviousMonth,
    goToNextMonth,
    getMonthName,
    setTelegramUserId,
    currentMonth,
    currentYear,
  } = useTransactionsContext();

  useEffect(() => {
    if (telegramUserId) {
      setTelegramUserId(telegramUserId);
    }
  }, [telegramUserId, setTelegramUserId]);

  const isPageLoading = isUserLoading;
  const isDataLoading = isLoading || (isSyncing && !isInitialized);

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Завантаження...</p>
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
        {/* Header with Sync Button */}
        <header className="pt-2 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Мої фінанси</h1>
            <p className="text-xs text-muted-foreground">Контроль бюджету</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => syncTransactions()}
            disabled={isSyncing}
            className="relative rounded-xl hover:bg-secondary"
          >
            <RefreshCw className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            )}
          </Button>
        </header>

        {/* Syncing Indicator */}
        {isSyncing && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3 animate-fade-in">
            <div className="relative">
              <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
            <span className="text-sm text-primary font-medium">Оновлення даних...</span>
          </div>
        )}

        {/* Month Navigation */}
        <MonthNavigator
          monthName={getMonthName(currentDate)}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
        />

        {/* Balance Card */}
        <BalanceCard
          balance={monthlyStats.balance}
          monthName={getMonthName(currentDate)}
          currency={settings.currency}
          isLoading={isDataLoading}
        />

        {/* Stats */}
        <StatsCard
          income={monthlyStats.income}
          expense={monthlyStats.expense}
          currency={settings.currency}
          isLoading={isDataLoading}
        />

        {/* Mini Analytics Chart */}
        <div className="bg-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Динаміка за місяць</h3>
          </div>
          <MiniChart
            transactions={transactions}
            currentMonth={currentMonth}
            currentYear={currentYear}
            currency={settings.currency}
          />
          <div className="flex items-center justify-center gap-6 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-income"></div>
              <span className="text-muted-foreground">Доходи</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-expense"></div>
              <span className="text-muted-foreground">Витрати</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <RecentTransactions
          transactions={monthTransactions}
          currency={settings.currency}
          isLoading={isDataLoading}
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
