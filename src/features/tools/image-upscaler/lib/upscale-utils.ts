import { FILE_LIMITS, type ImageSize } from "../model/types";

/**
 * 파일을 Data URL로 변환
 */
export function loadImageAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as Data URL"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * 파일 유효성 검사
 */
export function validateImageFile(file: File): void {
  // 파일 타입 검사
  if (
    !FILE_LIMITS.supportedTypes.includes(
      file.type as (typeof FILE_LIMITS.supportedTypes)[number]
    )
  ) {
    throw new Error("unsupportedFormat");
  }

  // 파일 크기 검사
  if (file.size > FILE_LIMITS.maxSizeBytes) {
    throw new Error("fileTooLarge");
  }
}

/**
 * 이미지 크기 검사
 */
export function validateImageDimensions(size: ImageSize): void {
  if (
    size.width > FILE_LIMITS.maxDimension ||
    size.height > FILE_LIMITS.maxDimension
  ) {
    throw new Error("dimensionTooLarge");
  }
}

/**
 * Data URL에서 이미지 크기 가져오기
 */
export function getImageSize(dataUrl: string): Promise<ImageSize> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

/**
 * 이미지 다운로드
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 파일 확장자 생성
 */
export function getFileExtension(
  format: "png" | "jpeg" | "webp"
): string {
  return format === "jpeg" ? "jpg" : format;
}

/**
 * 파일명 생성
 */
export function generateFilename(
  originalName: string,
  scale: number,
  format: "png" | "jpeg" | "webp"
): string {
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const extension = getFileExtension(format);
  return `${baseName}_${scale}x.${extension}`;
}

/**
 * 크기를 읽기 쉬운 형식으로 변환
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * 이미지 크기를 읽기 쉬운 형식으로 변환
 */
export function formatDimensions(size: ImageSize): string {
  return `${size.width} × ${size.height}`;
}

/**
 * 예상 처리 시간 계산 (초)
 */
export function estimateProcessingTime(
  size: ImageSize,
  scale: number,
  algorithm: "bilinear" | "bicubic" | "lanczos3"
): number {
  const totalPixels = size.width * size.height * scale * scale;
  const baseTime = totalPixels / 1000000; // 백만 픽셀당 기본 시간

  const algorithmMultiplier = {
    bilinear: 0.3,
    bicubic: 0.6,
    lanczos3: 1.0,
  };

  return Math.max(0.5, baseTime * algorithmMultiplier[algorithm]);
}
