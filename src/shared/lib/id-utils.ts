/**
 * ID Utilities
 * ID 생성 관련 공통 유틸리티 함수
 */

/**
 * 고유 ID 생성
 * 타임스탬프와 랜덤 문자열을 조합하여 고유한 ID 생성
 * @returns 고유 ID 문자열 (예: "1704067200000-abc123d")
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
