/**
 * IntroGate 전용 애니메이션 유틸리티
 * Framer Motion 없이 CSS 클래스 기반으로 애니메이션 처리
 */

/**
 * 사용자의 애니메이션 감소 선호 설정 확인
 * @returns true면 애니메이션을 줄여야 함
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * 인트로 표시 여부 확인 (sessionStorage 기반)
 * @returns true면 인트로를 표시해야 함
 */
export function shouldShowIntro(): boolean {
  if (typeof window === "undefined") return false;
  return !sessionStorage.getItem("intro-gate-shown");
}

/**
 * 인트로 표시 완료 마킹
 */
export function markIntroAsShown(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("intro-gate-shown", "true");
}

/**
 * 인트로 애니메이션 지속 시간 (ms)
 */
export const INTRO_DURATION = 2000;

/**
 * 페이드아웃 애니메이션 지속 시간 (ms)
 */
export const FADEOUT_DURATION = 500;
