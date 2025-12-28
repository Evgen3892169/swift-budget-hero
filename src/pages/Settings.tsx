import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { BottomNav } from '@/components/BottomNav';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { AddRegularPaymentModal } from '@/components/AddRegularPaymentModal';
import { RegularPaymentItem } from '@/components/RegularPaymentItem';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, TrendingUp, TrendingDown, Webhook, User } from 'lucide-react';
import { TransactionType } from '@/types/transaction';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id?: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

const currencies = [
  { value: 'грн', label: '₴ Гривня (грн)' },
  { value: '$', label: '$ Долар ($)' },
  { value: '€', label: '€ Євро (€)' },
];

const getTelegramUser = () => {
  console.log('Telegram object:', window.Telegram);
  console.log('WebApp object:', window.Telegram?.WebApp);
  console.log('initDataUnsafe:', window.Telegram?.WebApp?.initDataUnsafe);
  console.log('user:', window.Telegram?.WebApp?.initDataUnsafe?.user);
  
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    return tg.initDataUnsafe?.user || null;
  }
  return null;
};

const Settings = () => {
  const {
    settings,
    updateSettings,
    addRegularPayment,
    deleteRegularPayment,
    addTransaction,
  } = useTransactions();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [regularPaymentModal, setRegularPaymentModal] = useState<{
    isOpen: boolean;
    type: TransactionType;
  }>({ isOpen: false, type: 'income' });

  const telegramUser = getTelegramUser();

  const handleAddRegularPayment = (payment: { type: TransactionType; amount: number; description: string }) => {
    addRegularPayment(payment.type, {
      type: payment.type,
      amount: payment.amount,
      description: payment.description,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-4 space-y-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Налаштування</h1>
        
        {/* User Profile */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/20 p-1.5 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-semibold">Профіль користувача</span>
          </div>
          {telegramUser ? (
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Telegram User ID</p>
                <p className="text-xl font-bold">{telegramUser.id}</p>
              </div>
              {(telegramUser.first_name || telegramUser.last_name) && (
                <div>
                  <p className="text-sm text-muted-foreground">Ім'я</p>
                  <p className="font-medium">
                    {[telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ')}
                  </p>
                </div>
              )}
              {telegramUser.username && (
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">@{telegramUser.username}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Відкрийте додаток через Telegram для відображення профілю
            </p>
          )}
        </div>
        
        {/* Currency */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <Label className="text-base font-semibold mb-3 block">Валюта</Label>
          <Select
            value={settings.currency}
            onValueChange={(value) => updateSettings({ currency: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(currency => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Regular Incomes */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-income/20 p-1.5 rounded-full">
                <TrendingUp className="h-4 w-4 text-income" />
              </div>
              <Label className="text-base font-semibold">Регулярні доходи</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRegularPaymentModal({ isOpen: true, type: 'income' })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Додати
            </Button>
          </div>
          
          {settings.regularIncomes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Немає регулярних доходів
            </p>
          ) : (
            <div>
              {settings.regularIncomes.map(payment => (
                <RegularPaymentItem
                  key={payment.id}
                  payment={payment}
                  currency={settings.currency}
                  onDelete={(id) => deleteRegularPayment('income', id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Regular Expenses */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-expense/20 p-1.5 rounded-full">
                <TrendingDown className="h-4 w-4 text-expense" />
              </div>
              <Label className="text-base font-semibold">Регулярні витрати</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRegularPaymentModal({ isOpen: true, type: 'expense' })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Додати
            </Button>
          </div>
          
          {settings.regularExpenses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Немає регулярних витрат
            </p>
          ) : (
            <div>
              {settings.regularExpenses.map(payment => (
                <RegularPaymentItem
                  key={payment.id}
                  payment={payment}
                  currency={settings.currency}
                  onDelete={(id) => deleteRegularPayment('expense', id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Integration Info */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/20 p-1.5 rounded-full">
              <Webhook className="h-4 w-4 text-primary" />
            </div>
            <Label className="text-base font-semibold">Інтеграція</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Готово до інтеграції з Telegram та n8n. 
            Дані можуть надходити через webhook з полями: тип, сума, опис, дата.
          </p>
        </div>
      </div>

      <BottomNav onAddClick={() => setIsAddModalOpen(true)} />
      
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addTransaction}
        currency={settings.currency}
      />
      
      <AddRegularPaymentModal
        isOpen={regularPaymentModal.isOpen}
        onClose={() => setRegularPaymentModal({ ...regularPaymentModal, isOpen: false })}
        onAdd={handleAddRegularPayment}
        type={regularPaymentModal.type}
        currency={settings.currency}
      />
    </div>
  );
};

export default Settings;
