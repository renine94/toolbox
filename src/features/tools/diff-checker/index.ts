/**
 * Diff Checker Feature - Public API
 *
 * 두 텍스트를 비교하여 차이점을 시각적으로 보여주는 도구
 */

// UI Components
export { DiffChecker } from './ui/DiffChecker';

// Types
export type {
  DiffMode,
  ViewMode,
  DiffType,
  DiffResult,
  LineDiff,
  DiffStats,
  DiffModeOption,
  ViewModeOption,
} from './model/types';

// Constants
export {
  DIFF_MODE_OPTIONS,
  VIEW_MODE_OPTIONS,
  DEFAULT_STATS,
} from './model/types';

// Hooks
export { useDiff } from './model/useDiff';

// Utilities
export {
  computeDiff,
  calculateStats,
  convertToLineDiffs,
  formatDiffForCopy,
  readFileAsText,
  isTextFile,
} from './lib/diff-utils';
