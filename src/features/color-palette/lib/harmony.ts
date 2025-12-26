import { colord, extend } from "colord";
import harmoniesPlugin from "colord/plugins/harmonies";
import { HarmonyType, PaletteColor } from "../model/types";

// Extend colord with harmonies plugin
extend([harmoniesPlugin]);

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generate harmony colors based on a base color and harmony type
 */
export function generateHarmony(
  baseColor: string,
  harmonyType: HarmonyType
): PaletteColor[] {
  if (harmonyType === "custom") {
    return [];
  }

  const color = colord(baseColor);

  let harmonies: ReturnType<typeof color.harmonies>;

  switch (harmonyType) {
    case "complementary":
      harmonies = color.harmonies("complementary");
      break;
    case "analogous":
      harmonies = color.harmonies("analogous");
      break;
    case "triadic":
      harmonies = color.harmonies("triadic");
      break;
    case "split-complementary":
      harmonies = color.harmonies("split-complementary");
      break;
    case "tetradic":
      harmonies = color.harmonies("tetradic");
      break;
    default:
      return [];
  }

  return harmonies.map((c, index) => ({
    id: generateId(),
    hex: c.toHex(),
    name: `Color ${index + 1}`,
  }));
}

/**
 * Get the name of a harmony type in Korean
 */
export function getHarmonyName(harmonyType: HarmonyType): string {
  const names: Record<HarmonyType, string> = {
    complementary: "보색",
    analogous: "유사색",
    triadic: "삼원색",
    "split-complementary": "분할보색",
    tetradic: "사각형",
    custom: "커스텀",
  };
  return names[harmonyType];
}

/**
 * Check if a color is valid
 */
export function isValidColor(color: string): boolean {
  return colord(color).isValid();
}

/**
 * Convert any color format to HEX
 */
export function toHex(color: string): string {
  return colord(color).toHex();
}

/**
 * Get RGB values from a color
 */
export function toRgb(color: string): { r: number; g: number; b: number } {
  const { r, g, b } = colord(color).toRgb();
  return { r, g, b };
}

/**
 * Get HSL values from a color
 */
export function toHsl(color: string): { h: number; s: number; l: number } {
  const { h, s, l } = colord(color).toHsl();
  return { h: Math.round(h), s: Math.round(s), l: Math.round(l) };
}

/**
 * Get contrast color (black or white) for text on a given background
 */
export function getContrastColor(bgColor: string): string {
  return colord(bgColor).isLight() ? "#000000" : "#ffffff";
}

/**
 * Lighten a color by a percentage
 */
export function lighten(color: string, amount: number): string {
  return colord(color).lighten(amount).toHex();
}

/**
 * Darken a color by a percentage
 */
export function darken(color: string, amount: number): string {
  return colord(color).darken(amount).toHex();
}
