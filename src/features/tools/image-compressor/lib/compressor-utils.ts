import JSZip from "jszip";
import {
  FILE_LIMITS,
  FORMAT_INFO,
  PRESET_CONFIG,
  TARGET_SIZE_LIMITS,
  type ImageSize,
  type CompressionOptions,
  type OutputFormat,
  type CompressionPreset,
} from "../model/types";

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
  const isSupported = FILE_LIMITS.supportedTypes.some(
    (type) => file.type === type || file.type.startsWith(type.split("/")[0])
  );

  if (!isSupported) {
    throw new Error("unsupportedFormat");
  }

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
 * 출력 포맷의 MIME 타입 가져오기
 */
export function getMimeType(
  outputFormat: OutputFormat,
  originalMimeType: string
): string {
  if (outputFormat === "original") {
    // JPEG 계열로 변환 (품질 조절이 가능하도록)
    if (
      originalMimeType === "image/png" ||
      originalMimeType === "image/gif" ||
      originalMimeType === "image/bmp"
    ) {
      return "image/jpeg";
    }
    return originalMimeType;
  }
  return FORMAT_INFO[outputFormat].mimeType;
}

/**
 * 출력 포맷의 확장자 가져오기
 */
export function getExtension(
  outputFormat: OutputFormat,
  originalName: string
): string {
  if (outputFormat === "original") {
    const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
    // PNG, GIF, BMP는 JPEG로 변환되므로 확장자도 변경
    if (["png", "gif", "bmp"].includes(ext)) {
      return "jpg";
    }
    return ext;
  }
  return FORMAT_INFO[outputFormat].extension;
}

/**
 * 프리셋 모드로 이미지 압축
 */
export async function compressWithPreset(
  dataUrl: string,
  originalSize: ImageSize,
  preset: CompressionPreset,
  outputFormat: OutputFormat,
  originalMimeType: string
): Promise<{ dataUrl: string; size: number; quality: number }> {
  const quality = PRESET_CONFIG[preset].quality;
  return compressImage(
    dataUrl,
    originalSize,
    quality,
    outputFormat,
    originalMimeType
  );
}

/**
 * 타겟 용량 모드로 이미지 압축 (이진 탐색 알고리즘)
 */
export async function compressToTargetSize(
  dataUrl: string,
  originalSize: ImageSize,
  targetSizeKB: number,
  outputFormat: OutputFormat,
  originalMimeType: string
): Promise<{
  dataUrl: string;
  size: number;
  quality: number;
  targetNotReached: boolean;
}> {
  const targetSizeBytes = targetSizeKB * 1024;
  let minQuality = TARGET_SIZE_LIMITS.minQuality;
  let maxQuality = TARGET_SIZE_LIMITS.maxQuality;
  let bestResult: { dataUrl: string; size: number; quality: number } | null =
    null;
  let iterations = 0;

  while (
    iterations < TARGET_SIZE_LIMITS.maxIterations &&
    maxQuality - minQuality > 1
  ) {
    const midQuality = Math.floor((minQuality + maxQuality) / 2);
    const result = await compressImage(
      dataUrl,
      originalSize,
      midQuality,
      outputFormat,
      originalMimeType
    );

    if (result.size <= targetSizeBytes) {
      // 목표 이하 - 더 높은 품질 시도
      bestResult = result;
      minQuality = midQuality + 1;
    } else {
      // 목표 초과 - 더 낮은 품질 시도
      maxQuality = midQuality - 1;
    }
    iterations++;
  }

  // 마지막으로 최적 품질로 압축
  if (!bestResult) {
    // 최저 품질로도 목표 달성 실패
    bestResult = await compressImage(
      dataUrl,
      originalSize,
      TARGET_SIZE_LIMITS.minQuality,
      outputFormat,
      originalMimeType
    );
    return {
      ...bestResult,
      targetNotReached: bestResult.size > targetSizeBytes,
    };
  }

  return { ...bestResult, targetNotReached: false };
}

/**
 * 이미지 압축 (Canvas API 사용)
 */
