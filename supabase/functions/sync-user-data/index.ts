import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const N8N_WEBHOOK_URL = 'https://shinespiceclover.app.n8n.cloud/webhook-test/4325a91a-d6f2-4445-baed-3103efc663d5';

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

    let n8nData: any = null;
    let rawText = '';

    try {
      rawText = await n8nResponse.text();
      n8nData = rawText ? JSON.parse(rawText) : null;
    } catch (e) {
      console.error('Failed to parse n8n JSON response:', e);
      console.error('Raw response text:', rawText);
      n8nData = null;
    }

    console.log('=== RAW n8n RESPONSE START ===');
    console.log('Type:', typeof n8nData);
    console.log('Is Array:', Array.isArray(n8nData));
    console.log('Data:', JSON.stringify(n8nData, null, 2));
    console.log('=== RAW n8n RESPONSE END ===');

    // n8n may return:
    // - array of items
    // - object wrapper: { transactions: [...] } / { data: [...] }
    // - single object item
    const transactionsFromN8n: any[] = Array.isArray(n8nData)
      ? (n8nData as any[])
      : Array.isArray(n8nData?.transactions)
        ? (n8nData.transactions as any[])
        : Array.isArray(n8nData?.data)
          ? (n8nData.data as any[])
          : (n8nData ? [n8nData] : []);

    // Transform n8n data to transaction format (without saving to DB)
    // Support both English and Cyrillic field names from n8n
    const transactions = transactionsFromN8n
      .filter((item: any) => {
        // Check for money field in both formats
        const money = item?.money ?? item?.['деньги'] ?? item?.amount ?? item?.['сума'];
        return item && money !== undefined;
      })
      .map((item: any, index: number) => {
        // Support both field name formats (English and Cyrillic)
        const rawMoney = item.money ?? item['деньги'] ?? item.amount ?? item['сума'];
        const moneyValue = Number(rawMoney);
        const type = moneyValue < 0 ? 'expense' : 'income';
        const amount = Math.abs(moneyValue);

        // Use 'data' or 'данные' or 'date' field from n8n for date
        const dateField = item.data ?? item['данные'] ?? item.date ?? item['дата'];
        let transactionDate = new Date().toISOString();
        
        if (dateField) {
          try {
            const parsedDate = new Date(dateField);
            // Check if date is valid
            if (!isNaN(parsedDate.getTime())) {
              transactionDate = parsedDate.toISOString();
            } else {
              console.warn(`Invalid date for item ${index}:`, dateField);
            }
          } catch (e) {
            console.warn(`Failed to parse date for item ${index}:`, dateField, e);
          }
        }

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
      .filter((t: any) => t.amount > 0);

    console.log(
      'Transformed transactions:',
      transactions.length,
      transactions.map((t: any) => ({ id: t.id, amount: t.amount, category: t.category }))
    );

    // Optional additional data from n8n: categories, regular payments, family budget status
    const categories = Array.isArray((n8nData as any)?.categories)
      ? ((n8nData as any).categories as any[]).map((c) => String(c))
      : Array.isArray((n8nData as any)?.['категорії'])
        ? ((n8nData as any)['категорії'] as any[]).map((c) => String(c))
        : [];

    const mapRegular = (items: any[] | undefined | null, fallbackType: 'income' | 'expense') => {
      if (!items || !Array.isArray(items)) return [] as any[];
      return items
        .map((item: any, index: number) => {
          const rawAmount = item.amount ?? item.money ?? item['сума'];
          const amount = Number(rawAmount);
          if (!amount || isNaN(amount)) return null;

          const dayField = item.dayOfMonth ?? item.day_of_month ?? item['день'];
          const dayOfMonth = dayField !== undefined ? Number(dayField) : undefined;

          return {
            id: item.id
              ? String(item.id)
              : `${fallbackType}-reg-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            type: (item.type === 'income' || item.type === 'expense') ? item.type : fallbackType,
            amount,
            description: item.description ?? item['опис'] ?? '',
            dayOfMonth,
          };
        })
        .filter((p: any) => p && p.amount > 0);
    };

    const rawRegularIncomes =
      (n8nData as any)?.regularIncomes ??
      (n8nData as any)?.regular_incomes ??
      (n8nData as any)?.['регулярні_доходи'];

    const rawRegularExpenses =
      (n8nData as any)?.regularExpenses ??
      (n8nData as any)?.regular_expenses ??
      (n8nData as any)?.['регулярні_витрати'];

    const regularIncomes = mapRegular(rawRegularIncomes, 'income');
    const regularExpenses = mapRegular(rawRegularExpenses, 'expense');

    const familyUserId =
      (n8nData as any)?.familyUserId ??
      (n8nData as any)?.family_user_id ??
      (n8nData as any)?.['сімейний_кабінет'] ??
      null;

    return new Response(
      JSON.stringify({ 
        success: true, 
        transactions,
        categories,
        regularIncomes,
        regularExpenses,
        familyUserId,
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
