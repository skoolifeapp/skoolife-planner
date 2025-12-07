import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import type { FinanceTransaction } from '@/types/finance';

interface BudgetSummaryCardsProps {
  transactions: FinanceTransaction[];
  selectedMonth: string;
  monthlyIncomeEstimate?: number;
}

export const BudgetSummaryCards = ({ 
  transactions, 
  selectedMonth,
  monthlyIncomeEstimate 
}: BudgetSummaryCardsProps) => {
  // Filter transactions for selected month
  const monthTransactions = transactions.filter(t => 
    t.date.startsWith(selectedMonth)
  );

  // Calculate totals
  const expenses = monthTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const income = monthTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = (monthlyIncomeEstimate || income) - expenses;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dépenses</p>
              <p className="text-2xl font-bold text-destructive mt-1">
                -{formatAmount(expenses)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-destructive" />
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-destructive/20" />
      </Card>

      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenus</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                +{formatAmount(income)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500/20" />
      </Card>

      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reste à vivre</p>
              <p className={`text-2xl font-bold mt-1 ${remaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {formatAmount(remaining)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20" />
      </Card>
    </div>
  );
};
