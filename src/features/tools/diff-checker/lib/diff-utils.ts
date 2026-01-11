/**
 * Diff Checker 유틸리티 함수
 * diff-match-patch 라이브러리를 래핑하여 다양한 비교 모드 지원
 */

import DiffMatchPatch from 'diff-match-patch';
import type { DiffMode, DiffResult, DiffStats, LineDiff, DEFAULT_STATS } from '../model/types';

// diff-match-patch 인스턴스 생성
const dmp = new DiffMatchPatch();

/**
 * 두 텍스트를 비교하여 Diff 결과를 반환
 * @param original 원본 텍스트
 * @param modified 수정된 텍스트
 * @param mode 비교 모드 (char, word, line)
 * @returns DiffResult 배열
 */
export function computeDiff(
  original: string,
  modified: string,
  mode: DiffMode
): DiffResult[] {
  if (!original && !modified) {
    return [];
  }

  let diffs: [number, string][];

  switch (mode) {
    case 'line':
      diffs = computeLineDiff(original, modified);
      break;
    case 'word':
      diffs = computeWordDiff(original, modified);
      break;
    case 'char':
    default:
      diffs = dmp.diff_main(original, modified);
      dmp.diff_cleanupSemantic(diffs);
      break;
  }

  return diffs.map(([operation, text]) => ({
    type: operation === 0 ? 'equal' : operation === 1 ? 'insert' : 'delete',
    value: text,
  }));
}

/**
 * 줄 단위 비교
 */
function computeLineDiff(original: string, modified: string): [number, string][] {
  // diff_linesToChars를 사용하여 줄 단위 비교
  const lineToChar = dmp.diff_linesToChars_(original, modified);
  const diffs = dmp.diff_main(lineToChar.chars1, lineToChar.chars2, false);
  dmp.diff_charsToLines_(diffs, lineToChar.lineArray);
  dmp.diff_cleanupSemantic(diffs);
  return diffs;
}

/**
 * 단어 단위 비교
 */
function computeWordDiff(original: string, modified: string): [number, string][] {
  // 단어를 문자로 변환하여 비교 (줄 비교와 유사한 방식)
  const wordToChar = diffWordsToChars(original, modified);
  const diffs = dmp.diff_main(wordToChar.chars1, wordToChar.chars2, false);
  diffCharsToWords(diffs, wordToChar.wordArray);
  dmp.diff_cleanupSemantic(diffs);
  return diffs;
}

/**
 * 단어를 문자로 변환 (커스텀 구현)
 */
function diffWordsToChars(text1: string, text2: string): {
  chars1: string;
  chars2: string;
  wordArray: string[];
} {
  const wordArray: string[] = [''];
  const wordHash: { [key: string]: number } = {};

  function encode(text: string): string {
    let chars = '';
    // 공백과 단어를 분리하여 처리
    const words = text.match(/\S+|\s+/g) || [];

    for (const word of words) {
      if (wordHash[word] !== undefined) {
        chars += String.fromCharCode(wordHash[word]);
      } else {
        const index = wordArray.length;
        wordArray.push(word);
        wordHash[word] = index;
        chars += String.fromCharCode(index);
      }
    }
    return chars;
  }

  return {
    chars1: encode(text1),
    chars2: encode(text2),
    wordArray,
  };
}

/**
 * 문자를 단어로 다시 변환
 */
function diffCharsToWords(diffs: [number, string][], wordArray: string[]): void {
  for (let i = 0; i < diffs.length; i++) {
    const chars = diffs[i][1];
    const words: string[] = [];
    for (let j = 0; j < chars.length; j++) {
      words.push(wordArray[chars.charCodeAt(j)]);
    }
    diffs[i][1] = words.join('');
  }
}

/**
 * Diff 결과에서 통계 계산
 * @param results DiffResult 배열
 * @param mode 비교 모드 (통계 단위 결정)
 * @returns DiffStats
 */
export function calculateStats(results: DiffResult[], mode: DiffMode): DiffStats {
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  for (const result of results) {
    const count = mode === 'line'
      ? (result.value.match(/\n/g) || []).length + (result.value.length > 0 && !result.value.endsWith('\n') ? 1 : 0)
      : mode === 'word'
      ? (result.value.match(/\S+/g) || []).length
      : result.value.length;

    switch (result.type) {
      case 'insert':
        additions += count;
        break;
      case 'delete':
        deletions += count;
        break;
      case 'equal':
        unchanged += count;
        break;
    }
  }

  return {
    additions,
    deletions,
    unchanged,
    totalChanges: additions + deletions,
  };
}

/**
 * Diff 결과를 줄 단위로 변환 (Split 뷰용)
 */
export function convertToLineDiffs(results: DiffResult[]): LineDiff[] {
  const lineDiffs: LineDiff[] = [];
  let originalLineNum = 1;
  let modifiedLineNum = 1;

  for (const result of results) {
    const lines = result.value.split('\n');

    for (let i = 0; i < lines.length; i++) {
      // 마지막 빈 줄은 무시 (split으로 인한 빈 문자열)
      if (i === lines.length - 1 && lines[i] === '' && result.value.endsWith('\n')) {
        continue;
      }

      const lineContent = lines[i] + (i < lines.length - 1 ? '\n' : '');

      switch (result.type) {
        case 'equal':
          lineDiffs.push({
            lineNumber: {
              original: originalLineNum++,
              modified: modifiedLineNum++,
            },
            type: 'equal',
            originalValue: lineContent,
            modifiedValue: lineContent,
          });
          break;
        case 'delete':
          lineDiffs.push({
            lineNumber: {
              original: originalLineNum++,
              modified: null,
            },
            type: 'delete',
            originalValue: lineContent,
            modifiedValue: '',
          });
          break;
        case 'insert':
          lineDiffs.push({
            lineNumber: {
              original: null,
              modified: modifiedLineNum++,
            },
            type: 'insert',
            originalValue: '',
            modifiedValue: lineContent,
          });
          break;
      }
    }
  }

  return lineDiffs;
}

/**
 * Diff 결과를 복사 가능한 텍스트로 포맷
 */
export function formatDiffForCopy(results: DiffResult[]): string {
  return results
    .map((result) => {
      switch (result.type) {
        case 'insert':
          return result.value
            .split('\n')
            .map((line) => (line ? `+ ${line}` : ''))
            .join('\n');
        case 'delete':
          return result.value
            .split('\n')
            .map((line) => (line ? `- ${line}` : ''))
            .join('\n');
        case 'equal':
        default:
          return result.value
            .split('\n')
            .map((line) => (line ? `  ${line}` : ''))
            .join('\n');
      }
    })
    .join('');
}

/**
 * 파일을 텍스트로 읽기
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.readAsText(file);
  });
}

/**
 * 파일이 텍스트 파일인지 확인
 */
export function isTextFile(file: File): boolean {
  const textTypes = [
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'application/json',
    'application/xml',
    'text/xml',
    'text/markdown',
  ];

  const textExtensions = [
    '.txt', '.md', '.json', '.js', '.ts', '.jsx', '.tsx',
    '.html', '.css', '.scss', '.sass', '.less',
    '.py', '.java', '.c', '.cpp', '.h', '.hpp',
    '.go', '.rs', '.rb', '.php', '.swift', '.kt',
    '.yaml', '.yml', '.xml', '.csv', '.sql',
    '.sh', '.bash', '.zsh', '.fish',
    '.env', '.gitignore', '.editorconfig',
  ];

  if (textTypes.includes(file.type)) {
    return true;
  }

  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  return textExtensions.includes(ext);
}
