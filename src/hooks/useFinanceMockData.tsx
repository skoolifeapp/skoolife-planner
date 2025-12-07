import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, subDays } from 'date-fns';

export const useFinanceMockData = () => {
  const { user } = useAuth();

  const createMockData = async () => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      // 1. Create a mock bank account
      const { data: account, error: accountError } = await supabase
        .from('finance_accounts')
        .insert({
          user_id: user.id,
          provider: 'mock',
          provider_account_id: `mock_${Date.now()}`,
          name: 'Compte Courant',
          currency: 'EUR',
          balance: 1247.53
        })
        .select()
        .single();

      if (accountError) throw accountError;

      // 2. Get categories
      const { data: categories } = await supabase
        .from('finance_categories')
        .select('*')
        .or('user_id.is.null');

      const categoryMap: Record<string, string> = {};
      (categories || []).forEach((cat: any) => {
        categoryMap[cat.name] = cat.id;
      });

      // 3. Create mock transactions
      const today = new Date();
      const mockTransactions = [
        // Revenus
        { days: 2, label: 'VIREMENT ALTERNANCE ENTREPRISE', amount: 1100, category: 'Revenus' },
        { days: 15, label: 'VIREMENT CAF', amount: 200, category: 'Revenus' },
        
        // Logement
        { days: 1, label: 'LOYER DECEMBRE - NEXITY', amount: -450, category: 'Logement' },
        
        // Courses
        { days: 3, label: 'CARREFOUR MARKET', amount: -34.56, category: 'Courses' },
        { days: 7, label: 'LIDL', amount: -28.90, category: 'Courses' },
        { days: 12, label: 'AUCHAN', amount: -52.30, category: 'Courses' },
        
        // Transport
        { days: 1, label: 'NAVIGO MENSUEL', amount: -86.40, category: 'Transport' },
        { days: 5, label: 'UBER *TRIP', amount: -12.50, category: 'Transport' },
        
        // Restaurants
        { days: 2, label: 'MCDONALDS', amount: -9.80, category: 'Restaurants' },
        { days: 6, label: 'DELIVEROO', amount: -18.90, category: 'Restaurants' },
        { days: 10, label: 'SUSHI SHOP', amount: -15.50, category: 'Restaurants' },
        
        // Loisirs
        { days: 4, label: 'SPOTIFY', amount: -5.99, category: 'Abonnements' },
        { days: 4, label: 'NETFLIX', amount: -13.49, category: 'Abonnements' },
        { days: 8, label: 'CINEMA UGC', amount: -11.50, category: 'Loisirs' },
        
        // Santé
        { days: 14, label: 'PHARMACIE', amount: -8.50, category: 'Santé' },
        
        // Autres
        { days: 9, label: 'AMAZON', amount: -29.99, category: 'Autres' },
        { days: 11, label: 'FNAC', amount: -45.00, category: 'Autres' },
      ];

      const transactionsToInsert = mockTransactions.map(t => ({
        user_id: user.id,
        account_id: account.id,
        date: format(subDays(today, t.days), 'yyyy-MM-dd'),
        amount: t.amount,
        currency: 'EUR',
        label: t.label,
        category_id: categoryMap[t.category] || null,
        source: 'bank_api'
      }));

      const { error: transError } = await supabase
        .from('finance_transactions')
        .insert(transactionsToInsert);

      if (transError) throw transError;

      // 4. Create finance settings
      await supabase
        .from('finance_settings')
        .upsert({
          user_id: user.id,
          monthly_income_estimate: 1300,
          has_seen_finance_tutorial: false
        }, {
          onConflict: 'user_id'
        });

      return { success: true, accountId: account.id };
    } catch (error) {
      console.error('Error creating mock data:', error);
      return { error };
    }
  };

  return { createMockData };
};
