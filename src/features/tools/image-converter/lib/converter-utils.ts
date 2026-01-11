import JSZip from "jszip";
import {
  FILE_LIMITS,
  FORMAT_INFO,
  type ImageSize,
  type ConversionOptions,
  type OutputFormat,
  type ResizeOptions,
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
  // 파일 타입 검사
  const isSupported = FILE_LIMITS.supportedTypes.some(
    (type) => file.type === type || file.type.startsWith(type.split("/")[0])
  );

  if (!isSupported) {
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
 * 타겟 크기 계산 (리사이즈 옵션 기반)
 */
export function calculateTargetSize(
  originalSize: ImageSize,
  resizeOptions: ResizeOptions
): ImageSize {
  const { mode, percentage, width, height, maintainAspectRatio } =
    resizeOptions;

  switch (mode) {
    case "none":
      return originalSize;

    case "percentage":
      return {
        width: Math.round((originalSize.width * percentage) / 100),
        height: Math.round((originalSize.height * percentage) / 100),
      };

    case "dimensions":
      if (width && height) {
        if (maintainAspectRatio) {
          const ratio = Math.min(
            width / originalSize.width,
            height / originalSize.height
          );
          return {
            width: Math.round(originalSize.width * ratio),
            height: Math.round(originalSize.height * ratio),
          };
        }
        return { width, height };
      }
      return originalSize;

    case "width":
      if (width) {
        const ratio = width / originalSize.width;
        return {
          width,
          height: maintainAspectRatio
            ? Math.round(originalSize.height * ratio)
            : originalSize.height,
        };
      }
      return originalSize;

    case "height":
      if (height) {
        const ratio = height / originalSize.height;
        return {
          width: maintainAspectRatio
            ? Math.round(originalSize.width * ratio)
            : originalSize.width,
          height,
        };
      }
      return originalSize;

    default:
      return originalSize;
  }
}

/**
 * 이미지 변환 (Canvas API 사용)
 */
export async function convertImage(
  dataUrl: string,
  originalSize: ImageSize,
  options: ConversionOptions
): Promise<{ dataUrl: string; size: number; dimensions: ImageSize }> {
  const img = new Image();

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });

  const targetSize = calculateTargetSize(originalSize, options.resize);
  const formatInfo = FORMAT_INFO[options.outputFormat];

  const canvas = document.createElement("canvas");
  canvas.width = targetSize.width;
  canvas.height = targetSize.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // 배경색 설정 (투명도를 지원하지 않는 포맷용)
  if (!formatInfo.supportsTransparency || !options.preserveTransparency) {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, targetSize.width, targetSize.height);
  }

  // 이미지 렌더링 품질 설정
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 이미지 그리기
  ctx.drawImage(img, 0, 0, targetSize.width, targetSize.height);

  // 품질 설정 (0-1 범위로 변환)
  const quality = formatInfo.supportsQuality ? options.quality / 100 : undefined;

  // Data URL 생성
  const resultDataUrl = canvas.toDataURL(formatInfo.mimeType, quality);

  // 결과 크기 계산 (Base64 디코딩된 크기 추정)
  const base64Length = resultDataUrl.split(",")[1]?.length || 0;
  const estimatedSize = Math.round((base64Length * 3) / 4);

  return {
    dataUrl: resultDataUrl,
    size: estimatedSize,
    dimensions: targetSize,
  };
}

/**
 * 단일 이미지 다운로드
 */
export function downloadImage(
  dataUrl: string,
  filename: string,
  format: OutputFormat
): void {
  const formatInfo = FORMAT_INFO[format];
  const baseName = filename.replace(/\.[^/.]+$/, "");
  const fullFilename = `${baseName}.${formatInfo.extension}`;

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fullFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Data URL을 Blob으로 변환
 */
export function dataURLtoBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * 여러 이미지를 ZIP으로 다운로드
 */
export async function downloadAllAsZip(
  images: Array<{
    name: string;
    dataUrl: string;
    format: OutputFormat;
  }>
): Promise<void> {
  const zip = new JSZip();

  images.forEach((image) => {
    const formatInfo = FORMAT_INFO[image.format];
    const baseName = image.name.replace(/\.[^/.]+$/, "");
    const filename = `${baseName}.${formatInfo.extension}`;
    const blob = dataURLtoBlob(image.dataUrl);
    zip.file(filename, blob);
  });

  const content = await zip.generateAsync({ type: "blob" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = `converted_images_${Date.now()}.zip`;
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
    "image/tiff": "TIFF",
    "image/avif": "AVIF",
    "image/svg+xml": "SVG",
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
export function calculateSizeSaved(
  originalSize: number,
  convertedSize: number
): { savedBytes: number; savedPercent: number } {
  const savedBytes = originalSize - convertedSize;
  const savedPercent =
    originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;
  return { savedBytes, savedPercent };
}
