import { useMemo, useEffect, useState } from 'react';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { MonthNavigator } from '@/components/MonthNavigator';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TrendingUp, TrendingDown, Wallet, PieChart, Sparkles } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
} from 'recharts';
import { toast } from 'sonner';

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
            className={`text-[11px] px-3 py-1.5 rounded-full border text-nowrap transition-colors ${
              range === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border/60'
            }`}
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

          <div className="bg-card rounded-2xl p-4 text-center border border-primary/20 glow-primary">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/20">
              <Wallet className="h-5 w-5 text-primary" />
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

        {/* Charts */}
        {range === 'month' ? (
          <div className="bg-card rounded-2xl p-5 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">По днях</h3>
            </div>
            {dailyData.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Немає даних за цей місяць
              </p>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData} barGap={2}>
                    <XAxis
                      dataKey="day"
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
                        name === 'income' ? 'Дохід' : 'Витрати',
                      ]}
                      labelFormatter={(label) => `День ${label}`}
                    />
                    <Bar dataKey="income" fill="hsl(160, 65%, 50%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="hsl(0, 60%, 55%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-5 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">По місяцях (весь період)</h3>
            </div>
            {monthlyAggregateData.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Немає даних для побудови графіка
              </p>
            ) : (
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyAggregateData} barGap={4}>
                    <XAxis
                      dataKey="month"
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
                        name === 'income' ? 'Дохід' : 'Витрати',
                      ]}
                      labelFormatter={(label) => label}
                    />
                    <Bar dataKey="income" fill="hsl(160, 65%, 50%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="hsl(0, 60%, 55%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Category Breakdown */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
              <PieChart className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">Витрати по категоріях</h3>
          </div>
          {categoryData.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Немає витрат за цей період
            </p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-28 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={22}
                      outerRadius={45}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2.5">
                {categoryData.slice(0, 5).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground text-xs">{item.name}</span>
                    </div>
                    <span className="font-medium text-xs">{item.value.toLocaleString('uk-UA')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Analysis Block */}
        <div className="bg-card rounded-2xl p-5 border border-border/50 mt-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">ШІ-аналіз витрат</p>
              <h3 className="font-semibold text-sm">Рекомендації та огляд витрат</h3>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Натисніть «Аналіз», щоб отримати розбір витрат, доходів та поради, на чому можна зекономити.
          </p>
          <button
            type="button"
            onClick={async () => {
              if (!telegramUserId) {
                toast.error('Не знайдено user id користувача');
                return;
              }
              try {
                setIsAiLoading(true);
                const response = await fetch(
                  'https://gdgsnbkw.app.n8n.cloud/webhook-test/39b5d691-23dc-495a-ba66-339e341e9eb6',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: telegramUserId }),
                  }
                );

                if (!response.ok) {
                  throw new Error('Помилка підключення до ШІ аналізу');
                }

                // Дані будемо красиво відображати після узгодження формату
                await response.json().catch(() => null);
                toast.success('Запит на ШІ-аналіз відправлено');
              } catch (error) {
                console.error(error);
                toast.error('Не вдалося виконати ШІ-аналіз');
              } finally {
                setIsAiLoading(false);
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl h-10 px-4 bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
            disabled={isAiLoading}
          >
            <Sparkles className="h-4 w-4" />
            {isAiLoading ? 'Аналіз...' : 'Аналіз'}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Analytics;
