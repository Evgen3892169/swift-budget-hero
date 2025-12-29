import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Transaction } from '@/types/transaction';

interface MiniChartProps {
  transactions: Transaction[];
  currentMonth: number;
  currentYear: number;
  currency: string;
}

export const MiniChart = ({ transactions, currentMonth, currentYear, currency }: MiniChartProps) => {
  const chartData = useMemo(() => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const dayMap: { [key: number]: { income: number; expense: number } } = {};
    
    for (let i = 1; i <= 31; i++) {
      dayMap[i] = { income: 0, expense: 0 };
    }
    
    monthTransactions.forEach(t => {
      const day = new Date(t.date).getDate();
      if (t.type === 'income') {
        dayMap[day].income += t.amount;
      } else {
        dayMap[day].expense += t.amount;
      }
    });

    let cumulativeIncome = 0;
    let cumulativeExpense = 0;
    
    return Object.entries(dayMap)
      .map(([day, data]) => {
        cumulativeIncome += data.income;
        cumulativeExpense += data.expense;
        return {
          day: parseInt(day),
          income: cumulativeIncome,
          expense: cumulativeExpense,
        };
      })
      .filter(d => d.income > 0 || d.expense > 0 || d.day <= new Date().getDate());
  }, [transactions, currentMonth, currentYear]);

  if (chartData.length === 0) {
    return (
      <div className="h-28 flex items-center justify-center">
        <p className="text-muted-foreground text-xs">Немає даних</p>
      </div>
    );
  }

  return (
    <div className="h-28">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160, 65%, 50%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(160, 65%, 50%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(0, 60%, 55%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(0, 60%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(220, 35%, 11%)', 
              border: '1px solid hsl(220, 30%, 18%)', 
              borderRadius: '12px',
              fontSize: '12px',
              color: 'hsl(180, 10%, 94%)'
            }}
            formatter={(value: number, name: string) => [
              `${value.toLocaleString('uk-UA')} ${currency}`,
              name === 'income' ? 'Доходи' : 'Витрати'
            ]}
            labelFormatter={(label) => `День ${label}`}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="hsl(160, 65%, 50%)"
            strokeWidth={2}
            fill="url(#incomeGradient)"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="hsl(0, 60%, 55%)"
            strokeWidth={2}
            fill="url(#expenseGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
