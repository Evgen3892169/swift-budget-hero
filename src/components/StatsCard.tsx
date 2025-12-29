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
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-card rounded-xl p-4 border border-income/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-income/20 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-income" />
          </div>
          <span className="text-xs text-muted-foreground">Доходи</span>
        </div>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <p className="text-lg font-bold text-income transition-all duration-300">
            +{income.toLocaleString('uk-UA')} {currency}
          </p>
        )}
      </div>
      
      <div className="bg-card rounded-xl p-4 border border-expense/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-expense/20 flex items-center justify-center">
            <TrendingDown className="h-4 w-4 text-expense" />
          </div>
          <span className="text-xs text-muted-foreground">Витрати</span>
        </div>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <p className="text-lg font-bold text-expense transition-all duration-300">
            -{expense.toLocaleString('uk-UA')} {currency}
          </p>
        )}
      </div>
    </div>
  );
};
