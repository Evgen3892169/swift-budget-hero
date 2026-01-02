import { useMemo, useEffect, useState } from 'react';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { MonthNavigator } from '@/components/MonthNavigator';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MiniChart } from '@/components/MiniChart';
import { TrendingUp, TrendingDown, Wallet, PieChart, Sparkles, Crown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const COLORS = [
  'hsl(168, 80%, 48%)',
  'hsl(200, 70%, 50%)',
  'hsl(280, 60%, 50%)',
  'hsl(45, 80%, 50%)',
  'hsl(320, 60%, 50%)',
];

const Analytics = () => {
  const { telegramUserId, isLoading: isUserLoading } = useTelegramUser();

  const {
    transactions,
    monthlyStats,
    settings,
    currentDate,
    isLoading,
    isInitialized,
    goToPreviousMonth,
    goToNextMonth,
    getMonthName,
    currentMonth,
    currentYear,
    setTelegramUserId,
  } = useTransactionsContext();

  useEffect(() => {
    if (telegramUserId) {
      setTelegramUserId(telegramUserId);
    }
  }, [telegramUserId, setTelegramUserId]);

  const [range, setRange] = useState<'month' | 'all'>('month');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [dynamicsScope, setDynamicsScope] = useState<'month' | 'year'>('month');

  const isPageLoading = isUserLoading || (isLoading && !isInitialized);

  const categoryData = useMemo(() => {
    const sourceTransactions =
      range === 'month'
        ? transactions.filter((t) => {
            const date = new Date(t.date);
            return (
              date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear &&
              t.type === 'expense'
            );
          })
        : transactions.filter((t) => t.type === 'expense');

    const categoryMap: { [key: string]: number } = {};
    sourceTransactions.forEach((t) => {
      const category = t.category || 'Інше';
      categoryMap[category] = (categoryMap[category] || 0) + t.amount;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, currentMonth, currentYear, range]);

  const dailyData = useMemo(() => {
    if (range === 'all') return [];

    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const dayMap: { [key: number]: { income: number; expense: number } } = {};

    monthTransactions.forEach((t) => {
      const day = new Date(t.date).getDate();
      if (!dayMap[day]) {
        dayMap[day] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        dayMap[day].income += t.amount;
      } else {
        dayMap[day].expense += t.amount;
      }
    });

    return Object.entries(dayMap)
      .map(([day, data]) => ({
        day: `${day}`,
        income: data.income,
        expense: data.expense,
      }))
      .sort((a, b) => parseInt(a.day) - parseInt(b.day));
  }, [transactions, currentMonth, currentYear, range]);

  const monthlyAggregateData = useMemo(() => {
    if (range === 'month') return [];

    const monthMap: { [key: string]: { income: number; expense: number } } = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[key]) {
        monthMap[key] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthMap[key].income += t.amount;
      } else {
        monthMap[key].expense += t.amount;
      }
    });

    return Object.entries(monthMap)
      .map(([key, data]) => ({
        month: key,
        income: data.income,
        expense: data.expense,
      }))
      .sort((a, b) => (a.month > b.month ? 1 : -1));
  }, [transactions, range]);

  const yearlyDynamicsData = useMemo(() => {
    // Дані тільки за поточний рік
    const yearMap: { [month: number]: { income: number; expense: number } } = {};
    for (let m = 0; m < 12; m++) {
      yearMap[m] = { income: 0, expense: 0 };
    }

    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (date.getFullYear() !== currentYear) return;
      const m = date.getMonth();
      if (!yearMap[m]) yearMap[m] = { income: 0, expense: 0 };
      if (t.type === 'income') yearMap[m].income += t.amount;
      else yearMap[m].expense += t.amount;
    });

    const monthLabels = ['Січ', 'Лют', 'Бер', 'Квіт', 'Трав', 'Черв', 'Лип', 'Серп', 'Вер', 'Жовт', 'Лист', 'Груд'];

    let cumulativeIncome = 0;
    let cumulativeExpense = 0;

    return Object.entries(yearMap).map(([m, data]) => {
      const monthIndex = Number(m);
      cumulativeIncome += data.income;
      cumulativeExpense += data.expense;
      return {
        label: monthLabels[monthIndex],
        income: cumulativeIncome,
        expense: cumulativeExpense,
      };
    });
  }, [transactions, currentYear]);

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Завантаження..." />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="p-4 space-y-5 max-w-lg mx-auto">
        <header className="pt-3">
          <h1 className="text-xl font-bold text-foreground tracking-tight">Аналітика</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Детальний аналіз фінансів</p>
        </header>

        <div className="flex items-center justify-between gap-3">
          <MonthNavigator
            monthName={getMonthName(currentDate)}
            onPrevious={goToPreviousMonth}
            onNext={goToNextMonth}
          />
          <button
             type="button"
             className={`text-xs px-5 h-11 rounded-full border text-nowrap flex items-center justify-center transition-colors whitespace-nowrap
               ${
                 range === 'all'
                   ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                   : 'bg-card text-muted-foreground border-border/60 hover:border-primary/50 hover:text-foreground'
               }
             `}
             onClick={() => setRange((prev) => (prev === 'all' ? 'month' : 'all'))}
           >
            За весь період
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-4 text-center border border-income/20">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-income/15 flex items-center justify-center border border-income/20">
              <TrendingUp className="h-5 w-5 text-income" />
            </div>
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Доходи</p>
            <p className="text-sm font-bold text-income">
              +{monthlyStats.income.toLocaleString('uk-UA')}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-4 text-center border border-expense/20">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-expense/15 flex items-center justify-center border border-expense/20">
              <TrendingDown className="h-5 w-5 text-expense" />
            </div>
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Витрати</p>
            <p className="text-sm font-bold text-expense">
              -{monthlyStats.expense.toLocaleString('uk-UA')}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-4 text-center border border-balance glow-balance">
             <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-balance-soft flex items-center justify-center border border-balance">
               <Wallet className="h-5 w-5 text-balance" />
             </div>
             <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Баланс</p>
             <p
               className={`text-sm font-bold ${
                 monthlyStats.balance >= 0 ? 'text-income' : 'text-expense'
               }`}
             >
               {monthlyStats.balance >= 0 ? '+' : ''}
               {monthlyStats.balance.toLocaleString('uk-UA')}
             </p>
           </div>
        </div>

        {/* Dynamics Chart with month/year toggle */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Динаміка</h3>
            </div>
            <div className="inline-flex items-center gap-1 bg-secondary/40 rounded-full p-0.5">
              <button
                type="button"
                className={`px-3 h-7 rounded-full text-[11px] font-medium transition-colors ${
                  dynamicsScope === 'month'
                    ? 'bg-background text-foreground'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setDynamicsScope('month')}
              >
                Місяць
              </button>
              <button
                type="button"
                className={`px-3 h-7 rounded-full text-[11px] font-medium transition-colors ${
                  dynamicsScope === 'year'
                    ? 'bg-background text-foreground'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setDynamicsScope('year')}
              >
                Рік
              </button>
            </div>
          </div>

          {dynamicsScope === 'month' ? (
            <MiniChart
              transactions={transactions}
              currentMonth={currentMonth}
              currentYear={currentYear}
              currency={settings.currency}
            />
          ) : yearlyDynamicsData.every((d) => d.income === 0 && d.expense === 0) ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Немає даних за цей рік
            </p>
          ) : (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyDynamicsData}>
                  <defs>
                    <linearGradient id="yearIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(160, 65%, 50%)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(160, 65%, 50%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="yearExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(0, 60%, 55%)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(0, 60%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(210, 15%, 55%)', fontSize: 10 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 35%, 11%)',
                      border: '1px solid hsl(220, 30%, 18%)',
                      borderRadius: '12px',
                      color: 'hsl(180, 10%, 94%)',
                    }}
                    formatter={(value: number, name: string) => [
                      `${value.toLocaleString('uk-UA')} ${settings.currency}`,
                      name === 'income' ? 'Кумулятивний дохід' : 'Кумулятивні витрати',
                    ]}
                    labelFormatter={(label) => `Місяць ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="hsl(160, 65%, 50%)"
                    strokeWidth={2}
                    fill="url(#yearIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="hsl(0, 60%, 55%)"
                    strokeWidth={2}
                    fill="url(#yearExpense)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category Breakdown - Premium Locked */}
        <div className="bg-card rounded-2xl p-5 border border-border/50 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
              <PieChart className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm flex items-center gap-2">
              Витрати по категоріях
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/60">
                <Crown className="h-3 w-3 text-primary" />
                Преміум
              </span>
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Детальна аналітика за категоріями, фото-чеків та ШІ-аналіз доступні в преміум-підписці.
          </p>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-fade-in">
            <p className="text-sm font-medium">Аналітика категорій</p>
            <Button
              type="button"
              size="sm"
              className="rounded-full px-5 text-xs font-semibold gap-2 hover-scale"
              onClick={() => setIsPremiumOpen(true)}
            >
              <Crown className="h-4 w-4" /> Преміум від $2/міс
            </Button>
          </div>
        </div>

        {/* AI Analysis Block - Premium Locked */}
        <div className="bg-card rounded-2xl p-5 border border-border/50 mt-1 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">ШІ-аналіз витрат</p>
                <h3 className="font-semibold text-sm">Рекомендації та огляд витрат</h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/60">
                <Crown className="h-3 w-3 text-primary" />
                Преміум
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Короткий розбір витрат, доходів та поради від ШІ — доступно в преміум-підписці.
          </p>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-fade-in">
            <p className="text-sm font-medium">ШІ аналітика</p>
            <Button
              type="button"
              size="sm"
              className="rounded-full px-5 text-xs font-semibold gap-2 hover-scale"
              onClick={() => setIsPremiumOpen(true)}
            >
              <Crown className="h-4 w-4" /> Преміум від $2/міс
            </Button>
          </div>
        </div>

        {/* Premium modal */}
        <Dialog open={isPremiumOpen} onOpenChange={setIsPremiumOpen}>
          <DialogContent className="max-w-sm rounded-2xl p-5 bg-card border border-border/60 animate-enter">
            <DialogHeader className="text-left space-y-1">
              <DialogTitle className="flex items-center gap-2 text-base font-semibold">
                <Crown className="h-5 w-5 text-primary" />
                Преміум-підписка
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Отримайте розширену аналітику та зручні інструменти фіксації витрат.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-3 space-y-3 text-xs">
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• Голосова фіксація витрат та доходів</li>
                <li>• ШІ-аналіз витрат за місяць та рік</li>
                <li>• Фотофіксація чеків</li>
                <li>• Витрати по категоріях + власні категорії</li>
                <li>• Сімейний бюджет для спільних витрат</li>
              </ul>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="border border-primary/40 rounded-xl p-3 flex flex-col gap-1 bg-primary/5">
                  <span className="text-[11px] text-muted-foreground">Місячна підписка</span>
                  <span className="text-sm font-semibold">$3 / міс</span>
                </div>
                <div className="border border-primary rounded-xl p-3 flex flex-col gap-1 bg-primary/10">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    Рік одразу
                    <span className="px-1.5 py-0.5 rounded-full bg-primary text-[9px] text-primary-foreground">-30%</span>
                  </span>
                  <span className="text-sm font-semibold">≈ $2 / міс</span>
                </div>
              </div>
              <Button className="w-full h-10 mt-1" disabled>
                Купити (скоро)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <BottomNav />
    </div>
  );
};

export default Analytics;
