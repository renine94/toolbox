/**
 * Clipboard Utilities
 * 클립보드 관련 공통 유틸리티 함수
 */

/**
 * 클립보드에 텍스트 복사
 * @param text 복사할 텍스트
 * @returns 복사 성공 여부
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
