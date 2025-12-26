import { PaletteColor } from "../model/types";
import { toRgb, toHsl } from "./harmony";

/**
 * Export palette to CSS custom properties
 */
export function exportToCSS(colors: PaletteColor[]): string {
  const lines = [":root {"];

  colors.forEach((color, index) => {
    const name = color.name
      ? color.name.toLowerCase().replace(/\s+/g, "-")
      : `color-${index + 1}`;
    lines.push(`  --${name}: ${color.hex};`);
  });

  lines.push("}");
  return lines.join("\n");
}

/**
 * Export palette to CSS with RGB values
 */
export function exportToCSSWithRGB(colors: PaletteColor[]): string {
  const lines = [":root {"];

  colors.forEach((color, index) => {
    const name = color.name
      ? color.name.toLowerCase().replace(/\s+/g, "-")
      : `color-${index + 1}`;
    const rgb = toRgb(color.hex);
    lines.push(`  --${name}: ${color.hex};`);
    lines.push(`  --${name}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};`);
  });

  lines.push("}");
  return lines.join("\n");
}

/**
 * Export palette to Tailwind CSS config format
 */
export function exportToTailwind(colors: PaletteColor[]): string {
  const lines = ["// tailwind.config.js", "module.exports = {", "  theme: {", "    extend: {", "      colors: {"];

  colors.forEach((color, index) => {
    const name = color.name
      ? color.name.toLowerCase().replace(/\s+/g, "-")
      : `color-${index + 1}`;
    lines.push(`        '${name}': '${color.hex}',`);
  });

  lines.push("      },");
  lines.push("    },");
  lines.push("  },");
  lines.push("};");

  return lines.join("\n");
}

/**
 * Export palette to Tailwind CSS v4 format
 */
export function exportToTailwindV4(colors: PaletteColor[]): string {
  const lines = ["/* @theme inline */", "@theme {"];

  colors.forEach((color, index) => {
    const name = color.name
      ? color.name.toLowerCase().replace(/\s+/g, "-")
      : `color-${index + 1}`;
    lines.push(`  --color-${name}: ${color.hex};`);
  });

  lines.push("}");
  return lines.join("\n");
}

/**
 * Export palette to SCSS variables
 */
export function exportToSCSS(colors: PaletteColor[]): string {
  const lines: string[] = [];

  colors.forEach((color, index) => {
    const name = color.name
      ? color.name.toLowerCase().replace(/\s+/g, "-")
      : `color-${index + 1}`;
    lines.push(`$${name}: ${color.hex};`);
  });

  // Add a map for easy iteration
  lines.push("");
  lines.push("$palette: (");
  colors.forEach((color, index) => {
    const name = color.name
      ? color.name.toLowerCase().replace(/\s+/g, "-")
      : `color-${index + 1}`;
    const isLast = index === colors.length - 1;
    lines.push(`  '${name}': ${color.hex}${isLast ? "" : ","}`);
  });
  lines.push(");");

  return lines.join("\n");
}

/**
 * Export palette to JSON format
 */
export function exportToJSON(colors: PaletteColor[]): string {
  const palette = colors.map((color, index) => ({
    name: color.name || `Color ${index + 1}`,
    hex: color.hex,
    rgb: toRgb(color.hex),
    hsl: toHsl(color.hex),
  }));

  return JSON.stringify(palette, null, 2);
}

/**
 * Get all export formats
 */
export type ExportFormatType = "css" | "css-rgb" | "tailwind" | "tailwind-v4" | "scss" | "json";

export interface ExportOption {
  type: ExportFormatType;
  name: string;
  description: string;
}

export const EXPORT_OPTIONS: ExportOption[] = [
  { type: "css", name: "CSS", description: "CSS 변수" },
  { type: "css-rgb", name: "CSS (RGB)", description: "CSS 변수 (RGB 포함)" },
  { type: "tailwind", name: "Tailwind v3", description: "Tailwind CSS v3 config" },
  { type: "tailwind-v4", name: "Tailwind v4", description: "Tailwind CSS v4 @theme" },
  { type: "scss", name: "SCSS", description: "SCSS 변수" },
  { type: "json", name: "JSON", description: "JSON 형식" },
];

/**
 * Export palette to specified format
 */
export function exportPalette(
  colors: PaletteColor[],
  format: ExportFormatType
): string {
  switch (format) {
    case "css":
      return exportToCSS(colors);
    case "css-rgb":
      return exportToCSSWithRGB(colors);
    case "tailwind":
      return exportToTailwind(colors);
    case "tailwind-v4":
      return exportToTailwindV4(colors);
    case "scss":
      return exportToSCSS(colors);
    case "json":
      return exportToJSON(colors);
    default:
      return exportToCSS(colors);
  }
}
