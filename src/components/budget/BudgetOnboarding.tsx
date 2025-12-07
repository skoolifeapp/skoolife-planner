import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, PieChart, Target, Loader2 } from 'lucide-react';
import { useFinanceMockData } from '@/hooks/useFinanceMockData';

interface BudgetOnboardingProps {
  onComplete: () => void;
  onConnectBank: () => void;
}

export const BudgetOnboarding = ({ onComplete, onConnectBank }: BudgetOnboardingProps) => {
  const { createMockData } = useFinanceMockData();
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleDemoData = async () => {
    setLoadingDemo(true);
    const result = await createMockData();
    setLoadingDemo(false);
    
    if (result.success) {
      onComplete();
    }
  };

  const steps = [
    {
      icon: CreditCard,
      title: 'Connecte ton compte bancaire',
      description: 'Skoolife récupère seulement les mouvements pour t\'aider à suivre ton budget. Aucune opération n\'est possible depuis l\'app.'
    },
    {
      icon: PieChart,
      title: 'Vois où part ton argent',
      description: 'Dépenses regroupées par catégories : logement, food, transports, etc.'
    },
    {
      icon: Target,
      title: 'Crée ton budget étudiant',
      description: 'Fixe des plafonds par catégorie et suis ton reste à vivre.'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Gère ton budget étudiant 💰
          </h1>
          <p className="text-lg text-muted-foreground">
            Garde un œil sur tes dépenses et atteins tes objectifs financiers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </CardContent>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {index + 1}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            onClick={onConnectBank}
            className="w-full sm:w-auto"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Connecter mon compte
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleDemoData}
            disabled={loadingDemo}
            className="w-full sm:w-auto"
          >
            {loadingDemo ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : null}
            Tester avec des données de démo
          </Button>
        </div>
      </div>
    </div>
  );
};
