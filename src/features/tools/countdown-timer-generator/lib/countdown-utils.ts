import { CountdownDisplay, CountdownConfig, getThemeConfig } from "../model/types";

/**
 * 목표 날짜까지 남은 시간 계산
 */
export function calculateCountdown(targetDate: string): CountdownDisplay {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}

/**
 * 숫자를 2자리 문자열로 패딩
 */
export function padNumber(num: number, digits: number = 2): string {
  return num.toString().padStart(digits, "0");
}

/**
 * iframe 임베드 코드 생성
 */
export function generateEmbedCode(config: CountdownConfig): string {
  const params = new URLSearchParams({
    target: config.targetDate,
    theme: config.theme,
    labels: config.showLabels.toString(),
    fontSize: config.fontSize.toString(),
    borderRadius: config.borderRadius.toString(),
    title: config.title,
  });

  // 실제 배포 URL로 변경 필요
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const embedUrl = `${baseUrl}/embed/countdown?${params.toString()}`;

  return `<iframe
  src="${embedUrl}"
  width="${config.width}"
  height="${config.height}"
  frameborder="0"
  style="border-radius: ${config.borderRadius}px; overflow: hidden;"
  allowtransparency="true">
</iframe>`;
}

/**
 * 카운트다운 타이머 HTML 생성 (PNG 다운로드용)
 */
export function generateCountdownHTML(
  config: CountdownConfig,
  countdown: CountdownDisplay,
  labels: { days: string; hours: string; minutes: string; seconds: string }
): string {
  const theme = getThemeConfig(config.theme);

  const backgroundStyle = theme.gradientFrom && theme.gradientTo
    ? `background: linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo});`
    : `background-color: ${theme.backgroundColor};`;

  const glowStyle = theme.hasGlow && theme.glowColor
    ? `text-shadow: 0 0 10px ${theme.glowColor}, 0 0 20px ${theme.glowColor}, 0 0 30px ${theme.glowColor};`
    : "";

  const boxGlowStyle = theme.hasGlow && theme.glowColor
    ? `box-shadow: 0 0 10px ${theme.glowColor}33, inset 0 0 10px ${theme.glowColor}22;`
    : "";

  return `
    <div style="
      ${backgroundStyle}
      padding: 24px;
      border-radius: ${config.borderRadius}px;
      font-family: ${theme.fontFamily}, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: ${config.width}px;
      min-height: ${config.height}px;
    ">
      ${config.title ? `<div style="color: ${theme.textColor}; font-size: ${config.fontSize * 0.4}px; margin-bottom: 16px; font-weight: 600;">${config.title}</div>` : ""}
      <div style="display: flex; gap: 16px; align-items: center;">
        ${["days", "hours", "minutes", "seconds"].map((unit) => `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: ${theme.boxBackgroundColor};
            border: 2px solid ${theme.boxBorderColor};
            border-radius: ${config.borderRadius * 0.5}px;
            padding: 12px 16px;
            min-width: ${config.fontSize * 1.5}px;
            ${boxGlowStyle}
          ">
            <span style="
              color: ${theme.textColor};
              font-size: ${config.fontSize}px;
              font-weight: bold;
              line-height: 1;
              ${glowStyle}
            ">${padNumber(countdown[unit as keyof CountdownDisplay] as number, unit === "days" && countdown.days >= 100 ? 3 : 2)}</span>
            ${config.showLabels ? `<span style="color: ${theme.labelColor}; font-size: ${config.fontSize * 0.25}px; margin-top: 4px; text-transform: uppercase;">${labels[unit as keyof typeof labels]}</span>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

/**
 * 고유 ID 생성
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
