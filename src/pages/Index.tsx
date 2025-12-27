import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { MonthNavigator } from '@/components/MonthNavigator';
import { BalanceCard } from '@/components/BalanceCard';
import { StatsCard } from '@/components/StatsCard';
import { RecentTransactions } from '@/components/RecentTransactions';
import { BottomNav } from '@/components/BottomNav';
import { AddTransactionModal } from '@/components/AddTransactionModal';

const Index = () => {
  const {
    monthTransactions,
    monthlyStats,
    settings,
    currentDate,
    goToPreviousMonth,
    goToNextMonth,
    getMonthName,
    addTransaction,
  } = useTransactions();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        />

        {/* Stats */}
        <StatsCard
          income={monthlyStats.income}
          expense={monthlyStats.expense}
          currency={settings.currency}
        />

        {/* Recent Transactions */}
        <RecentTransactions
          transactions={monthTransactions}
          currency={settings.currency}
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
