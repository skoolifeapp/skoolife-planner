import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, PieChart, Wallet, ListChecks } from 'lucide-react';

interface BudgetTutorialOverlayProps {
  onComplete: () => void;
}

const tutorialSteps = [
  {
    icon: Wallet,
    title: 'Synthèse du mois',
    description: 'Ici, tu vois en un coup d\'œil tes dépenses, tes revenus et ton reste à vivre du mois.',
    target: 'summary'
  },
  {
    icon: PieChart,
    title: 'Répartition des dépenses',
    description: 'Là, tu vois où part ton argent, catégorie par catégorie.',
    target: 'chart'
  },
  {
    icon: ListChecks,
    title: 'Transactions & Budgets',
    description: 'En bas, tu peux voir toutes tes transactions, changer leur catégorie, et fixer des budgets par catégorie pour éviter les mauvaises surprises.',
    target: 'transactions'
  }
];

export const BudgetTutorialOverlay = ({ onComplete }: BudgetTutorialOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];
  const IconComponent = step.icon;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative animate-scale-in">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onComplete}
        >
          <X className="w-4 h-4" />
        </Button>

        <CardContent className="pt-8 pb-6 px-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <IconComponent className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </Button>

            <Button onClick={handleNext}>
              {currentStep === tutorialSteps.length - 1 ? (
                'Terminer'
              ) : (
                <>
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
