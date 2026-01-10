import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateFlashcardDialog } from "@/components/flashcards/CreateFlashcardDialog";
import { FlashcardItem } from "@/components/flashcards/FlashcardItem";
import { DeckStatsDisplay } from "@/components/flashcards/DeckStats";
import { useFlashcards, useFlashcardDecks, useDeckStats } from "@/hooks/useFlashcards";

export default function FlashcardDeck() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const { data: decks } = useFlashcardDecks();
  const { data: cards, isLoading: cardsLoading } = useFlashcards(deckId || null);
  const { data: stats } = useDeckStats(deckId || null);

  const deck = decks?.find((d) => d.id === deckId);

  if (!deck) {
    return (
      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-32 mb-8" />
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate("/flashcards")}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{deck.name}</h1>
                    {deck.subject && (
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: `${deck.subject.color}20`,
                          color: deck.subject.color || undefined,
                        }}
                      >
                        {deck.subject.name}
                      </Badge>
                    )}
                  </div>
                  {deck.description && (
                    <p className="text-muted-foreground mt-1">{deck.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {cards && cards.length > 0 && (
                    <Button onClick={() => navigate(`/flashcards/${deckId}/study`)}>
                      <Play className="h-4 w-4 mr-2" />
                      Étudier
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              {stats && <DeckStatsDisplay stats={stats} />}

              {/* Cards section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    Cartes ({cards?.length || 0})
                  </h2>
                  <CreateFlashcardDialog deckId={deckId!} />
                </div>

                {cardsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20" />
                    ))}
                  </div>
                ) : cards && cards.length > 0 ? (
                  <div className="space-y-3">
                    {cards.map((card) => (
                      <FlashcardItem key={card.id} card={card} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">Aucune carte dans ce deck</p>
                    <CreateFlashcardDialog deckId={deckId!} />
                  </div>
                )}
              </div>
            </div>
          </main>
  );
}
