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
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  return (
    <div className="bg-card rounded-2xl p-5 border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
          <Receipt className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-semibold text-sm">Останні операції</h3>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          <LoadingSpinner size="sm" text="Завантаження..." />
          <div className="space-y-2">
            <TransactionLoadingSkeleton />
            <TransactionLoadingSkeleton />
            <TransactionLoadingSkeleton />
          </div>
        </div>
      ) : recentTransactions.length === 0 ? (
        <p className="text-muted-foreground text-sm py-6 text-center">
          Немає операцій за цей місяць
        </p>
      ) : (
        <div className="space-y-1">
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
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-primary hover:bg-primary/10 rounded-xl h-11 font-medium"
        >
          Вся історія
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
};
