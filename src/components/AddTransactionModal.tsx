import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TransactionType } from '@/types/transaction';
import { cn } from '@/lib/utils';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: { type: TransactionType; amount: number; description: string; date: string }) => void;
  currency: string;
}

export const AddTransactionModal = ({ isOpen, onClose, onAdd, currency }: AddTransactionModalProps) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    onAdd({
      type,
      amount: numAmount,
      description: description.trim(),
      date: new Date().toISOString(),
    });
    
    setAmount('');
    setDescription('');
    setType('expense');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>Нова операція</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-12",
                type === 'expense' && "bg-expense text-expense-foreground border-expense hover:bg-expense/90 hover:text-expense-foreground"
              )}
              onClick={() => setType('expense')}
            >
              Витрата
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-12",
                type === 'income' && "bg-income text-income-foreground border-income hover:bg-income/90 hover:text-income-foreground"
              )}
              onClick={() => setType('income')}
            >
              Дохід
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Сума ({currency})</Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-xl h-14"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Опис (необов'язково)</Label>
            <Input
              id="description"
              placeholder="Наприклад: Продукти"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12"
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Додати
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
