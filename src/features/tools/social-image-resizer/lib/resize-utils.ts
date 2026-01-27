import JSZip from "jszip";
import type {
  ImageSize,
  PlatformPreset,
  ResizeResult,
  ImageAddErrorType,
} from "../model/types";
import { FILE_LIMITS } from "../model/types";

/**
 * 고유 ID 생성
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 이미지 파일 유효성 검사
 */
export function validateImageFile(file: File): void {
  // 파일 크기 확인
  if (file.size > FILE_LIMITS.maxSizeBytes) {
    throw new Error("fileTooLarge");
  }

  // 파일 형식 확인
  const supportedTypes = FILE_LIMITS.supportedTypes as readonly string[];
  if (!supportedTypes.includes(file.type)) {
    throw new Error("unsupportedFormat");
  }
}

/**
 * 이미지 파일을 Data URL로 변환
 */
export function loadImageAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("loadError"));
    reader.readAsDataURL(file);
  });
}

/**
 * 이미지 크기 가져오기
 */
export function getImageSize(dataUrl: string): Promise<ImageSize> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error("loadError"));
    img.src = dataUrl;
  });
}

/**
 * 이미지 크기 유효성 검사
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
 * 이미지 리사이즈
 */
export async function resizeImage(
  dataUrl: string,
  preset: PlatformPreset,
  originalSize: ImageSize
): Promise<ResizeResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // 타겟 크기
        const targetWidth = preset.width;
        const targetHeight = preset.height;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // 배경을 흰색으로 채움 (투명 영역 대비)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // cover 모드로 이미지 배치 (이미지가 영역을 완전히 덮도록)
        const scale = Math.max(
          targetWidth / img.width,
          targetHeight / img.height
        );
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (targetWidth - scaledWidth) / 2;
        const offsetY = (targetHeight - scaledHeight) / 2;

        // 이미지 품질 향상을 위한 설정
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        // JPEG로 변환 (품질 90%)
        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.9);

        // 파일 크기 계산
        const base64Data = resizedDataUrl.split(",")[1];
        const binaryString = atob(base64Data);
        const size = binaryString.length;

        resolve({
          presetId: preset.id,
          dataUrl: resizedDataUrl,
          width: targetWidth,
          height: targetHeight,
          size,
        });
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

/**
 * 파일명 생성
 */
export function generateFileName(
  originalName: string,
  preset: PlatformPreset
): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  return `${nameWithoutExt}_${preset.platform}_${preset.name.toLowerCase().replace(/\s+/g, "-")}_${preset.width}x${preset.height}.jpg`;
}

/**
 * 단일 이미지 다운로드
 */
export function downloadImage(
  dataUrl: string,
  originalName: string,
  preset: PlatformPreset
): void {
  const fileName = generateFileName(originalName, preset);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 여러 이미지를 ZIP으로 다운로드
 */
export async function downloadAllAsZip(
  images: Array<{
    dataUrl: string;
    originalName: string;
    preset: PlatformPreset;
  }>
): Promise<void> {
  const zip = new JSZip();

  for (const { dataUrl, originalName, preset } of images) {
    const fileName = generateFileName(originalName, preset);

    // Data URL에서 base64 데이터 추출
    const base64Data = dataUrl.split(",")[1];

    // ZIP에 파일 추가
    zip.file(fileName, base64Data, { base64: true });
  }

  // ZIP 생성 및 다운로드
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "social-images.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 파일 크기 포맷
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * 에러 타입 확인
 */
export function getErrorType(error: unknown): ImageAddErrorType {
  if (error instanceof Error) {
    const message = error.message;
    if (
      message === "fileTooLarge" ||
      message === "unsupportedFormat" ||
      message === "dimensionTooLarge"
    ) {
      return message as ImageAddErrorType;
    }
  }
  return "loadError";
}
