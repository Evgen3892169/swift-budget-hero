import { TrendingUp, TrendingDown } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface StatsCardProps {
  income: number;
  expense: number;
  currency: string;
  isLoading?: boolean;
}

export const StatsCard = ({ income, expense, currency, isLoading }: StatsCardProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-card rounded-2xl p-5 border border-income/20 glow-income">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-income/15 flex items-center justify-center border border-income/20">
            <TrendingUp className="h-5 w-5 text-income" />
          </div>
          <span className="text-sm text-muted-foreground">Доходи</span>
        </div>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <p className="text-xl font-bold text-income tracking-tight">
            +{income.toLocaleString('uk-UA')}
            <span className="text-xs font-medium ml-1 opacity-70">{currency}</span>
          </p>
        )}
      </div>
      
      <div className="bg-card rounded-2xl p-5 border border-expense/20 glow-expense">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-expense/15 flex items-center justify-center border border-expense/20">
            <TrendingDown className="h-5 w-5 text-expense" />
          </div>
          <span className="text-sm text-muted-foreground">Витрати</span>
        </div>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <p className="text-xl font-bold text-expense tracking-tight">
            -{expense.toLocaleString('uk-UA')}
            <span className="text-xs font-medium ml-1 opacity-70">{currency}</span>
          </p>
        )}
      </div>
    </div>
  );
};
