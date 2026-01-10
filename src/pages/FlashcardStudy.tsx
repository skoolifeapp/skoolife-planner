import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { StudyMode } from "@/components/flashcards/StudyMode";
import { useDueFlashcards, useFlashcardDecks } from "@/hooks/useFlashcards";

export default function FlashcardStudy() {
  const { deckId } = useParams<{ deckId: string }>();
  
  const { data: decks } = useFlashcardDecks();
  const { data: dueCards, isLoading } = useDueFlashcards(deckId);

  const deck = deckId ? decks?.find((d) => d.id === deckId) : null;
  const deckName = deck?.name || "Toutes les cartes";

  if (isLoading) {
    return (
      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-2 w-full mb-8" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <StudyMode 
        cards={dueCards || []} 
        deckName={deckName}
        deckId={deckId || "all"}
      />
    </main>
  );
}
