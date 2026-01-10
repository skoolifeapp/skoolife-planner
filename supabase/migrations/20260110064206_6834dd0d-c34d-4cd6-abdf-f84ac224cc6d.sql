-- Create flashcard_decks table (linked to subjects)
CREATE TABLE public.flashcard_decks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  card_count INTEGER DEFAULT 0,
  last_studied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create flashcards table with SM-2 algorithm fields
CREATE TABLE public.flashcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  -- SM-2 Algorithm fields
  easiness_factor DECIMAL(3,2) DEFAULT 2.50,
  repetition_count INTEGER DEFAULT 0,
  interval_days INTEGER DEFAULT 0,
  next_review_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  -- Statistics
  total_reviews INTEGER DEFAULT 0,
  correct_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create flashcard_reviews table for history
CREATE TABLE public.flashcard_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quality INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
  easiness_factor_before DECIMAL(3,2),
  easiness_factor_after DECIMAL(3,2),
  interval_before INTEGER,
  interval_after INTEGER,
  reviewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flashcard_decks
CREATE POLICY "Users can view their own decks" ON public.flashcard_decks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own decks" ON public.flashcard_decks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks" ON public.flashcard_decks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decks" ON public.flashcard_decks
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for flashcards
CREATE POLICY "Users can view their own flashcards" ON public.flashcards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own flashcards" ON public.flashcards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcards" ON public.flashcards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcards" ON public.flashcards
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for flashcard_reviews
CREATE POLICY "Users can view their own reviews" ON public.flashcard_reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reviews" ON public.flashcard_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_flashcard_decks_user_id ON public.flashcard_decks(user_id);
CREATE INDEX idx_flashcard_decks_subject_id ON public.flashcard_decks(subject_id);
CREATE INDEX idx_flashcards_deck_id ON public.flashcards(deck_id);
CREATE INDEX idx_flashcards_next_review ON public.flashcards(user_id, next_review_at);
CREATE INDEX idx_flashcard_reviews_flashcard_id ON public.flashcard_reviews(flashcard_id);

-- Trigger for updated_at
CREATE TRIGGER update_flashcard_decks_updated_at
  BEFORE UPDATE ON public.flashcard_decks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at
  BEFORE UPDATE ON public.flashcards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update deck card count
CREATE OR REPLACE FUNCTION public.update_deck_card_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.flashcard_decks SET card_count = card_count + 1 WHERE id = NEW.deck_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.flashcard_decks SET card_count = card_count - 1 WHERE id = OLD.deck_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_deck_card_count_trigger
  AFTER INSERT OR DELETE ON public.flashcards
  FOR EACH ROW EXECUTE FUNCTION public.update_deck_card_count();