import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Layers, Play, Trash2, MoreVertical, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { FlashcardDeck } from "@/types/flashcards";
import { useDeleteDeck, useDeckStats } from "@/hooks/useFlashcards";
import { toast } from "sonner";

interface DeckCardProps {
  deck: FlashcardDeck;
  onEdit?: (deck: FlashcardDeck) => void;
}

export function DeckCard({ deck, onEdit }: DeckCardProps) {
  const navigate = useNavigate();
  const deleteDeck = useDeleteDeck();
  const { data: stats } = useDeckStats(deck.id);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteDeck.mutateAsync(deck.id);
      toast.success("Deck supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div 
              className="flex-1"
              onClick={() => navigate(`/flashcards/${deck.id}`)}
            >
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                {deck.name}
              </CardTitle>
              {deck.subject && (
                <Badge
                  variant="secondary"
                  className="mt-1"
                  style={{
                    backgroundColor: `${deck.subject.color}20`,
                    color: deck.subject.color || undefined,
                  }}
                >
                  {deck.subject.name}
                </Badge>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(deck)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent onClick={() => navigate(`/flashcards/${deck.id}`)}>
          {deck.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {deck.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                {deck.card_count} carte{deck.card_count > 1 ? "s" : ""}
              </span>
              {stats && stats.dueCards > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.dueCards} à revoir
                </Badge>
              )}
            </div>
            {deck.last_studied_at && (
              <span className="text-xs text-muted-foreground">
                Étudié {formatDistanceToNow(new Date(deck.last_studied_at), { 
                  addSuffix: true,
                  locale: fr 
                })}
              </span>
            )}
          </div>

          {deck.card_count > 0 && (
            <Button 
              className="w-full mt-4"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/flashcards/${deck.id}/study`);
              }}
            >
              <Play className="h-4 w-4 mr-2" />
              Étudier
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce deck ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le deck "{deck.name}" et toutes ses cartes.
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
