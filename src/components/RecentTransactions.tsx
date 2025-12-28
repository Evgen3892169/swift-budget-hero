import { Transaction } from '@/types/transaction';
import { TransactionItem } from './TransactionItem';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: string;
  isLoading?: boolean;
}

const TransactionSkeleton = () => (
  <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
        <Skeleton className="h-3 w-16 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
      </div>
    </div>
    <Skeleton className="h-5 w-20 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
  </div>
);

export const RecentTransactions = ({ transactions, currency, isLoading }: RecentTransactionsProps) => {
  const recentTransactions = transactions.slice(0, 3);
  
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Останні операції</h3>
      </div>
      
      {isLoading ? (
        <div className="space-y-1">
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
        </div>
      ) : recentTransactions.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center">
          Немає операцій за цей місяць
        </p>
      ) : (
        <div>
          {recentTransactions.map(transaction => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
              currency={currency}
            />
          ))}
        </div>
      )}
      
      <Link to="/history">
        <Button variant="ghost" className="w-full mt-2 text-primary">
          Вся історія
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
};
