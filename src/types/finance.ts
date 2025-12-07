export interface FinanceAccount {
  id: string;
  user_id: string;
  provider: string;
  provider_account_id?: string;
  name: string;
  iban?: string;
  currency: string;
  balance: number;
  last_sync_at?: string;
  created_at: string;
}

export interface FinanceCategory {
  id: string;
  user_id?: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface FinanceTransaction {
  id: string;
  user_id: string;
  account_id: string;
  date: string;
  amount: number;
  currency: string;
  label: string;
  category_id?: string;
  source: string;
  created_at: string;
  category?: FinanceCategory;
}

export interface FinanceBudget {
  id: string;
  user_id: string;
  category_id: string;
  month: string;
  amount: number;
  created_at: string;
  category?: FinanceCategory;
}

export interface FinanceSettings {
  id: string;
  user_id: string;
  monthly_income_estimate?: number;
  has_seen_finance_tutorial: boolean;
  primary_account_id?: string;
  created_at: string;
  updated_at: string;
}
