import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Wallet } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  monthName: string;
  currency: string;
  isLoading?: boolean;
}

export const BalanceCard = ({ balance, monthName, currency, isLoading }: BalanceCardProps) => {
  const isPositive = balance >= 0;
  
  return (
    <div className="bg-card rounded-2xl p-6 border border-balance glow-balance">
       <div className="flex items-center gap-3 mb-4">
         <div className="w-11 h-11 rounded-xl bg-balance-soft flex items-center justify-center border border-balance">
           <Wallet className="h-5 w-5 text-balance" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Баланс</p>
          <p className="text-xs text-muted-foreground/70">{monthName}</p>
        </div>
      </div>
      {isLoading ? (
        <div className="py-2">
          <LoadingSpinner size="md" text="Завантаження..." />
        </div>
      ) : (
        <p className={cn(
          "text-4xl font-bold tracking-tight transition-all duration-300",
          isPositive ? "text-income" : "text-expense"
        )}>
          {isPositive ? '+' : ''}{balance.toLocaleString('uk-UA')} 
          <span className="text-lg font-medium ml-1 opacity-70">{currency}</span>
        </p>
      )}
    </div>
  );
};
