import { useState, useEffect } from 'react';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { BottomNav } from '@/components/BottomNav';
import { AddRegularPaymentModal } from '@/components/AddRegularPaymentModal';
import { RegularPaymentItem } from '@/components/RegularPaymentItem';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, TrendingUp, TrendingDown, Webhook, User, Users, Trash2 } from 'lucide-react';
import { TransactionType } from '@/types/transaction';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const currencies = [
  { value: 'грн', label: '₴ Гривня (грн)' },
  { value: '$', label: '$ Долар ($)' },
  { value: '€', label: '€ Євро (€)' },
];

const Settings = () => {
  const { telegramUserId, isLoading: isUserLoading } = useTelegramUser();
  
  const {
    settings,
    updateSettings,
    addRegularPayment,
    deleteRegularPayment,
    setTelegramUserId,
    syncTransactions,
  } = useTransactionsContext();
  
  const [regularPaymentModal, setRegularPaymentModal] = useState<{
    isOpen: boolean;
    type: TransactionType;
  }>({ isOpen: false, type: 'income' });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [isFamilyProcessing, setIsFamilyProcessing] = useState(false);

  // Set telegram user ID in context
  useEffect(() => {
    if (telegramUserId) {
      setTelegramUserId(telegramUserId);
    }
  }, [telegramUserId, setTelegramUserId]);

  const handleAddRegularPayment = async (payment: { type: TransactionType; amount: number; description: string; dayOfMonth?: number }) => {
    addRegularPayment(payment.type, {
      type: payment.type,
      amount: payment.amount,
      description: payment.description,
      dayOfMonth: payment.dayOfMonth,
    });

    if (!telegramUserId) return;

    try {
      await fetch('https://shinespiceclover.app.n8n.cloud/webhook/f5d9f212-83f0-4625-8d59-61cb7bb7119f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: telegramUserId,
          type: payment.type,
          amount: payment.amount,
          date: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Не вдалося відправити регулярний платіж на сервер', error);
    }
  };

  const handleDeleteRegularPayment = async (
    type: TransactionType,
    id: string,
    amount: number
  ) => {
    deleteRegularPayment(type, id);

    if (!telegramUserId) return;

    try {
      await fetch('https://shinespiceclover.app.n8n.cloud/webhook/39ece81c-70b3-481e-a8cc-20420d428714', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: telegramUserId,
          type,
          amount,
          date: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Не вдалося відправити видалення регулярного платежу на сервер', error);
    }
  };

  const handleConnectFamily = async () => {
    if (!telegramUserId) {
      toast.error('Не знайдено ваш User ID');
      return;
    }

    setIsFamilyProcessing(true);
    try {
      await fetch('https://shinespiceclover.app.n8n.cloud/webhook-test/a2568da5-e64f-4ee6-b39c-02edb8431131', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: telegramUserId }),
      });

      updateSettings({ familyUserId: telegramUserId });
      toast.success('Сімейний бюджет підключено');
    } catch (error) {
      console.error(error);
      toast.error('Не вдалося підключити сімейний бюджет');
    } finally {
      setIsFamilyProcessing(false);
    }
  };

  const handleDisconnectFamily = async () => {
    if (!telegramUserId) {
      toast.error('Не знайдено ваш User ID');
      return;
    }

    setIsFamilyProcessing(true);
    try {
      await fetch('https://shinespiceclover.app.n8n.cloud/webhook-test/a72f7b98-b3b6-4254-aee9-ffdb156d28c7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: telegramUserId }),
      });

      updateSettings({ familyUserId: undefined });
      toast.success('Сімейний бюджет відключено');
    } catch (error) {
      console.error(error);
      toast.error('Не вдалося відключити сімейний бюджет');
    } finally {
      setIsFamilyProcessing(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Завантаження налаштувань..." />
      </div>
    );
  }

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
          {telegramUserId ? (
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Telegram User ID</p>
                <p className="text-xl font-bold">{telegramUserId}</p>
              </div>
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
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Додати
            </Button>
          </div>
          
          {settings.regularIncomes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Немає регулярних доходів
            </p>
          ) : (
            <div className="space-y-1">
              {settings.regularIncomes.map(payment => (
                <RegularPaymentItem
                  key={payment.id}
                  payment={payment}
                  currency={settings.currency}
                  onDelete={(id) =>
                    handleDeleteRegularPayment('income', id, payment.amount)
                  }
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
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Додати
            </Button>
          </div>
          
          {settings.regularExpenses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Немає регулярних витрат
            </p>
          ) : (
            <div className="space-y-1">
              {settings.regularExpenses.map(payment => (
                <RegularPaymentItem
                  key={payment.id}
                  payment={payment}
                  currency={settings.currency}
                  onDelete={(id) =>
                    handleDeleteRegularPayment('expense', id, payment.amount)
                  }
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
            Дані синхронізуються з Google Sheets через n8n. 
            Вручну додані транзакції також відправляються на сервер.
          </p>
        </div>

        {/* Categories Management */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-semibold">Категорії</Label>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={async () => {
                if (!newCategoryName.trim()) {
                  toast.error('Введіть назву категорії');
                  return;
                }
                if (!telegramUserId) {
                  toast.error('Не знайдено ваш User ID');
                  return;
                }

                setIsCategorySubmitting(true);
                try {
                  await fetch('https://shinespiceclover.app.n8n.cloud/webhook/ad417f87-a904-42a0-8ddb-5de5a18aea26', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      user_id: telegramUserId,
                      category: newCategoryName.trim(),
                    }),
                  });

                  const existing = settings.categories || [];
                  updateSettings({ categories: [...existing, newCategoryName.trim()] });
                  setNewCategoryName('');
                  toast.success('Категорію додано');
                } catch (error) {
                  console.error(error);
                  toast.error('Не вдалося додати категорію');
                } finally {
                  setIsCategorySubmitting(false);
                }
              }}
            >
              <Plus className="h-4 w-4" />
              Категорія
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Input
              placeholder="Назва категорії"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="h-10"
            />
          </div>

          {(!settings.categories || settings.categories.length === 0) ? (
            <p className="text-sm text-muted-foreground">
              Поки що немає власних категорій
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {settings.categories.map((category) => (
                <AlertDialog key={category}>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
                    >
                      <span>{category}</span>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Видалити категорію?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ви впевнені, що хочете видалити категорію «{category}»?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Скасувати</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          if (!telegramUserId) {
                            toast.error('Не знайдено ваш User ID');
                            return;
                          }
                          try {
                            await fetch('https://shinespiceclover.app.n8n.cloud/webhook/ad417f87-a904-42a0-8ddb-5de5a18aea26', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                user_id: telegramUserId,
                                category,
                              }),
                            });

                            const existing = settings.categories || [];
                            updateSettings({ categories: existing.filter((c) => c !== category) });
                            toast.success('Категорію видалено');
                          } catch (error) {
                            console.error(error);
                            toast.error('Не вдалося видалити категорію');
                          }
                        }}
                      >
                        Видалити
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ))}
            </div>
          )}
        </div>

        {/* Family Cabinet */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/20 p-1.5 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <Label className="text-base font-semibold">Сімейний бюджет</Label>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Підключіть спільний сімейний бюджет для синхронізації витрат
          </p>

          {settings.familyUserId ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Сімейний бюджет підключено для користувача ID: {settings.familyUserId}
              </p>
              <Button
                variant="destructive"
                className="w-full h-11"
                onClick={handleDisconnectFamily}
                disabled={isFamilyProcessing}
              >
                {isFamilyProcessing ? 'Відключення...' : 'Відключити'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full h-11"
                    disabled={isFamilyProcessing || !telegramUserId}
                  >
                    {isFamilyProcessing ? 'Підключення...' : 'Підключити сімейний бюджет'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Підключити сімейний бюджет?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Ваш User ID: <span className="font-mono font-semibold">{telegramUserId}</span>
                      <br />
                      Підтвердіть, щоб відправити цей ID для підключення сімейного бюджету.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Скасувати</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConnectFamily} disabled={isFamilyProcessing}>
                      Підтвердити
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
      
      <AddRegularPaymentModal
        isOpen={regularPaymentModal.isOpen}
        onClose={() => setRegularPaymentModal(prev => ({ ...prev, isOpen: false }))}
        onAdd={handleAddRegularPayment}
        type={regularPaymentModal.type}
        currency={settings.currency}
      />
    </div>
  );
};

export default Settings;
