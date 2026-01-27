// UI
export { HeadlineGenerator } from "./ui/HeadlineGenerator";
export { HeadlineInput } from "./ui/HeadlineInput";
export { VariationList } from "./ui/VariationList";
export { VariationCard, SavedHeadlineCard } from "./ui/VariationCard";
export { FavoritesList } from "./ui/FavoritesList";

// Store
export { useHeadlineStore } from "./model/useHeadlineStore";

// Types
export type {
  HeadlineVariation,
  VariationCategory,
  VariationPattern,
  SavedHeadline,
} from "./model/types";
export { VARIATION_CATEGORIES } from "./model/types";

// Patterns
export { VARIATION_PATTERNS, generateHeadlineFromPattern } from "./model/variation-patterns";

// Utils
export {
  generateId,
  copyToClipboard,
  getCategoryColor,
  formatDate,
} from "./lib/headline-utils";
