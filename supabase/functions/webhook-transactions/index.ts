import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json();
    console.log('Received webhook data:', body);

    // Handle array or single object from n8n
    // Format: { userid, money, category, data } or array of these
    const items = Array.isArray(body) ? body : [body];
    const savedTransactions = [];

    for (const item of items) {
      // Support both formats: n8n format (userid, money, data) and direct format (telegram_user_id, amount, date)
      const userId = item.userid || item.telegram_user_id;
      const moneyValue = item.money ?? item.amount;
      const category = item.category || null;
      const description = item.description || item.category || null;
      const dateValue = item.data || item.date;

      if (!userId || moneyValue === undefined) {
        console.log('Skipping item with missing fields:', item);
        continue;
      }

      // Parse amount: negative = expense, positive = income
      let type: 'income' | 'expense';
      let numericAmount: number;

      const numValue = Number(moneyValue);
      if (numValue < 0) {
        type = 'expense';
        numericAmount = Math.abs(numValue);
      } else {
        type = 'income';
        numericAmount = numValue;
      }

      if (isNaN(numericAmount) || numericAmount === 0) continue;

      const transactionDate = dateValue ? new Date(dateValue).toISOString() : new Date().toISOString();

      // Check for duplicates
      const { data: existing } = await supabase
        .from('transactions')
        .select('id')
        .eq('telegram_user_id', String(userId))
        .eq('amount', numericAmount)
        .eq('type', type)
        .eq('transaction_date', transactionDate)
        .maybeSingle();

      if (existing) {
        console.log('Transaction already exists, skipping');
        continue;
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          telegram_user_id: String(userId),
          amount: numericAmount,
          type,
          category,
          description,
          transaction_date: transactionDate,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
      } else {
        console.log('Transaction saved:', data);
        savedTransactions.push(data);
      }
    }

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Transaction saved:', data);

    return new Response(
      JSON.stringify({ success: true, transaction: data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});