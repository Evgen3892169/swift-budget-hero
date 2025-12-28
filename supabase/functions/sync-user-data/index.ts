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
    const { telegram_user_id } = await req.json();
    console.log('Fetching data for user:', telegram_user_id);

    if (!telegram_user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing telegram_user_id', transactions: [] }),
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
        JSON.stringify({ 
          success: false, 
          error: 'Webhook unavailable',
          transactions: [] 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const n8nData = await n8nResponse.json();
    console.log('Raw data from n8n:', JSON.stringify(n8nData));

    // n8n returns: { row_number, userid, data, money, category } or array
    const transactionsFromN8n = Array.isArray(n8nData) ? n8nData : (n8nData ? [n8nData] : []);
    
    console.log('Total items from n8n:', transactionsFromN8n.length);
    
    // Transform n8n data to transaction format (without saving to DB)
    // Support both English and Cyrillic field names from n8n
    const transactions = transactionsFromN8n
      .filter(item => {
        // Check for money field in both formats
        const money = item.money ?? item['деньги'];
        return item && money !== undefined;
      })
      .map((item, index) => {
        // Support both field name formats (English and Cyrillic)
        const moneyValue = Number(item.money ?? item['деньги']);
        const type = moneyValue < 0 ? 'expense' : 'income';
        const amount = Math.abs(moneyValue);
        
        // Use 'data' or 'данные' field from n8n for date
        const dateField = item.data ?? item['данные'];
        const transactionDate = dateField ? new Date(dateField).toISOString() : new Date().toISOString();

        // Use 'category' or 'категория' field
        const categoryField = item.category ?? item['категория'];

        // Create unique ID using row_number from n8n or index + timestamp + random
        const uniqueId = item.row_number 
          ? `n8n-row-${item.row_number}` 
          : `n8n-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        return {
          id: uniqueId,
          telegram_user_id: String(telegram_user_id),
          amount,
          type,
          category: categoryField || null,
          description: categoryField || null,
          transaction_date: transactionDate,
          created_at: new Date().toISOString(),
        };
      })
      .filter(t => t.amount > 0);

    console.log('Transformed transactions:', transactions.length, transactions.map(t => ({ id: t.id, amount: t.amount, category: t.category })));

    return new Response(
      JSON.stringify({ 
        success: true, 
        transactions 
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
