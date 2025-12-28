-- Create transactions table for storing user transactions
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_user_id TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT,
  description TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy for public insert (webhook can add transactions)
CREATE POLICY "Allow public insert" 
ON public.transactions 
FOR INSERT 
WITH CHECK (true);

-- Policy for reading by telegram_user_id
CREATE POLICY "Allow read by telegram_user_id" 
ON public.transactions 
FOR SELECT 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_transactions_telegram_user_id ON public.transactions(telegram_user_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date DESC);