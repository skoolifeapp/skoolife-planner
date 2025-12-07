import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { FinanceTransaction, FinanceCategory } from '@/types/finance';
import * as LucideIcons from 'lucide-react';

interface TransactionListProps {
  transactions: FinanceTransaction[];
  categories: FinanceCategory[];
  selectedMonth: string;
  onUpdateCategory: (transactionId: string, categoryId: string | null) => Promise<void>;
}

export const TransactionList = ({ 
  transactions, 
  categories, 
  selectedMonth,
  onUpdateCategory 
}: TransactionListProps) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expenses' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  // Filter transactions
  const filteredTransactions = transactions
    .filter(t => t.date.startsWith(selectedMonth))
    .filter(t => t.label.toLowerCase().includes(search.toLowerCase()))
    .filter(t => {
      if (typeFilter === 'expenses') return t.amount < 0;
      if (typeFilter === 'income') return t.amount > 0;
      return true;
    })
    .filter(t => {
      if (categoryFilter === 'all') return true;
      if (categoryFilter === 'uncategorized') return !t.category_id;
      return t.category_id === categoryFilter;
    });

  const formatAmount = (amount: number) => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.abs(amount));
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-./g, x => x[1].toUpperCase())] || LucideIcons.Circle;
    return Icon;
  };

  const handleCategoryChange = async (transactionId: string, categoryId: string) => {
    await onUpdateCategory(transactionId, categoryId === 'none' ? null : categoryId);
    setOpenPopover(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transactions</CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tout</SelectItem>
              <SelectItem value="expenses">Dépenses</SelectItem>
              <SelectItem value="income">Revenus</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              <SelectItem value="uncategorized">Non catégorisé</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune transaction trouvée
            </p>
          ) : (
            filteredTransactions.map((transaction) => {
              const category = categories.find(c => c.id === transaction.category_id);
              const IconComponent = category ? getIcon(category.icon) : LucideIcons.HelpCircle;
              
              return (
                <div 
                  key={transaction.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: (category?.color || '#6B7280') + '20' }}
                  >
                    <IconComponent 
                      className="w-5 h-5" 
                      style={{ color: category?.color || '#6B7280' }} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{transaction.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(transaction.date), 'd MMMM', { locale: fr })}
                    </p>
                  </div>

                  <Popover 
                    open={openPopover === transaction.id} 
                    onOpenChange={(open) => setOpenPopover(open ? transaction.id : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer"
                          style={{ 
                            borderColor: category?.color || '#6B7280',
                            color: category?.color || '#6B7280'
                          }}
                        >
                          {category?.name || 'Catégoriser'}
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </Badge>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="end">
                      <div className="space-y-1">
                        {categories.map(cat => {
                          const CatIcon = getIcon(cat.icon);
                          return (
                            <Button
                              key={cat.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => handleCategoryChange(transaction.id, cat.id)}
                            >
                              <CatIcon className="w-4 h-4 mr-2" style={{ color: cat.color }} />
                              {cat.name}
                            </Button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <span className={`font-semibold text-sm min-w-20 text-right ${
                    transaction.amount < 0 ? 'text-destructive' : 'text-green-600'
                  }`}>
                    {formatAmount(transaction.amount)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
