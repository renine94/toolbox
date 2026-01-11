import { z } from "zod";

// 스케일 옵션
export const scaleOptions = [2, 3, 4] as const;
export type ScaleOption = (typeof scaleOptions)[number];

// 업스케일 알고리즘
export const algorithmOptions = ["bilinear", "bicubic", "lanczos3"] as const;
export type AlgorithmOption = (typeof algorithmOptions)[number];

// 이미지 크기
export const imageSizeSchema = z.object({
  width: z.number().min(1).max(20000),
  height: z.number().min(1).max(20000),
});
export type ImageSize = z.infer<typeof imageSizeSchema>;

// 내보내기 형식
export const exportFormats = ["png", "jpeg", "webp"] as const;
export type ExportFormat = (typeof exportFormats)[number];

// 내보내기 옵션
export const exportOptionsSchema = z.object({
  format: z.enum(exportFormats),
  quality: z.number().min(0.1).max(1).default(0.92),
});
export type ExportOptions = z.infer<typeof exportOptionsSchema>;

// 스토어 상태 인터페이스
export interface UpscaleState {
  // 이미지 상태
  originalImage: string | null;
  upscaledImage: string | null;
  originalSize: ImageSize | null;
  upscaledSize: ImageSize | null;

  // 설정
  scale: ScaleOption;
  algorithm: AlgorithmOption;

  // 처리 상태
  isLoading: boolean;
  isProcessing: boolean;
  progress: number;
  error: string | null;

  // 액션
  loadImage: (file: File) => Promise<void>;
  setScale: (scale: ScaleOption) => void;
  setAlgorithm: (algorithm: AlgorithmOption) => void;
  processUpscale: () => Promise<void>;
  cancelUpscale: () => void;
  exportImage: (options: ExportOptions) => Promise<string>;
  reset: () => void;
}

// 알고리즘 정보
export const ALGORITHM_INFO = {
  bilinear: {
    name: "Bilinear",
    speed: "fast" as const,
    quality: "basic" as const,
  },
  bicubic: {
    name: "Bicubic",
    speed: "medium" as const,
    quality: "good" as const,
  },
  lanczos3: {
    name: "Lanczos3",
    speed: "slow" as const,
    quality: "excellent" as const,
  },
} as const;

// 파일 제한
export const FILE_LIMITS = {
  maxSizeMB: 10,
  maxSizeBytes: 10 * 1024 * 1024,
  maxDimension: 4096,
  supportedTypes: ["image/png", "image/jpeg", "image/webp"] as const,
};

// Worker 메시지 타입
export interface WorkerInput {
  type: "upscale" | "cancel";
  imageData?: ImageData;
  scale?: ScaleOption;
  algorithm?: AlgorithmOption;
}

export interface WorkerProgressOutput {
  type: "progress";
  percent: number;
}

export interface WorkerCompleteOutput {
  type: "complete";
  imageData: ImageData;
}

export interface WorkerErrorOutput {
  type: "error";
  message: string;
}

export type WorkerOutput =
  | WorkerProgressOutput
  | WorkerCompleteOutput
  | WorkerErrorOutput;
