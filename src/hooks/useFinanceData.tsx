import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { 
  FinanceAccount, 
  FinanceCategory, 
  FinanceTransaction, 
  FinanceBudget, 
  FinanceSettings 
} from '@/types/finance';

export const useFinanceData = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [budgets, setBudgets] = useState<FinanceBudget[]>([]);
  const [settings, setSettings] = useState<FinanceSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch accounts
      const { data: accountsData } = await supabase
        .from('finance_accounts')
        .select('*')
        .eq('user_id', user.id);
      setAccounts((accountsData as FinanceAccount[]) || []);

      // Fetch categories (global + user's own)
      const { data: categoriesData } = await supabase
        .from('finance_categories')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${user.id}`);
      setCategories((categoriesData as FinanceCategory[]) || []);

      // Fetch transactions with category join
      const { data: transactionsData } = await supabase
        .from('finance_transactions')
        .select('*, category:finance_categories(*)')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      setTransactions((transactionsData as FinanceTransaction[]) || []);

      // Fetch budgets
      const { data: budgetsData } = await supabase
        .from('finance_budgets')
        .select('*, category:finance_categories(*)')
        .eq('user_id', user.id);
      setBudgets((budgetsData as FinanceBudget[]) || []);

      // Fetch settings
      const { data: settingsData } = await supabase
        .from('finance_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      setSettings(settingsData as FinanceSettings | null);

    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateTransactionCategory = async (transactionId: string, categoryId: string | null) => {
    if (!user) return;

    const { error } = await supabase
      .from('finance_transactions')
      .update({ category_id: categoryId })
      .eq('id', transactionId)
      .eq('user_id', user.id);

    if (!error) {
      await fetchData();
    }
    return { error };
  };

  const createCategory = async (name: string, icon: string, color: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('finance_categories')
      .insert({ user_id: user.id, name, icon, color })
      .select()
      .single();

    if (!error) {
      await fetchData();
    }
    return { data, error };
  };

  const updateBudget = async (categoryId: string, month: string, amount: number) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Try to upsert
    const { error } = await supabase
      .from('finance_budgets')
      .upsert({
        user_id: user.id,
        category_id: categoryId,
        month,
        amount
      }, {
        onConflict: 'user_id,category_id,month'
      });

    if (!error) {
      await fetchData();
    }
    return { error };
  };

  const updateSettings = async (updates: Partial<FinanceSettings>) => {
    if (!user) return { error: new Error('Not authenticated') };

    if (settings) {
      const { error } = await supabase
        .from('finance_settings')
        .update(updates)
        .eq('user_id', user.id);
      
      if (!error) {
        await fetchData();
      }
      return { error };
    } else {
      const { error } = await supabase
        .from('finance_settings')
        .insert({ user_id: user.id, ...updates });
      
      if (!error) {
        await fetchData();
      }
      return { error };
    }
  };

  return {
    accounts,
    categories,
    transactions,
    budgets,
    settings,
    loading,
    fetchData,
    updateTransactionCategory,
    createCategory,
    updateBudget,
    updateSettings
  };
};
