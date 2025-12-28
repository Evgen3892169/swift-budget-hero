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

    // Expected format from n8n:
    // { telegram_user_id: "123", amount: "-100" or "+500", category: "food", description: "...", date: "2024-01-15T10:00:00Z" }
    
    const { telegram_user_id, amount, category, description, date } = body;

    if (!telegram_user_id || amount === undefined) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing telegram_user_id or amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse amount: "+" prefix = income, "-" prefix = expense
    const amountStr = String(amount);
    let type: 'income' | 'expense';
    let numericAmount: number;

    if (amountStr.startsWith('+')) {
      type = 'income';
      numericAmount = Math.abs(parseFloat(amountStr.substring(1)));
    } else if (amountStr.startsWith('-')) {
      type = 'expense';
      numericAmount = Math.abs(parseFloat(amountStr.substring(1)));
    } else {
      // If no prefix, assume it's an expense if negative, income if positive
      numericAmount = parseFloat(amountStr);
      type = numericAmount >= 0 ? 'income' : 'expense';
      numericAmount = Math.abs(numericAmount);
    }

    const transactionDate = date ? new Date(date).toISOString() : new Date().toISOString();

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        telegram_user_id: String(telegram_user_id),
        amount: numericAmount,
        type,
        category: category || null,
        description: description || null,
        transaction_date: transactionDate,
      })
      .select()
      .single();

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