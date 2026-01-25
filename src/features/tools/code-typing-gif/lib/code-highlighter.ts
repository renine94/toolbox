import hljs from 'highlight.js/lib/core';

// 지원 언어 등록
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import java from 'highlight.js/lib/languages/java';
import kotlin from 'highlight.js/lib/languages/kotlin';
import swift from 'highlight.js/lib/languages/swift';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';

import { SupportedLanguage } from '../model/types';

// 언어 등록
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('java', java);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('php', php);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('bash', bash);

/**
 * 코드를 하이라이팅하여 HTML 반환
 */
export function highlightCode(code: string, language: SupportedLanguage): string {
  try {
    const result = hljs.highlight(code, { language });
    return result.value;
  } catch {
    // 하이라이팅 실패 시 원본 반환 (HTML escape)
    return escapeHtml(code);
  }
}

/**
 * 부분 코드 하이라이팅 - 전체 코드를 하이라이팅 후 visible 길이만큼 추출
 * HTML 태그를 고려하여 올바른 위치에서 자름
 */
export function highlightPartialCode(
  fullCode: string,
  visibleLength: number,
  language: SupportedLanguage
): string {
  if (visibleLength <= 0) return '';
  if (visibleLength >= fullCode.length) {
    return highlightCode(fullCode, language);
  }

  // 보이는 부분의 코드만 추출하여 하이라이팅
  const visibleCode = fullCode.slice(0, visibleLength);
  return highlightCode(visibleCode, language);
}

/**
 * HTML 이스케이프
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 코드를 줄 단위로 분리하고 줄 번호 추가
 */
export function splitCodeIntoLines(code: string): string[] {
  return code.split('\n');
}

/**
 * 현재 커서 위치에서의 줄 번호와 열 번호 계산
 */
export function getCursorPosition(code: string, charIndex: number): { line: number; column: number } {
  const upToIndex = code.slice(0, charIndex);
  const lines = upToIndex.split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length,
  };
}

export { hljs };
