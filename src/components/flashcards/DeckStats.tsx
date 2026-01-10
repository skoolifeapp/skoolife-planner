import { Brain, CheckCircle, Clock, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DeckStats as DeckStatsType } from "@/types/flashcards";

interface DeckStatsProps {
  stats: DeckStatsType;
}

export function DeckStatsDisplay({ stats }: DeckStatsProps) {
  const masteryPercentage = stats.totalCards > 0 
    ? Math.round((stats.masteredCards / stats.totalCards) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalCards}</p>
              <p className="text-xs text-muted-foreground">Cartes totales</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.dueCards}</p>
              <p className="text-xs text-muted-foreground">À réviser</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.masteredCards}</p>
              <p className="text-xs text-muted-foreground">Maîtrisées</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round(stats.correctRate)}%</p>
              <p className="text-xs text-muted-foreground">Réussite</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats.totalCards > 0 && (
        <Card className="col-span-2 md:col-span-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progression vers la maîtrise</span>
              <span className="text-sm text-muted-foreground">{masteryPercentage}%</span>
            </div>
            <Progress value={masteryPercentage} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{stats.learningCards} en apprentissage</span>
              <span>{stats.masteredCards} maîtrisées</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
