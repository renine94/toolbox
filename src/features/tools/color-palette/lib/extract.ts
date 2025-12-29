import { toHex } from "./harmony";

interface ColorCount {
  hex: string;
  count: number;
}

/**
 * Extract dominant colors from an image file
 * Uses Canvas API to analyze pixel data
 */
export async function extractColors(
  file: File,
  colorCount: number = 5
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          const colors = extractFromImage(img, colorCount);
          resolve(colors);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Extract colors from an Image element using Canvas
 */
function extractFromImage(img: HTMLImageElement, colorCount: number): string[] {
  // Create canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  // Resize for performance (max 100px)
  const maxSize = 100;
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  canvas.width = Math.floor(img.width * scale);
  canvas.height = Math.floor(img.height * scale);

  // Draw image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Count colors (quantize to reduce unique colors)
  const colorMap = new Map<string, number>();
  const quantizeFactor = 32; // Reduce color precision

  for (let i = 0; i < pixels.length; i += 4) {
    const r = Math.round(pixels[i] / quantizeFactor) * quantizeFactor;
    const g = Math.round(pixels[i + 1] / quantizeFactor) * quantizeFactor;
    const b = Math.round(pixels[i + 2] / quantizeFactor) * quantizeFactor;
    const a = pixels[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    const hex = rgbToHex(r, g, b);
    colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
  }

  // Sort by frequency
  const sortedColors: ColorCount[] = Array.from(colorMap.entries())
    .map(([hex, count]) => ({ hex, count }))
    .sort((a, b) => b.count - a.count);

  // Filter similar colors and get top N
  const result: string[] = [];
  const minDistance = 50; // Minimum color distance

  for (const color of sortedColors) {
    if (result.length >= colorCount) break;

    // Check if too similar to existing colors
    const isSimilar = result.some(
      (existing) => getColorDistance(existing, color.hex) < minDistance
    );

    if (!isSimilar) {
      result.push(toHex(color.hex));
    }
  }

  // If not enough colors, add more without similarity check
  if (result.length < colorCount) {
    for (const color of sortedColors) {
      if (result.length >= colorCount) break;
      if (!result.includes(toHex(color.hex))) {
        result.push(toHex(color.hex));
      }
    }
  }

  return result;
}

/**
 * Convert RGB to HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHexPart = (n: number) => {
    const hex = Math.min(255, Math.max(0, n)).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHexPart(r)}${toHexPart(g)}${toHexPart(b)}`;
}

/**
 * Calculate color distance (simple Euclidean in RGB space)
 */
function getColorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 0;

  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );
}

/**
 * Convert HEX to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
