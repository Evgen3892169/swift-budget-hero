import { useMemo, useEffect } from 'react';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { MonthNavigator } from '@/components/MonthNavigator';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';
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

  const isPageLoading = isUserLoading || (isLoading && !isInitialized);

  // Calculate category breakdown for expenses
  const categoryData = useMemo(() => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear && 
             t.type === 'expense';
    });

    const categoryMap: { [key: string]: number } = {};
    monthTransactions.forEach(t => {
      const category = t.category || 'Інше';
      categoryMap[category] = (categoryMap[category] || 0) + t.amount;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, currentMonth, currentYear]);

  // Daily data for bar chart
  const dailyData = useMemo(() => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const dayMap: { [key: number]: { income: number; expense: number } } = {};
    
    monthTransactions.forEach(t => {
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
  }, [transactions, currentMonth, currentYear]);

  const COLORS = ['hsl(174, 72%, 50%)', 'hsl(200, 70%, 50%)', 'hsl(280, 60%, 50%)', 'hsl(45, 80%, 50%)', 'hsl(320, 60%, 50%)'];

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Завантаження аналітики..." />
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
      <div className="p-4 space-y-5 max-w-lg mx-auto">
        <header className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">Аналітика</h1>
          <p className="text-muted-foreground text-sm mt-1">Детальний аналіз фінансів</p>
        </header>

        <MonthNavigator
          monthName={getMonthName(currentDate)}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-income/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-income" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Доходи</p>
            <p className="text-sm font-bold text-income">
              +{monthlyStats.income.toLocaleString('uk-UA')}
            </p>
          </div>
          
          <div className="bg-card rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-expense/20 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-expense" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Витрати</p>
            <p className="text-sm font-bold text-expense">
              -{monthlyStats.expense.toLocaleString('uk-UA')}
            </p>
          </div>
          
          <div className="bg-card rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Баланс</p>
            <p className={`text-sm font-bold ${monthlyStats.balance >= 0 ? 'text-income' : 'text-expense'}`}>
              {monthlyStats.balance >= 0 ? '+' : ''}{monthlyStats.balance.toLocaleString('uk-UA')}
            </p>
          </div>
        </div>

        {/* Daily Chart */}
        <div className="bg-card rounded-xl p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Доходи та витрати по днях
          </h3>
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
                    tick={{ fill: 'hsl(180, 15%, 55%)', fontSize: 10 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(220, 25%, 12%)', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: 'hsl(180, 20%, 95%)'
                    }}
                    formatter={(value: number, name: string) => [
                      `${value.toLocaleString('uk-UA')} ${settings.currency}`,
                      name === 'income' ? 'Дохід' : 'Витрати'
                    ]}
                    labelFormatter={(label) => `День ${label}`}
                  />
                  <Bar dataKey="income" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="hsl(0, 62%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-card rounded-xl p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary" />
            Витрати по категоріях
          </h3>
          {categoryData.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Немає витрат за цей місяць
            </p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={50}
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
              <div className="flex-1 space-y-2">
                {categoryData.slice(0, 5).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value.toLocaleString('uk-UA')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Analytics;
