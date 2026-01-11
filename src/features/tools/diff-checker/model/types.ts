/**
 * Diff Checker 도구의 타입 정의
 */

// 비교 모드: 문자, 단어, 줄 단위
export type DiffMode = 'char' | 'word' | 'line';

// 뷰 모드: Unified(한 줄씩) 또는 Split(양쪽 비교)
export type ViewMode = 'unified' | 'split';

// Diff 결과 타입
export type DiffType = 'equal' | 'insert' | 'delete';

// 개별 Diff 결과
export interface DiffResult {
  type: DiffType;
  value: string;
}

// 줄 단위 Diff 결과 (Split 뷰용)
export interface LineDiff {
  lineNumber: {
    original: number | null;
    modified: number | null;
  };
  type: DiffType;
  originalValue: string;
  modifiedValue: string;
}

// Diff 통계
export interface DiffStats {
  additions: number;      // 추가된 항목 수
  deletions: number;      // 삭제된 항목 수
  unchanged: number;      // 변경 없는 항목 수
  totalChanges: number;   // 총 변경 수 (additions + deletions)
}

// 비교 모드 옵션 정보
export interface DiffModeOption {
  value: DiffMode;
  label: string;
  description: string;
}

// 뷰 모드 옵션 정보
export interface ViewModeOption {
  value: ViewMode;
  label: string;
  icon: string;
}

// 기본 비교 모드 옵션
export const DIFF_MODE_OPTIONS: DiffModeOption[] = [
  { value: 'char', label: 'Character', description: '문자 단위 비교' },
  { value: 'word', label: 'Word', description: '단어 단위 비교' },
  { value: 'line', label: 'Line', description: '줄 단위 비교' },
];

// 기본 뷰 모드 옵션
export const VIEW_MODE_OPTIONS: ViewModeOption[] = [
  { value: 'unified', label: 'Unified', icon: '📄' },
  { value: 'split', label: 'Split', icon: '📑' },
];

// 기본 통계 값
export const DEFAULT_STATS: DiffStats = {
  additions: 0,
  deletions: 0,
  unchanged: 0,
  totalChanges: 0,
};
