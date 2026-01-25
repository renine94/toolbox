// UI Components
export { CodeTypingGif } from './ui/CodeTypingGif';

// Types
export type {
  SupportedLanguage,
  Theme,
  CursorStyle,
  WindowStyle,
  TypingGifSettings,
  PlaybackState,
  GifGenerationState,
} from './model/types';

export {
  SUPPORTED_LANGUAGES,
  LANGUAGE_LABELS,
  THEMES,
  THEME_LABELS,
  CURSOR_STYLES,
  WINDOW_STYLES,
  DEFAULT_SETTINGS,
  DEFAULT_CODE_TEMPLATES,
} from './model/types';

// Store
export { useTypingGifStore } from './model/useTypingGifStore';

// Utilities
export { highlightCode, highlightPartialCode } from './lib/code-highlighter';
export { getThemeStyles, getThemeColors, THEME_COLORS } from './lib/themes';
export { generateTypingGif, downloadGif, estimateGifSize } from './lib/gif-generator';
