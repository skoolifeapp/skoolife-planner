import { ReviewQuality, SM2Result } from "@/types/flashcards";

/**
 * SuperMemo 2 (SM-2) Algorithm Implementation
 * 
 * Quality ratings:
 * 0 - Complete blackout, no recall
 * 1 - Incorrect, but upon seeing answer, remembered
 * 2 - Incorrect, but answer seemed easy to recall
 * 3 - Correct, but with serious difficulty
 * 4 - Correct, with some hesitation
 * 5 - Correct, perfect response
 */

export function calculateSM2(
  quality: ReviewQuality,
  currentEasinessFactor: number,
  currentRepetitionCount: number,
  currentIntervalDays: number
): SM2Result {
  // Clamp easiness factor to valid range
  let easinessFactor = Math.max(1.3, currentEasinessFactor);
  let repetitionCount = currentRepetitionCount;
  let intervalDays = currentIntervalDays;

  // If quality < 3, reset repetitions (card not learned)
  if (quality < 3) {
    repetitionCount = 0;
    intervalDays = 1;
  } else {
    // Calculate new interval based on repetition count
    if (repetitionCount === 0) {
      intervalDays = 1;
    } else if (repetitionCount === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(currentIntervalDays * easinessFactor);
    }
    repetitionCount += 1;
  }

  // Update easiness factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ensure EF doesn't go below 1.3
  easinessFactor = Math.max(1.3, easinessFactor);
  
  // Round to 2 decimal places
  easinessFactor = Math.round(easinessFactor * 100) / 100;

  // Calculate next review date
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  return {
    easinessFactor,
    repetitionCount,
    intervalDays,
    nextReviewAt,
  };
}

/**
 * Get quality rating label
 */
export function getQualityLabel(quality: ReviewQuality): string {
  const labels: Record<ReviewQuality, string> = {
    0: "Aucune idée",
    1: "Difficile",
    2: "Presque",
    3: "Correct",
    4: "Bien",
    5: "Parfait",
  };
  return labels[quality];
}

/**
 * Get quality rating color
 */
export function getQualityColor(quality: ReviewQuality): string {
  const colors: Record<ReviewQuality, string> = {
    0: "bg-red-500",
    1: "bg-orange-500",
    2: "bg-yellow-500",
    3: "bg-lime-500",
    4: "bg-green-500",
    5: "bg-emerald-500",
  };
  return colors[quality];
}

/**
 * Get mastery level based on easiness factor and repetition count
 */
export function getMasteryLevel(easinessFactor: number, repetitionCount: number): {
  level: "new" | "learning" | "reviewing" | "mastered";
  label: string;
  color: string;
} {
  if (repetitionCount === 0) {
    return { level: "new", label: "Nouvelle", color: "bg-muted text-muted-foreground" };
  }
  if (repetitionCount < 3) {
    return { level: "learning", label: "En cours", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" };
  }
  if (easinessFactor >= 2.5) {
    return { level: "mastered", label: "Maîtrisée", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
  }
  return { level: "reviewing", label: "À revoir", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
}
