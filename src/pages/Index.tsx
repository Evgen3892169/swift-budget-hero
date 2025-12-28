import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { MonthNavigator } from '@/components/MonthNavigator';
import { BalanceCard } from '@/components/BalanceCard';
import { StatsCard } from '@/components/StatsCard';
import { RecentTransactions } from '@/components/RecentTransactions';
import { BottomNav } from '@/components/BottomNav';
import { AddTransactionModal } from '@/components/AddTransactionModal';

const Index = () => {
  const { telegramUserId, isLoading: isUserLoading } = useTelegramUser();
  
  const {
    monthTransactions,
    monthlyStats,
    settings,
    currentDate,
    isLoading: isTransactionsLoading,
    goToPreviousMonth,
    goToNextMonth,
    getMonthName,
    addTransaction,
  } = useTransactions(telegramUserId);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isLoading = isUserLoading;
  const isDataLoading = isTransactionsLoading;

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
        {/* Header */}
        <header className="pt-2">
          <h1 className="text-xl font-bold text-foreground">Мої фінанси</h1>
        </header>

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

        {/* Recent Transactions */}
        <RecentTransactions
          transactions={monthTransactions}
          currency={settings.currency}
          isLoading={isDataLoading}
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNav onAddClick={() => setIsAddModalOpen(true)} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addTransaction}
        currency={settings.currency}
      />
    </div>
  );
};

export default Index;