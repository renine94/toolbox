import { z } from "zod";

// 압축 프리셋
export const compressionPresets = [
  "low",
  "medium",
  "high",
  "web",
  "sns",
  "email",
] as const;
export type CompressionPreset = (typeof compressionPresets)[number];

// 압축 모드
export const compressionModes = ["preset", "target"] as const;
export type CompressionMode = (typeof compressionModes)[number];

// 출력 포맷
export const outputFormats = ["original", "jpeg", "webp"] as const;
export type OutputFormat = (typeof outputFormats)[number];

// 이미지 크기
export const imageSizeSchema = z.object({
  width: z.number().min(1).max(20000),
  height: z.number().min(1).max(20000),
});
export type ImageSize = z.infer<typeof imageSizeSchema>;

// 프리셋 설정
export const PRESET_CONFIG: Record<
  CompressionPreset,
  { quality: number; labelKey: string; descriptionKey: string }
> = {
  low: { quality: 80, labelKey: "low", descriptionKey: "lowDesc" },
  medium: { quality: 60, labelKey: "medium", descriptionKey: "mediumDesc" },
  high: { quality: 40, labelKey: "high", descriptionKey: "highDesc" },
  web: { quality: 75, labelKey: "web", descriptionKey: "webDesc" },
  sns: { quality: 65, labelKey: "sns", descriptionKey: "snsDesc" },
  email: { quality: 50, labelKey: "email", descriptionKey: "emailDesc" },
};

// 포맷 정보
export const FORMAT_INFO: Record<
  Exclude<OutputFormat, "original">,
  {
    name: string;
    mimeType: string;
    extension: string;
    supportsQuality: boolean;
  }
> = {
  jpeg: {
    name: "JPEG",
    mimeType: "image/jpeg",
    extension: "jpg",
    supportsQuality: true,
  },
  webp: {
    name: "WebP",
    mimeType: "image/webp",
    extension: "webp",
    supportsQuality: true,
  },
};

// 이미지 상태
export const imageStatuses = [
  "pending",
  "compressing",
  "completed",
  "error",
] as const;
export type ImageStatus = (typeof imageStatuses)[number];

// 이미지 추가 실패 정보
export type ImageAddErrorType =
  | "fileTooLarge"
  | "unsupportedFormat"
  | "dimensionTooLarge"
  | "loadError";

export interface ImageAddFailure {
  fileName: string;
  error: ImageAddErrorType;
}

// 이미지 추가 결과
export interface AddImagesResult {
  successCount: number;
  failures: ImageAddFailure[];
}

// 업로드된 이미지
export interface UploadedImage {
  id: string;
  file: File;
  name: string;
  originalFormat: string;
  size: number;
  dimensions: ImageSize;
  dataUrl: string;
  status: ImageStatus;
  progress: number;
  compressedDataUrl?: string;
  compressedSize?: number;
  compressedDimensions?: ImageSize;
  actualQuality?: number;
  targetNotReached?: boolean;
  error?: string;
}

// 압축 옵션
export interface CompressionOptions {
  mode: CompressionMode;
  preset: CompressionPreset;
  targetSizeKB: number;
  outputFormat: OutputFormat;
}

// 스토어 상태 인터페이스
export interface CompressorState {
  // 이미지 목록
  images: UploadedImage[];

  // 압축 옵션
  options: CompressionOptions;

  // 처리 상태
  isCompressing: boolean;
  currentImageIndex: number;

  // 액션
  addImages: (files: File[]) => Promise<AddImagesResult>;
  removeImage: (id: string) => void;
  clearImages: () => void;
  setOption: <K extends keyof CompressionOptions>(
    key: K,
    value: CompressionOptions[K]
  ) => void;
  resetOptions: () => void;
  compressAll: () => Promise<void>;
  compressSingle: (id: string) => Promise<void>;
  cancelCompression: () => void;
  downloadSingle: (id: string) => void;
  downloadAll: () => Promise<void>;
  reset: () => void;
}

// 파일 제한
export const FILE_LIMITS = {
  maxSizeMB: 10,
  maxSizeBytes: 10 * 1024 * 1024,
  maxDimension: 4096,
  maxFiles: 10,
  supportedTypes: [
    "image/webp",
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/bmp",
  ] as const,
};

// 타겟 용량 관련 상수
export const TARGET_SIZE_LIMITS = {
  minKB: 10,
  maxKB: 10000,
  defaultKB: 500,
  maxIterations: 8,
  minQuality: 10,
  maxQuality: 100,
};
