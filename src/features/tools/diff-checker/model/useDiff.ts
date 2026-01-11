'use client';

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { DiffMode, ViewMode, DiffResult, DiffStats, LineDiff } from './types';
import { DEFAULT_STATS } from './types';
import {
  computeDiff,
  calculateStats,
  convertToLineDiffs,
  formatDiffForCopy,
  readFileAsText,
  isTextFile,
} from '../lib/diff-utils';

interface UseDiffReturn {
  // 상태
  original: string;
  modified: string;
  diffMode: DiffMode;
  viewMode: ViewMode;
  results: DiffResult[];
  lineDiffs: LineDiff[];
  stats: DiffStats;
  isCompared: boolean;

  // 액션
  setOriginal: (value: string) => void;
  setModified: (value: string) => void;
  setDiffMode: (mode: DiffMode) => void;
  setViewMode: (mode: ViewMode) => void;
  compare: () => void;
  swap: () => void;
  clear: () => void;
  copyResult: () => void;
  handleFileDrop: (file: File, target: 'original' | 'modified') => Promise<void>;
}

export function useDiff(): UseDiffReturn {
  // 입력 상태
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');

  // 모드 상태
  const [diffMode, setDiffMode] = useState<DiffMode>('line');
  const [viewMode, setViewMode] = useState<ViewMode>('unified');

  // 결과 상태
  const [results, setResults] = useState<DiffResult[]>([]);
  const [isCompared, setIsCompared] = useState(false);

  // 계산된 값: 통계
  const stats = useMemo(() => {
    if (results.length === 0) return DEFAULT_STATS;
    return calculateStats(results, diffMode);
  }, [results, diffMode]);

  // 계산된 값: 줄 단위 Diff (Split 뷰용)
  const lineDiffs = useMemo(() => {
    if (results.length === 0) return [];
    return convertToLineDiffs(results);
  }, [results]);

  // 비교 실행
  const compare = useCallback(() => {
    if (!original.trim() && !modified.trim()) {
      toast.error('비교할 텍스트를 입력해주세요');
      return;
    }

    const diffResults = computeDiff(original, modified, diffMode);
    setResults(diffResults);
    setIsCompared(true);

    if (diffResults.length === 1 && diffResults[0].type === 'equal') {
      toast.success('두 텍스트가 동일합니다!');
    } else {
      const s = calculateStats(diffResults, diffMode);
      const unit = diffMode === 'line' ? '줄' : diffMode === 'word' ? '단어' : '문자';
      toast.success(`비교 완료: +${s.additions} / -${s.deletions} ${unit}`);
    }
  }, [original, modified, diffMode]);

  // 텍스트 스왑
  const swap = useCallback(() => {
    setOriginal(modified);
    setModified(original);
    setResults([]);
    setIsCompared(false);
    toast.info('텍스트가 교환되었습니다');
  }, [original, modified]);

  // 초기화
  const clear = useCallback(() => {
    setOriginal('');
    setModified('');
    setResults([]);
    setIsCompared(false);
    toast.info('초기화되었습니다');
  }, []);

  // 결과 복사
  const copyResult = useCallback(() => {
    if (results.length === 0) {
      toast.error('복사할 결과가 없습니다');
      return;
    }

    const text = formatDiffForCopy(results);
    navigator.clipboard.writeText(text);
    toast.success('Diff 결과가 클립보드에 복사되었습니다');
  }, [results]);

  // 파일 드롭 처리
  const handleFileDrop = useCallback(
    async (file: File, target: 'original' | 'modified') => {
      if (!isTextFile(file)) {
        toast.error('텍스트 파일만 지원됩니다');
        return;
      }

      try {
        const text = await readFileAsText(file);
        if (target === 'original') {
          setOriginal(text);
        } else {
          setModified(text);
        }
        setResults([]);
        setIsCompared(false);
        toast.success(`${file.name} 파일을 불러왔습니다`);
      } catch (error) {
        toast.error('파일을 읽는 중 오류가 발생했습니다');
      }
    },
    []
  );

  return {
    // 상태
    original,
    modified,
    diffMode,
    viewMode,
    results,
    lineDiffs,
    stats,
    isCompared,

    // 액션
    setOriginal,
    setModified,
    setDiffMode,
    setViewMode,
    compare,
    swap,
    clear,
    copyResult,
    handleFileDrop,
  };
}
