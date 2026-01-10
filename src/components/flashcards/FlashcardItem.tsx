import { useState } from "react";
import { Trash2, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Flashcard } from "@/types/flashcards";
import { getMasteryLevel } from "@/lib/sm2-algorithm";
import { useDeleteFlashcard } from "@/hooks/useFlashcards";
import { toast } from "sonner";

interface FlashcardItemProps {
  card: Flashcard;
  onEdit?: (card: Flashcard) => void;
}

export function FlashcardItem({ card, onEdit }: FlashcardItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteFlashcard = useDeleteFlashcard();

  const mastery = getMasteryLevel(Number(card.easiness_factor), card.repetition_count);

  const handleDelete = async () => {
    try {
      await deleteFlashcard.mutateAsync({ id: card.id, deckId: card.deck_id });
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium line-clamp-2">{card.front}</p>
                <Badge className={mastery.color}>{mastery.label}</Badge>
              </div>

              {expanded && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-muted-foreground whitespace-pre-wrap">{card.back}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span>EF: {Number(card.easiness_factor).toFixed(2)}</span>
                      <span>Intervalle: {card.interval_days}j</span>
                      <span>Révisions: {card.total_reviews}</span>
                      {card.total_reviews > 0 && (
                        <span>
                          Réussite: {Math.round((card.correct_reviews / card.total_reviews) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit?.(card)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette carte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
