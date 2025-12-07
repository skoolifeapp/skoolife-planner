import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import logo from '@/assets/logo.png';

import { BudgetOnboarding } from '@/components/budget/BudgetOnboarding';
import { ConnectBankDialog } from '@/components/budget/ConnectBankDialog';
import { BudgetSummaryCards } from '@/components/budget/BudgetSummaryCards';
import { CategoryChart } from '@/components/budget/CategoryChart';
import { TransactionList } from '@/components/budget/TransactionList';
import { BudgetProgressSection } from '@/components/budget/BudgetProgressSection';
import { BudgetTutorialOverlay } from '@/components/budget/BudgetTutorialOverlay';

const Budget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    accounts, categories, transactions, budgets, settings, 
    loading, fetchData, updateTransactionCategory, updateBudget, updateSettings 
  } = useFinanceData();

  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!loading && accounts.length > 0 && settings && !settings.has_seen_finance_tutorial) {
      setShowTutorial(true);
    }
  }, [loading, accounts, settings]);

  const handleTutorialComplete = async () => {
    setShowTutorial(false);
    await updateSettings({ has_seen_finance_tutorial: true });
  };

  const handleConnectSuccess = () => {
    fetchData();
  };

  // Generate month options (last 12 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy', { locale: fr })
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  // Show onboarding if no accounts
  if (accounts.length === 0) {
    return (
      <>
        <BudgetOnboarding 
          onComplete={fetchData}
          onConnectBank={() => setConnectDialogOpen(true)}
        />
        <ConnectBankDialog 
          open={connectDialogOpen}
          onOpenChange={setConnectDialogOpen}
          onSuccess={handleConnectSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/app" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={logo} alt="Skoolife" className="w-8 h-8 rounded-lg" />
              <span className="font-bold hidden sm:inline">Skoolife</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-semibold">Mon Budget</h1>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowTutorial(true)}
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <BudgetSummaryCards 
          transactions={transactions}
          selectedMonth={selectedMonth}
          monthlyIncomeEstimate={settings?.monthly_income_estimate}
        />

        {/* Chart + Budgets */}
        <div className="grid lg:grid-cols-2 gap-6">
          <CategoryChart 
            transactions={transactions}
            categories={categories}
            selectedMonth={selectedMonth}
          />
          <BudgetProgressSection
            transactions={transactions}
            categories={categories}
            budgets={budgets}
            selectedMonth={selectedMonth}
            onUpdateBudget={async (catId, month, amount) => {
              await updateBudget(catId, month, amount);
            }}
          />
        </div>

        {/* Transactions */}
        <TransactionList
          transactions={transactions}
          categories={categories}
          selectedMonth={selectedMonth}
          onUpdateCategory={async (id, catId) => {
            await updateTransactionCategory(id, catId);
          }}
        />
      </main>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <BudgetTutorialOverlay onComplete={handleTutorialComplete} />
      )}

      {/* Connect Dialog */}
      <ConnectBankDialog 
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        onSuccess={handleConnectSuccess}
      />
    </div>
  );
};

export default Budget;
