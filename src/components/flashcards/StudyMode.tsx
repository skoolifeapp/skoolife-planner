import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Check, X, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flashcard, ReviewQuality } from "@/types/flashcards";
import { useReviewFlashcard } from "@/hooks/useFlashcards";
import { getQualityLabel, getQualityColor } from "@/lib/sm2-algorithm";
import { cn } from "@/lib/utils";

interface StudyModeProps {
  cards: Flashcard[];
  deckName: string;
  deckId: string;
}

export function StudyMode({ cards, deckName, deckId }: StudyModeProps) {
  const navigate = useNavigate();
  const reviewFlashcard = useReviewFlashcard();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<string[]>([]);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? (studiedCards.length / cards.length) * 100 : 0;
  const isComplete = studiedCards.length === cards.length;

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handleReview = async (quality: ReviewQuality) => {
    if (!currentCard) return;

    try {
      await reviewFlashcard.mutateAsync({ flashcard: currentCard, quality });
      
      setStudiedCards((prev) => [...prev, currentCard.id]);
      setSessionStats((prev) => ({
        correct: quality >= 3 ? prev.correct + 1 : prev.correct,
        incorrect: quality < 3 ? prev.incorrect + 1 : prev.incorrect,
      }));

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      }
    } catch (error) {
      console.error("Review error:", error);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedCards([]);
    setSessionStats({ correct: 0, incorrect: 0 });
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Brain className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Pas de cartes à réviser</h2>
        <p className="text-muted-foreground mb-6">
          Toutes les cartes sont à jour ou le deck est vide.
        </p>
        <Button onClick={() => navigate(`/flashcards/${deckId}`)}>
          Retour au deck
        </Button>
      </div>
    );
  }

  if (isComplete) {
    const successRate = Math.round((sessionStats.correct / cards.length) * 100);

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
            <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>
        
        <h2 className="text-2xl font-bold mb-2">Session terminée !</h2>
        <p className="text-muted-foreground mb-6">
          Tu as révisé {cards.length} carte{cards.length > 1 ? "s" : ""}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{sessionStats.correct}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{sessionStats.incorrect}</p>
              <p className="text-sm text-muted-foreground">À revoir</p>
            </CardContent>
          </Card>
        </div>

        <p className="text-lg mb-6">
          Taux de réussite : <span className="font-bold">{successRate}%</span>
        </p>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/flashcards/${deckId}`)}>
            Retour au deck
          </Button>
          <Button onClick={handleRestart}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Recommencer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(`/flashcards/${deckId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{deckName}</p>
          <p className="font-medium">
            {studiedCards.length + 1} / {cards.length}
          </p>
        </div>
        <div className="w-20" />
      </div>

      {/* Progress */}
      <Progress value={progress} className="mb-8" />

      {/* Flashcard */}
      <div className="perspective-1000 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className="min-h-[300px] cursor-pointer relative overflow-hidden"
              onClick={handleFlip}
            >
              <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isFlipped ? "back" : "front"}
                    initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide">
                      {isFlipped ? "Réponse" : "Question"}
                    </p>
                    <p className="text-xl whitespace-pre-wrap">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              
              {!isFlipped && (
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-sm text-muted-foreground">
                    Clique pour révéler la réponse
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Answer buttons */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <p className="text-center text-sm text-muted-foreground mb-4">
            Comment as-tu trouvé cette carte ?
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {([0, 1, 2, 3, 4, 5] as ReviewQuality[]).map((quality) => (
              <Button
                key={quality}
                variant="outline"
                className={cn(
                  "flex flex-col h-auto py-3 transition-all hover:scale-105",
                  quality < 3 && "hover:border-red-500",
                  quality >= 3 && "hover:border-green-500"
                )}
                onClick={() => handleReview(quality)}
                disabled={reviewFlashcard.isPending}
              >
                <span
                  className={cn(
                    "w-3 h-3 rounded-full mb-1",
                    getQualityColor(quality)
                  )}
                />
                <span className="text-xs">{getQualityLabel(quality)}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
