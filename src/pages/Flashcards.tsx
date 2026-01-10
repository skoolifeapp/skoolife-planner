import { useNavigate } from "react-router-dom";
import { Brain, Layers, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateDeckDialog } from "@/components/flashcards/CreateDeckDialog";
import { DeckCard } from "@/components/flashcards/DeckCard";
import { useFlashcardDecks, useDueFlashcards } from "@/hooks/useFlashcards";

export default function Flashcards() {
  const navigate = useNavigate();
  const { data: decks, isLoading: decksLoading } = useFlashcardDecks();
  const { data: dueCards } = useDueFlashcards();

  const totalDueCards = dueCards?.length || 0;

  return (
    <main className="p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Brain className="h-8 w-8 text-primary" />
                    Flashcards
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Mémorise efficacement avec la répétition espacée
                  </p>
                </div>
                <CreateDeckDialog />
              </div>

              {/* Quick study banner */}
              {totalDueCards > 0 && (
                <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/20">
                          <Play className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">
                            {totalDueCards} carte{totalDueCards > 1 ? "s" : ""} à réviser
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Maintiens ta progression en révisant régulièrement
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => navigate("/flashcards/study")}>
                        <Play className="h-4 w-4 mr-2" />
                        Réviser maintenant
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Decks grid */}
              {decksLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              ) : decks && decks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {decks.map((deck) => (
                    <DeckCard key={deck.id} deck={deck} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Layers className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Aucun deck créé</h2>
                    <p className="text-muted-foreground mb-6">
                      Crée ton premier deck de flashcards pour commencer à mémoriser efficacement.
                    </p>
                    <CreateDeckDialog />
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
  );
}
