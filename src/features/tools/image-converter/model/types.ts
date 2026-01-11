import { z } from "zod";

// 입력 포맷 (브라우저에서 지원하는 포맷)
export const inputFormats = [
  "image/webp",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/avif",
  "image/svg+xml",
] as const;
export type InputFormat = (typeof inputFormats)[number];

// 출력 포맷 (Canvas API에서 지원하는 포맷)
export const outputFormats = ["png", "jpeg", "webp", "gif", "bmp"] as const;
export type OutputFormat = (typeof outputFormats)[number];

// 리사이즈 모드
export const resizeModes = [
  "none",
  "percentage",
  "dimensions",
  "width",
  "height",
] as const;
export type ResizeMode = (typeof resizeModes)[number];

// 이미지 크기
export const imageSizeSchema = z.object({
  width: z.number().min(1).max(20000),
  height: z.number().min(1).max(20000),
});
export type ImageSize = z.infer<typeof imageSizeSchema>;

// 리사이즈 옵션
export const resizeOptionsSchema = z.object({
  mode: z.enum(resizeModes).default("none"),
  percentage: z.number().min(1).max(500).default(100),
  width: z.number().min(1).max(10000).optional(),
  height: z.number().min(1).max(10000).optional(),
  maintainAspectRatio: z.boolean().default(true),
});
export type ResizeOptions = z.infer<typeof resizeOptionsSchema>;

// 기본 리사이즈 옵션
export const DEFAULT_RESIZE_OPTIONS: ResizeOptions = {
  mode: "none",
  percentage: 100,
  maintainAspectRatio: true,
};

// 변환 옵션
export const conversionOptionsSchema = z.object({
  outputFormat: z.enum(outputFormats).default("png"),
  quality: z.number().min(1).max(100).default(92),
  backgroundColor: z.string().default("#ffffff"),
  preserveTransparency: z.boolean().default(true),
  resize: resizeOptionsSchema.default(DEFAULT_RESIZE_OPTIONS),
});
export type ConversionOptions = z.infer<typeof conversionOptionsSchema>;

// 이미지 상태
export const imageStatuses = [
  "pending",
  "converting",
  "completed",
  "error",
] as const;
export type ImageStatus = (typeof imageStatuses)[number];

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
  convertedDataUrl?: string;
  convertedSize?: number;
  convertedDimensions?: ImageSize;
  error?: string;
}

// 스토어 상태 인터페이스
export interface ConverterState {
  // 이미지 목록
  images: UploadedImage[];

  // 변환 옵션
  options: ConversionOptions;

  // 처리 상태
  isConverting: boolean;
  currentImageIndex: number;

  // 액션
  addImages: (files: File[]) => Promise<void>;
  removeImage: (id: string) => void;
  clearImages: () => void;
  setOption: <K extends keyof ConversionOptions>(
    key: K,
    value: ConversionOptions[K]
  ) => void;
  setResizeOption: <K extends keyof ResizeOptions>(
    key: K,
    value: ResizeOptions[K]
  ) => void;
  resetOptions: () => void;
  convertAll: () => Promise<void>;
  convertSingle: (id: string) => Promise<void>;
  cancelConversion: () => void;
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
  supportedTypes: inputFormats,
};

// 포맷 정보
export const FORMAT_INFO: Record<
  OutputFormat,
  {
    name: string;
    mimeType: string;
    extension: string;
    supportsTransparency: boolean;
    supportsQuality: boolean;
  }
> = {
  png: {
    name: "PNG",
    mimeType: "image/png",
    extension: "png",
    supportsTransparency: true,
    supportsQuality: false,
  },
  jpeg: {
    name: "JPEG",
    mimeType: "image/jpeg",
    extension: "jpg",
    supportsTransparency: false,
    supportsQuality: true,
  },
  webp: {
    name: "WebP",
    mimeType: "image/webp",
    extension: "webp",
    supportsTransparency: true,
    supportsQuality: true,
  },
  gif: {
    name: "GIF",
    mimeType: "image/gif",
    extension: "gif",
    supportsTransparency: true,
    supportsQuality: false,
  },
  bmp: {
    name: "BMP",
    mimeType: "image/bmp",
    extension: "bmp",
    supportsTransparency: false,
    supportsQuality: false,
  },
};
