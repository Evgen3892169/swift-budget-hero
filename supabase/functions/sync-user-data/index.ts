import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const N8N_WEBHOOK_URL = 'https://gdgsnbkw.app.n8n.cloud/webhook/4325a91a-d6f2-4445-baed-3103efc663d5';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { telegram_user_id } = await req.json();
    console.log('Fetching data for user:', telegram_user_id);

    if (!telegram_user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing telegram_user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send user_id to n8n and get transactions back
    console.log('Calling n8n webhook...');
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: telegram_user_id }),
    });

    if (!n8nResponse.ok) {
      console.error('n8n webhook error:', n8nResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch from n8n', transactions: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const n8nData = await n8nResponse.json();
    console.log('Received from n8n:', n8nData);

    // n8n returns: { row_number, userid, data, money, category } or array
    const transactionsFromN8n = Array.isArray(n8nData) ? n8nData : (n8nData ? [n8nData] : []);
    
    const savedTransactions = [];

    for (const item of transactionsFromN8n) {
      // Use 'money' field from n8n (not 'amount')
      if (!item || item.money === undefined) continue;

      const moneyValue = Number(item.money);
      let type: 'income' | 'expense';
      let numericAmount: number;

      // Negative = expense, positive = income
      if (moneyValue < 0) {
        type = 'expense';
        numericAmount = Math.abs(moneyValue);
      } else {
        type = 'income';
        numericAmount = moneyValue;
      }

      if (isNaN(numericAmount) || numericAmount === 0) continue;

      // Use 'data' field from n8n (not 'date')
      const transactionDate = item.data ? new Date(item.data).toISOString() : new Date().toISOString();

      // Check if this transaction already exists (avoid duplicates)
      const { data: existing } = await supabase
        .from('transactions')
        .select('id')
        .eq('telegram_user_id', String(telegram_user_id))
        .eq('amount', numericAmount)
        .eq('type', type)
        .eq('category', item.category || null)
        .eq('transaction_date', transactionDate)
        .maybeSingle();

      if (existing) {
        console.log('Transaction already exists, skipping');
        continue;
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          telegram_user_id: String(telegram_user_id),
          amount: numericAmount,
          type,
          category: item.category || null,
          description: item.description || item.category || null,
          transaction_date: transactionDate,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving transaction:', error);
      } else {
        console.log('Saved transaction:', data);
        savedTransactions.push(data);
      }
    }

    // Return all transactions for this user
    const { data: allTransactions, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('telegram_user_id', String(telegram_user_id))
      .order('transaction_date', { ascending: false });

    if (fetchError) {
      console.error('Error fetching transactions:', fetchError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        newTransactions: savedTransactions.length,
        transactions: allTransactions || [] 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', transactions: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});