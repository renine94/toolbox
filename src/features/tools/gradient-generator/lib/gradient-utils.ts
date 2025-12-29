import { GradientConfig, ColorStop } from "../model/types";

/**
 * CSS 그라디언트 문자열 생성
 */
export function generateGradientCSS(config: GradientConfig): string {
  const { type, angle, centerX, centerY, colorStops } = config;
  const stops = generateColorStops(colorStops);

  switch (type) {
    case "linear":
      return `linear-gradient(${angle}deg, ${stops})`;
    case "radial":
      return `radial-gradient(circle at ${centerX}% ${centerY}%, ${stops})`;
    case "conic":
      return `conic-gradient(from ${angle}deg at ${centerX}% ${centerY}%, ${stops})`;
    default:
      return `linear-gradient(${angle}deg, ${stops})`;
  }
}

/**
 * 색상 스톱 문자열 생성
 */
function generateColorStops(colorStops: ColorStop[]): string {
  return colorStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ");
}

/**
 * 전체 CSS 코드 생성
 */
export function generateFullCSS(config: GradientConfig): string {
  const gradient = generateGradientCSS(config);
  return `background: ${gradient};`;
}

/**
 * Tailwind CSS arbitrary value 생성
 */
export function generateTailwindCSS(config: GradientConfig): string {
  const gradient = generateGradientCSS(config);
  // Tailwind arbitrary value에서 사용할 수 없는 문자 처리
  const escaped = gradient.replace(/\s+/g, "_").replace(/%/g, "pct");
  return `bg-[${escaped}]`;
}

/**
 * SCSS 변수 형식 생성
 */
export function generateSCSS(config: GradientConfig): string {
  const gradient = generateGradientCSS(config);
  return `$gradient: ${gradient};\n\n.gradient {\n  background: $gradient;\n}`;
}

/**
 * JavaScript 객체 형식 생성
 */
export function generateJSObject(config: GradientConfig): string {
  const gradient = generateGradientCSS(config);
  return `const gradientStyle = {\n  background: '${gradient}'\n};`;
}

/**
 * 그라디언트 설정을 JSON 문자열로 변환
 */
export function exportConfig(config: GradientConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * JSON 문자열에서 그라디언트 설정 파싱
 */
export function importConfig(json: string): GradientConfig | null {
  try {
    const parsed = JSON.parse(json);
    if (
      parsed.type &&
      parsed.colorStops &&
      Array.isArray(parsed.colorStops) &&
      parsed.colorStops.length >= 2
    ) {
      return parsed as GradientConfig;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 클립보드에 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * HEX 색상이 밝은지 어두운지 판단
 */
export function isLightColor(hex: string): boolean {
  const color = hex.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}

export type ExportFormat = "css" | "tailwind" | "scss" | "js" | "json";

export interface ExportOption {
  format: ExportFormat;
  name: string;
  nameKo: string;
  description: string;
}

export const EXPORT_OPTIONS: ExportOption[] = [
  {
    format: "css",
    name: "CSS",
    nameKo: "CSS",
    description: "표준 CSS background 속성",
  },
  {
    format: "tailwind",
    name: "Tailwind",
    nameKo: "Tailwind",
    description: "Tailwind CSS arbitrary value",
  },
  {
    format: "scss",
    name: "SCSS",
    nameKo: "SCSS",
    description: "SCSS 변수와 클래스",
  },
  {
    format: "js",
    name: "JavaScript",
    nameKo: "JavaScript",
    description: "JavaScript 스타일 객체",
  },
  {
    format: "json",
    name: "JSON",
    nameKo: "JSON",
    description: "설정 내보내기/가져오기",
  },
];

export function generateCode(
  config: GradientConfig,
  format: ExportFormat
): string {
  switch (format) {
    case "css":
      return generateFullCSS(config);
    case "tailwind":
      return generateTailwindCSS(config);
    case "scss":
      return generateSCSS(config);
    case "js":
      return generateJSObject(config);
    case "json":
      return exportConfig(config);
    default:
      return generateFullCSS(config);
  }
}
