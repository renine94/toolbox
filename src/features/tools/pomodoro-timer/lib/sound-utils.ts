/**
 * Web Audio API 사운드 유틸리티
 */

let audioContext: AudioContext | null = null;

/**
 * AudioContext 초기화 (lazy initialization)
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  }

  return audioContext;
}

/**
 * 비프음 재생 (단계 완료 알림용)
 * @param frequency - 주파수 (Hz), 기본값 800
 * @param duration - 지속 시간 (초), 기본값 0.2
 * @param volume - 볼륨 (0-1), 기본값 0.3
 */
export function playBeep(
  frequency: number = 800,
  duration: number = 0.2,
  volume: number = 0.3
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // AudioContext가 중단된 상태면 재개
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

/**
 * 작업 완료 사운드 재생 (상승 톤)
 */
export function playWorkCompleteSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // 3개의 상승 톤
  const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      playBeep(freq, 0.15, 0.25);
    }, index * 150);
  });
}

/**
 * 휴식 완료 사운드 재생 (부드러운 알림)
 */
export function playBreakCompleteSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // 2개의 부드러운 톤
  const frequencies = [440, 523.25]; // A4, C5
  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      playBeep(freq, 0.2, 0.2);
    }, index * 200);
  });
}

/**
 * 긴 휴식 완료 사운드 재생 (멜로디)
 */
export function playLongBreakCompleteSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // 간단한 멜로디
  const frequencies = [392, 440, 523.25, 659.25]; // G4, A4, C5, E5
  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      playBeep(freq, 0.18, 0.22);
    }, index * 180);
  });
}

/**
 * 클릭 사운드 재생 (버튼용)
 */
export function playClickSound(): void {
  playBeep(1000, 0.05, 0.15);
}

/**
 * Web Audio API 지원 여부 확인
 */
export function isAudioSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    (!!window.AudioContext ||
      !!(window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)
  );
}
