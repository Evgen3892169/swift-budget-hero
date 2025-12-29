import { Transaction } from '@/types/transaction';
import { TransactionItem } from './TransactionItem';
import { Button } from '@/components/ui/button';
import { ChevronRight, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner, TransactionLoadingSkeleton } from '@/components/LoadingSpinner';

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: string;
  isLoading?: boolean;
}

export const RecentTransactions = ({ transactions, currency, isLoading }: RecentTransactionsProps) => {
  const recentTransactions = transactions.slice(0, 3);
  
  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Receipt className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Останні операції</h3>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          <LoadingSpinner size="sm" text="Завантаження транзакцій..." />
          <div className="space-y-1">
            <TransactionLoadingSkeleton />
            <TransactionLoadingSkeleton />
            <TransactionLoadingSkeleton />
          </div>
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
        <Button variant="ghost" className="w-full mt-2 text-primary hover:bg-primary/10 rounded-xl">
          Вся історія
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
};
