export interface FlashcardDeck {
  id: string;
  user_id: string;
  subject_id: string | null;
  name: string;
  description: string | null;
  card_count: number;
  last_studied_at: string | null;
  created_at: string;
  updated_at: string;
  subject?: {
    id: string;
    name: string;
    color: string | null;
  };
}

export interface Flashcard {
  id: string;
  deck_id: string;
  user_id: string;
  front: string;
  back: string;
  easiness_factor: number;
  repetition_count: number;
  interval_days: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  total_reviews: number;
  correct_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface FlashcardReview {
  id: string;
  flashcard_id: string;
  user_id: string;
  quality: number;
  easiness_factor_before: number;
  easiness_factor_after: number;
  interval_before: number;
  interval_after: number;
  reviewed_at: string;
}

// SM-2 Algorithm quality ratings
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface SM2Result {
  easinessFactor: number;
  repetitionCount: number;
  intervalDays: number;
  nextReviewAt: Date;
}

export interface DeckStats {
  totalCards: number;
  masteredCards: number; // EF >= 2.5 and repetition >= 3
  learningCards: number; // repetition < 3
  dueCards: number; // next_review_at <= now
  averageEasiness: number;
  totalReviews: number;
  correctRate: number;
}
