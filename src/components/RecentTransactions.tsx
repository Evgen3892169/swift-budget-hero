import { Transaction } from '@/types/transaction';
import { TransactionItem } from './TransactionItem';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: string;
}

export const RecentTransactions = ({ transactions, currency }: RecentTransactionsProps) => {
  const recentTransactions = transactions.slice(0, 3);
  
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Останні операції</h3>
      </div>
      
      {recentTransactions.length === 0 ? (
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
