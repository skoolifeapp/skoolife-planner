import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';
import type { FinanceTransaction, FinanceCategory, FinanceBudget } from '@/types/finance';
import * as LucideIcons from 'lucide-react';

interface BudgetProgressSectionProps {
  transactions: FinanceTransaction[];
  categories: FinanceCategory[];
  budgets: FinanceBudget[];
  selectedMonth: string;
  onUpdateBudget: (categoryId: string, month: string, amount: number) => Promise<void>;
}

export const BudgetProgressSection = ({
  transactions,
  categories,
  budgets,
  selectedMonth,
  onUpdateBudget
}: BudgetProgressSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [budgetValues, setBudgetValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Get only expense categories (exclude Revenus)
  const expenseCategories = categories.filter(c => c.name !== 'Revenus');

  // Calculate spending per category for the month
  const monthExpenses = transactions.filter(t => 
    t.date.startsWith(selectedMonth) && t.amount < 0
  );

  const spendingByCategory: Record<string, number> = {};
  monthExpenses.forEach(t => {
    if (t.category_id) {
      spendingByCategory[t.category_id] = (spendingByCategory[t.category_id] || 0) + Math.abs(t.amount);
    }
  });

  // Get budgets for the month
  const monthBudgets: Record<string, number> = {};
  budgets
    .filter(b => b.month === selectedMonth)
    .forEach(b => {
      monthBudgets[b.category_id] = b.amount;
    });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-./g, x => x[1].toUpperCase())] || LucideIcons.Circle;
    return Icon;
  };

  const openDialog = () => {
    // Initialize with current budgets
    const initial: Record<string, string> = {};
    expenseCategories.forEach(cat => {
      initial[cat.id] = (monthBudgets[cat.id] || 0).toString();
    });
    setBudgetValues(initial);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    
    for (const [categoryId, value] of Object.entries(budgetValues)) {
      const amount = parseFloat(value) || 0;
      if (amount > 0) {
        await onUpdateBudget(categoryId, selectedMonth, amount);
      }
    }
    
    setSaving(false);
    setDialogOpen(false);
  };

  // Get categories that have spending or budgets
  const activeCategories = expenseCategories.filter(cat => 
    spendingByCategory[cat.id] > 0 || monthBudgets[cat.id] > 0
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Mes budgets par catégorie</CardTitle>
          <Button variant="outline" size="sm" onClick={openDialog}>
            <Settings2 className="w-4 h-4 mr-2" />
            Définir mes budgets
          </Button>
        </CardHeader>
        <CardContent>
          {activeCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Définis tes budgets pour mieux maîtriser tes dépenses
              </p>
              <Button variant="outline" onClick={openDialog}>
                Créer mes budgets
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeCategories.map(category => {
                const spent = spendingByCategory[category.id] || 0;
                const budget = monthBudgets[category.id] || 0;
                const percentage = budget > 0 ? Math.min((spent / budget) * 100, 150) : 0;
                const IconComponent = getIcon(category.icon);

                let progressColor = 'bg-green-500';
                if (percentage >= 100) progressColor = 'bg-destructive';
                else if (percentage >= 80) progressColor = 'bg-orange-500';

                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" style={{ color: category.color }} />
                        <span className="font-medium text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatAmount(spent)} / {budget > 0 ? formatAmount(budget) : '—'}
                      </span>
                    </div>
                    {budget > 0 && (
                      <div className="relative">
                        <Progress value={Math.min(percentage, 100)} className="h-2" />
                        {percentage > 100 && (
                          <div 
                            className="absolute top-0 right-0 h-2 rounded-r-full bg-destructive/50"
                            style={{ width: `${Math.min(percentage - 100, 50)}%` }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Définir mes budgets</DialogTitle>
            <DialogDescription>
              Fixe un plafond mensuel pour chaque catégorie de dépenses
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto py-4">
            {expenseCategories.map(category => {
              const IconComponent = getIcon(category.icon);
              return (
                <div key={category.id} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-32">
                    <IconComponent className="w-4 h-4" style={{ color: category.color }} />
                    <Label className="text-sm">{category.name}</Label>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        step="10"
                        value={budgetValues[category.id] || ''}
                        onChange={(e) => setBudgetValues(prev => ({
                          ...prev,
                          [category.id]: e.target.value
                        }))}
                        placeholder="0"
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        €
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
