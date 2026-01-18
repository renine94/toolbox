/**
 * 타이머 유틸리티 함수
 */

/**
 * 초를 MM:SS 형식으로 변환
 * @param seconds - 변환할 초
 * @returns MM:SS 형식의 문자열
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * 분을 초로 변환
 * @param minutes - 변환할 분
 * @returns 초
 */
export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

/**
 * 원형 프로그레스의 SVG stroke-dashoffset 계산
 * @param progress - 0-1 사이의 진행률
 * @param circumference - 원의 둘레
 * @returns stroke-dashoffset 값
 */
export function calculateStrokeDashoffset(
  progress: number,
  circumference: number
): number {
  return circumference * (1 - progress);
}

/**
 * 원의 둘레 계산
 * @param radius - 반지름
 * @returns 원의 둘레
 */
export function calculateCircumference(radius: number): number {
  return 2 * Math.PI * radius;
}

/**
 * 타이머 진행률 계산
 * @param remaining - 남은 시간 (초)
 * @param total - 총 시간 (초)
 * @returns 0-1 사이의 진행률
 */
export function calculateProgress(remaining: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(1, (total - remaining) / total));
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns YYYY-MM-DD 형식의 문자열
 */
export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

/**
 * 시간을 시:분 형식으로 변환 (통계용)
 * @param minutes - 총 분
 * @returns "Xh Ym" 형식의 문자열
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
