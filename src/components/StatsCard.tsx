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
      <div className="bg-income-light rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-income/20 p-1.5 rounded-full">
            <TrendingUp className="h-4 w-4 text-income" />
          </div>
          <span className="text-sm text-muted-foreground">Доходи</span>
        </div>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <p className="text-xl font-bold text-income transition-all duration-300">
            +{income.toLocaleString('uk-UA')} {currency}
          </p>
        )}
      </div>
      
      <div className="bg-expense-light rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-expense/20 p-1.5 rounded-full">
            <TrendingDown className="h-4 w-4 text-expense" />
          </div>
          <span className="text-sm text-muted-foreground">Витрати</span>
        </div>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <p className="text-xl font-bold text-expense transition-all duration-300">
            -{expense.toLocaleString('uk-UA')} {currency}
          </p>
        )}
      </div>
    </div>
  );
};
