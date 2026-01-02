import { useEffect, useMemo, useState } from 'react';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { MonthNavigator } from '@/components/MonthNavigator';
import { BalanceCard } from '@/components/BalanceCard';
import { StatsCard } from '@/components/StatsCard';
import { RecentTransactions } from '@/components/RecentTransactions';
import { BottomNav } from '@/components/BottomNav';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Index = () => {
  const {
    telegramUserId,
    isLoading: isUserLoading
  } = useTelegramUser();
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
    currentYear
  } = useTransactionsContext();
  useEffect(() => {
    if (telegramUserId) {
      setTelegramUserId(telegramUserId);
    }
  }, [telegramUserId, setTelegramUserId]);
  const isPageLoading = isUserLoading;
  const isDataLoading = isLoading || isSyncing && !isInitialized;

  // Діапазони тижнів всередині обраного місяця: 1–7, 8–14, 15–21, 22–28, 29–кінець місяця
  const weekRanges = useMemo(() => {
    const monthIndex = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    const ranges: Array<[number, number]> = [[1, 7], [8, 14], [15, 21], [22, 28]];
    if (daysInMonth > 28) {
      ranges.push([29, daysInMonth]);
    }
    return ranges;
  }, [currentDate, currentYear]);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const weeklyData = useMemo(() => {
    const monthIndex = currentDate.getMonth();
    const ranges = weekRanges;
    if (ranges.length === 0) return [];
    const safeIndex = Math.min(selectedWeekIndex, ranges.length - 1);
    const [startDay, endDay] = ranges[safeIndex];
    const endDate = new Date(currentYear, monthIndex, endDay);
    const startDate = new Date(currentYear, monthIndex, startDay);
    const weekMap: {
      [key: string]: {
        income: number;
        expense: number;
        date: Date;
      };
    } = {};
    for (let d = startDay; d <= endDay; d++) {
      const date = new Date(currentYear, monthIndex, d);
      const key = date.toDateString();
      weekMap[key] = {
        income: 0,
        expense: 0,
        date
      };
    }
    monthTransactions.forEach(t => {
      const d = new Date(t.date);
      if (d < startDate || d > endDate) return;
      const key = d.toDateString();
      if (!weekMap[key]) return;
      if (t.type === 'income') weekMap[key].income += t.amount;else weekMap[key].expense += t.amount;
    });
    const values = Object.values(weekMap);
    const maxValue = Math.max(1, ...values.map(v => Math.max(v.income, v.expense)));
    const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return values.map(v => ({
      label: dayNames[v.date.getDay()],
      dayNumber: v.date.getDate(),
      income: v.income,
      expense: v.expense,
      incomeHeight: v.income / maxValue * 100,
      expenseHeight: v.expense / maxValue * 100
    }));
  }, [monthTransactions, currentDate, currentYear, weekRanges, selectedWeekIndex]);
  if (isPageLoading || isDataLoading && !isInitialized) {
    return <div className="min-h-screen flex items-center justify-center loading-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Оновлення даних...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background pb-28">
      <div className="p-4 space-y-5 max-w-lg mx-auto">
        {/* Header */}
        <header className="pt-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Мої фінанси</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Контроль бюджету</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => syncTransactions()} disabled={isSyncing} className="relative rounded-xl hover:bg-secondary h-10 w-10">
            <RefreshCw className={`h-5 w-5 text-muted-foreground ${isSyncing ? 'animate-spin text-primary' : ''}`} />
            {isSyncing && <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>}
          </Button>
        </header>

        {/* Syncing Indicator */}
        {isSyncing && <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3 animate-fade-in">
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="text-sm text-primary font-medium">Оновлення даних...</span>
          </div>}

        {/* Month Navigation */}
        <MonthNavigator monthName={getMonthName(currentDate)} onPrevious={goToPreviousMonth} onNext={goToNextMonth} />

        {/* Balance Card */}
        <BalanceCard balance={monthlyStats.balance} monthName={getMonthName(currentDate)} currency={settings.currency} isLoading={isDataLoading} />

        {/* Stats */}
        <StatsCard income={monthlyStats.income} expense={monthlyStats.expense} currency={settings.currency} isLoading={isDataLoading} />

        {/* Recent Transactions */}
        <RecentTransactions transactions={monthTransactions} currency={settings.currency} isLoading={isDataLoading} />

        {/* Weekly Income/Expense Overview */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Тиждень</h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-income/80" />
                  <span>Дохід</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-expense/80" />
                  <span>Витрати</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 bg-secondary/40 rounded-full p-0.5">
                {weekRanges.map((_, index) => (
                  <span
                    key={index}
                    className="w-5 h-5 rounded-full bg-background/60 border border-border/60"
                  />
                ))}
              </div>
            </div>
          </div>
          {weeklyData.every(d => d.income === 0 && d.expense === 0) ? <p className="text-muted-foreground text-sm text-center py-6">
              Немає даних за обраний тиждень
            </p> : <div className="flex items-end justify-between gap-2 h-32">
              {weeklyData.map(d => <div key={`${d.label}-${d.dayNumber}`} className="flex-1 flex flex-col items-center gap-1 text-[10px]">
                  <span className="text-muted-foreground">{d.label}</span>
                  <div className="relative w-full flex-1 flex items-end gap-1">
                    <div className="w-1.5 rounded-full bg-income/80" style={{
                height: `${d.incomeHeight}%`
              }} />
                    <div className="w-1.5 rounded-full bg-expense/80" style={{
                height: `${d.expenseHeight}%`
              }} />
                  </div>
                  <span className="text-muted-foreground/70">{d.dayNumber}</span>
                </div>)}
            </div>}
        </div>
      </div>

      <BottomNav />
    </div>;
};
export default Index;