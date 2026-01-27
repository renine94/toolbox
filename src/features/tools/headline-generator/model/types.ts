export interface HeadlineVariation {
  id: string;
  patternName: string;
  headline: string;
  category: VariationCategory;
  isFavorite: boolean;
}

export type VariationCategory =
  | "numbers"
  | "questions"
  | "howto"
  | "lists"
  | "urgency"
  | "fomo"
  | "comparison"
  | "secrets"
  | "beginner"
  | "expert"
  | "trending"
  | "results"
  | "negative"
  | "challenge"
  | "warning";

export interface VariationPattern {
  id: string;
  name: string;
  category: VariationCategory;
  template: string;
  description: string;
}

export interface SavedHeadline {
  id: string;
  headline: string;
  patternName: string;
  category: VariationCategory;
  createdAt: string;
}

export const VARIATION_CATEGORIES: Record<VariationCategory, { label: string; color: string }> = {
  numbers: { label: "Numbers", color: "bg-blue-500" },
  questions: { label: "Questions", color: "bg-purple-500" },
  howto: { label: "How-to", color: "bg-green-500" },
  lists: { label: "Lists", color: "bg-yellow-500" },
  urgency: { label: "Urgency", color: "bg-red-500" },
  fomo: { label: "FOMO", color: "bg-orange-500" },
  comparison: { label: "Comparison", color: "bg-cyan-500" },
  secrets: { label: "Secrets", color: "bg-pink-500" },
  beginner: { label: "Beginner", color: "bg-emerald-500" },
  expert: { label: "Expert", color: "bg-indigo-500" },
  trending: { label: "Trending", color: "bg-rose-500" },
  results: { label: "Results", color: "bg-teal-500" },
  negative: { label: "Negative", color: "bg-amber-500" },
  challenge: { label: "Challenge", color: "bg-violet-500" },
  warning: { label: "Warning", color: "bg-red-600" },
};
