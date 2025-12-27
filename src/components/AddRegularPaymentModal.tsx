import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TransactionType } from '@/types/transaction';

interface AddRegularPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payment: { type: TransactionType; amount: number; description: string }) => void;
  type: TransactionType;
  currency: string;
}

export const AddRegularPaymentModal = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  type,
  currency 
}: AddRegularPaymentModalProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !description.trim()) return;
    
    onAdd({
      type,
      amount: numAmount,
      description: description.trim(),
    });
    
    setAmount('');
    setDescription('');
    onClose();
  };

  const isIncome = type === 'income';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>
            {isIncome ? 'Новий регулярний дохід' : 'Нова регулярна витрата'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Назва</Label>
            <Input
              id="description"
              placeholder={isIncome ? "Наприклад: Зарплата" : "Наприклад: Оренда"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
            />
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
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12"
            disabled={!amount || parseFloat(amount) <= 0 || !description.trim()}
          >
            Додати
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
