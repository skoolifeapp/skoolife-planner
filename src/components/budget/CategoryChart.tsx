import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { FinanceTransaction, FinanceCategory } from '@/types/finance';

interface CategoryChartProps {
  transactions: FinanceTransaction[];
  categories: FinanceCategory[];
  selectedMonth: string;
}

export const CategoryChart = ({ transactions, categories, selectedMonth }: CategoryChartProps) => {
  // Filter expenses for selected month
  const monthExpenses = transactions.filter(t => 
    t.date.startsWith(selectedMonth) && t.amount < 0
  );

  // Group by category
  const categoryTotals: Record<string, { name: string; value: number; color: string }> = {};
  
  monthExpenses.forEach(t => {
    const category = categories.find(c => c.id === t.category_id);
    const categoryName = category?.name || 'Non catégorisé';
    const categoryColor = category?.color || '#6B7280';
    
    if (!categoryTotals[categoryName]) {
      categoryTotals[categoryName] = { name: categoryName, value: 0, color: categoryColor };
    }
    categoryTotals[categoryName].value += Math.abs(t.amount);
  });

  const chartData = Object.values(categoryTotals).sort((a, b) => b.value - a.value);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.value, 0);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Répartition par catégorie</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Aucune dépense ce mois-ci</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Répartition par catégorie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatAmount(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend below chart */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {chartData.slice(0, 6).map((item, index) => {
            const percentage = ((item.value / totalExpenses) * 100).toFixed(0);
            return (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-sm truncate">{item.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