export async function compressImage(
  dataUrl: string,
  originalSize: ImageSize,
  quality: number,
  outputFormat: OutputFormat,
  originalMimeType: string
): Promise<{ dataUrl: string; size: number; quality: number }> {
  const img = new Image();

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = originalSize.width;
  canvas.height = originalSize.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  const mimeType = getMimeType(outputFormat, originalMimeType);

  // JPEG는 투명도를 지원하지 않으므로 흰색 배경 적용
  if (mimeType === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, originalSize.width, originalSize.height);
  }

  // 이미지 렌더링 품질 설정
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 이미지 그리기
  ctx.drawImage(img, 0, 0, originalSize.width, originalSize.height);

  // 품질 설정 (0-1 범위로 변환)
  const qualityValue = quality / 100;

  // Data URL 생성
  const resultDataUrl = canvas.toDataURL(mimeType, qualityValue);

  // 결과 크기 계산 (Base64 디코딩된 크기 추정)
  const base64Length = resultDataUrl.split(",")[1]?.length || 0;
  const estimatedSize = Math.round((base64Length * 3) / 4);

  return {
    dataUrl: resultDataUrl,
    size: estimatedSize,
    quality,
  };
}

/**
 * 압축 옵션에 따라 이미지 압축
 */
export async function processCompression(
  dataUrl: string,
  originalSize: ImageSize,
  options: CompressionOptions,
  originalMimeType: string
): Promise<{
  dataUrl: string;
  size: number;
  dimensions: ImageSize;
  quality: number;
  targetNotReached?: boolean;
}> {
  let result;

  if (options.mode === "preset") {
    result = await compressWithPreset(
      dataUrl,
      originalSize,
      options.preset,
      options.outputFormat,
      originalMimeType
    );
    return { ...result, dimensions: originalSize };
  } else {
    result = await compressToTargetSize(
      dataUrl,
      originalSize,
      options.targetSizeKB,
      options.outputFormat,
      originalMimeType
    );
    return { ...result, dimensions: originalSize };
  }
}

/**
 * Data URL을 Blob으로 변환
 */
export function dataURLtoBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * 단일 이미지 다운로드
 */
export function downloadImage(
  dataUrl: string,
  filename: string,
  outputFormat: OutputFormat
): void {
  const baseName = filename.replace(/\.[^/.]+$/, "");
  const extension = getExtension(outputFormat, filename);
  const fullFilename = `${baseName}_compressed.${extension}`;

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fullFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 여러 이미지를 ZIP으로 다운로드
 */
export async function downloadAllAsZip(
  images: Array<{
    name: string;
    dataUrl: string;
    outputFormat: OutputFormat;
  }>
): Promise<void> {
  const zip = new JSZip();

  images.forEach((image) => {
    const baseName = image.name.replace(/\.[^/.]+$/, "");
    const extension = getExtension(image.outputFormat, image.name);
    const filename = `${baseName}_compressed.${extension}`;
    const blob = dataURLtoBlob(image.dataUrl);
    zip.file(filename, blob);
  });

  const content = await zip.generateAsync({ type: "blob" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = `compressed_images_${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * 파일 크기 포맷팅
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * 이미지 크기 포맷팅
 */
export function formatDimensions(size: ImageSize): string {
  return `${size.width} × ${size.height}`;
}

/**
 * 포맷에서 확장자 추출
 */
export function getFormatFromMimeType(mimeType: string): string {
  const mapping: Record<string, string> = {
    "image/png": "PNG",
    "image/jpeg": "JPEG",
    "image/webp": "WebP",
    "image/gif": "GIF",
    "image/bmp": "BMP",
  };
  return mapping[mimeType] || "Unknown";
}

/**
 * 고유 ID 생성
 */
export function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 크기 절감 계산
 */
export function calculateSizeReduction(
  originalSize: number,
  compressedSize: number
): { savedBytes: number; savedPercent: number; compressionRatio: number } {
  const savedBytes = originalSize - compressedSize;
  const savedPercent =
    originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;
  const compressionRatio =
    compressedSize > 0
      ? Math.round((originalSize / compressedSize) * 10) / 10
      : 0;
  return { savedBytes, savedPercent, compressionRatio };
}
