import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Loader2, Building2 } from 'lucide-react';
import { useFinanceMockData } from '@/hooks/useFinanceMockData';

interface ConnectBankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const mockBanks = [
  { id: 'bnp', name: 'BNP Paribas', color: '#009E60' },
  { id: 'sg', name: 'Société Générale', color: '#E60012' },
  { id: 'ca', name: 'Crédit Agricole', color: '#0E7D4E' },
  { id: 'lcl', name: 'LCL', color: '#002855' },
  { id: 'bourso', name: 'Boursorama', color: '#FF6600' },
  { id: 'revolut', name: 'Revolut', color: '#0075EB' },
];

export const ConnectBankDialog = ({ open, onOpenChange, onSuccess }: ConnectBankDialogProps) => {
  const { createMockData } = useFinanceMockData();
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (bankId: string) => {
    setConnecting(bankId);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await createMockData();
    setConnecting(null);

    if (result.success) {
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Connecter un compte bancaire</DialogTitle>
          <DialogDescription>
            Sélectionne ta banque pour synchroniser tes transactions
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10 mb-4">
          <Shield className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Connexion sécurisée et en lecture seule. Aucune opération ne peut être effectuée depuis Skoolife.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {mockBanks.map((bank) => (
            <Card 
              key={bank.id}
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/30"
              onClick={() => !connecting && handleConnect(bank.id)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: bank.color + '20' }}
                >
                  <Building2 className="w-5 h-5" style={{ color: bank.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{bank.name}</p>
                </div>
                {connecting === bank.id && (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Note : Il s'agit d'une simulation. Les données créées sont fictives.
        </p>
      </DialogContent>
    </Dialog>
  );
};
