import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FlashcardDeck, Flashcard, DeckStats, ReviewQuality } from "@/types/flashcards";
import { calculateSM2 } from "@/lib/sm2-algorithm";

export function useFlashcardDecks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["flashcard-decks", user?.id],
    queryFn: async (): Promise<FlashcardDeck[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("flashcard_decks")
        .select(`
          *,
          subject:subjects(id, name, color)
        `)
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as FlashcardDeck[];
    },
    enabled: !!user,
  });
}

export function useFlashcards(deckId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["flashcards", deckId],
    queryFn: async (): Promise<Flashcard[]> => {
      if (!user || !deckId) return [];

      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("deck_id", deckId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Flashcard[];
    },
    enabled: !!user && !!deckId,
  });
}

export function useDueFlashcards(deckId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["due-flashcards", deckId, user?.id],
    queryFn: async (): Promise<Flashcard[]> => {
      if (!user) return [];

      let query = supabase
        .from("flashcards")
        .select("*")
        .eq("user_id", user.id)
        .lte("next_review_at", new Date().toISOString())
        .order("next_review_at", { ascending: true });

      if (deckId) {
        query = query.eq("deck_id", deckId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Flashcard[];
    },
    enabled: !!user,
  });
}

export function useDeckStats(deckId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["deck-stats", deckId],
    queryFn: async (): Promise<DeckStats | null> => {
      if (!user || !deckId) return null;

      const { data: cards, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("deck_id", deckId)
        .eq("user_id", user.id);

      if (error) throw error;

      const now = new Date().toISOString();
      const totalCards = cards.length;
      const masteredCards = cards.filter(c => c.easiness_factor >= 2.5 && c.repetition_count >= 3).length;
      const learningCards = cards.filter(c => c.repetition_count < 3).length;
      const dueCards = cards.filter(c => c.next_review_at <= now).length;
      const totalReviews = cards.reduce((sum, c) => sum + c.total_reviews, 0);
      const totalCorrect = cards.reduce((sum, c) => sum + c.correct_reviews, 0);

      return {
        totalCards,
        masteredCards,
        learningCards,
        dueCards,
        averageEasiness: totalCards > 0 
          ? cards.reduce((sum, c) => sum + Number(c.easiness_factor), 0) / totalCards 
          : 2.5,
        totalReviews,
        correctRate: totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0,
      };
    },
    enabled: !!user && !!deckId,
  });
}

export function useCreateDeck() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string; subject_id?: string }) => {
      if (!user) throw new Error("Non authentifié");

      const { data: deck, error } = await supabase
        .from("flashcard_decks")
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description || null,
          subject_id: data.subject_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return deck;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcard-decks"] });
    },
  });
}

export function useUpdateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; description?: string; subject_id?: string | null }) => {
      const { error } = await supabase
        .from("flashcard_decks")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcard-decks"] });
    },
  });
}

export function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("flashcard_decks")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcard-decks"] });
    },
  });
}

export function useCreateFlashcard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { deck_id: string; front: string; back: string }) => {
      if (!user) throw new Error("Non authentifié");

      const { data: card, error } = await supabase
        .from("flashcards")
        .insert({
          user_id: user.id,
          deck_id: data.deck_id,
          front: data.front,
          back: data.back,
        })
        .select()
        .single();

      if (error) throw error;
      return card;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["flashcards", variables.deck_id] });
      queryClient.invalidateQueries({ queryKey: ["flashcard-decks"] });
      queryClient.invalidateQueries({ queryKey: ["deck-stats"] });
    },
  });
}

export function useUpdateFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; front?: string; back?: string }) => {
      const { error } = await supabase
        .from("flashcards")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    },
  });
}

export function useDeleteFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, deckId }: { id: string; deckId: string }) => {
      const { error } = await supabase
        .from("flashcards")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return deckId;
    },
    onSuccess: (deckId) => {
      queryClient.invalidateQueries({ queryKey: ["flashcards", deckId] });
      queryClient.invalidateQueries({ queryKey: ["flashcard-decks"] });
      queryClient.invalidateQueries({ queryKey: ["deck-stats"] });
    },
  });
}

export function useReviewFlashcard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ flashcard, quality }: { flashcard: Flashcard; quality: ReviewQuality }) => {
      if (!user) throw new Error("Non authentifié");

      const result = calculateSM2(
        quality,
        Number(flashcard.easiness_factor),
        flashcard.repetition_count,
        flashcard.interval_days
      );

      // Update flashcard with new SM-2 values
      const { error: updateError } = await supabase
        .from("flashcards")
        .update({
          easiness_factor: result.easinessFactor,
          repetition_count: result.repetitionCount,
          interval_days: result.intervalDays,
          next_review_at: result.nextReviewAt.toISOString(),
          last_reviewed_at: new Date().toISOString(),
          total_reviews: flashcard.total_reviews + 1,
          correct_reviews: quality >= 3 ? flashcard.correct_reviews + 1 : flashcard.correct_reviews,
        })
        .eq("id", flashcard.id);

      if (updateError) throw updateError;

      // Record review history
      const { error: reviewError } = await supabase
        .from("flashcard_reviews")
        .insert({
          user_id: user.id,
          flashcard_id: flashcard.id,
          quality,
          easiness_factor_before: flashcard.easiness_factor,
          easiness_factor_after: result.easinessFactor,
          interval_before: flashcard.interval_days,
          interval_after: result.intervalDays,
        });

      if (reviewError) throw reviewError;

      // Update deck last_studied_at
      await supabase
        .from("flashcard_decks")
        .update({ last_studied_at: new Date().toISOString() })
        .eq("id", flashcard.deck_id);

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      queryClient.invalidateQueries({ queryKey: ["due-flashcards"] });
      queryClient.invalidateQueries({ queryKey: ["deck-stats"] });
      queryClient.invalidateQueries({ queryKey: ["flashcard-decks"] });
    },
  });
}
