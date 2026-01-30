import { z } from "zod";

// ==================== 크롭 관련 타입 ====================

// 종횡비 프리셋
export const aspectRatioPresets = ["free", "1:1", "4:3", "3:2", "16:9", "9:16"] as const;
export type AspectRatioPreset = (typeof aspectRatioPresets)[number];

// 크롭 설정
export interface CropSettings {
  aspectRatio: AspectRatioPreset;
}

export const DEFAULT_CROP_SETTINGS: CropSettings = {
  aspectRatio: "free",
};

// ==================== 텍스트 레이어 관련 타입 ====================

export type TextAlignment = "left" | "center" | "right";

export interface TextLayer {
  id: string;
  text: string;
  x: number;  // 0-100% (상대 위치)
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  rotation: number;
  alignment: TextAlignment;
  bold: boolean;
  italic: boolean;
}

export const DEFAULT_TEXT_LAYER: Omit<TextLayer, "id"> = {
  text: "텍스트를 입력하세요",
  x: 50,
  y: 50,
  fontSize: 32,
  fontFamily: "Arial",
  color: "#ffffff",
  opacity: 1,
  rotation: 0,
  alignment: "center",
  bold: false,
  italic: false,
};

// 폰트 옵션
export const FONT_FAMILIES = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Impact",
  "Comic Sans MS",
] as const;

// 워터마크 프리셋
export interface WatermarkPreset {
  id: string;
  name: string;
  nameKo: string;
  settings: Partial<Omit<TextLayer, "id" | "text">>;
}

export const WATERMARK_PRESETS: WatermarkPreset[] = [
  {
    id: "subtle",
    name: "Subtle",
    nameKo: "은은한",
    settings: {
      fontSize: 16,
      opacity: 0.3,
      color: "#ffffff",
      x: 95,
      y: 95,
      alignment: "right",
    },
  },
  {
    id: "diagonal",
    name: "Diagonal",
    nameKo: "대각선",
    settings: {
      fontSize: 48,
      opacity: 0.15,
      color: "#ffffff",
      x: 50,
      y: 50,
      rotation: -45,
      alignment: "center",
    },
  },
  {
    id: "corner",
    name: "Corner",
    nameKo: "모서리",
    settings: {
      fontSize: 14,
      opacity: 0.7,
      color: "#ffffff",
      x: 5,
      y: 95,
      alignment: "left",
    },
  },
];

// ==================== 브러시/그리기 관련 타입 ====================

export const brushModes = ["brush", "eraser", "line", "rectangle", "circle"] as const;
export type BrushMode = (typeof brushModes)[number];

export interface BrushSettings {
  mode: BrushMode;
  size: number;     // 1-100px
  color: string;
  opacity: number;  // 0-1
}

export const DEFAULT_BRUSH_SETTINGS: BrushSettings = {
  mode: "brush",
  size: 5,
  color: "#ff0000",
  opacity: 1,
};

export interface DrawPath {
  id: string;
  mode: BrushMode;
  points: { x: number; y: number }[];  // 브러시용 (상대 좌표 0-100%)
  startPoint?: { x: number; y: number };  // 도형용
  endPoint?: { x: number; y: number };
  settings: BrushSettings;
}

// ==================== 필터 타입 ====================

// 필터 타입
export const filterSchema = z.object({
  brightness: z.number().min(0).max(200).default(100),
  contrast: z.number().min(0).max(200).default(100),
  saturation: z.number().min(0).max(200).default(100),
  blur: z.number().min(0).max(20).default(0),
  grayscale: z.number().min(0).max(100).default(0),
  sepia: z.number().min(0).max(100).default(0),
  hueRotate: z.number().min(0).max(360).default(0),
  invert: z.number().min(0).max(100).default(0),
});

export type ImageFilters = z.infer<typeof filterSchema>;

// 변환 타입
export const transformSchema = z.object({
  rotate: z.number().min(-180).max(180).default(0),
  flipHorizontal: z.boolean().default(false),
  flipVertical: z.boolean().default(false),
  scale: z.number().min(0.1).max(5).default(1),
});

export type ImageTransform = z.infer<typeof transformSchema>;

// 크롭 영역
export const cropAreaSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export type CropArea = z.infer<typeof cropAreaSchema>;

// 이미지 크기
export const imageSizeSchema = z.object({
  width: z.number().min(1).max(10000),
  height: z.number().min(1).max(10000),
});

export type ImageSize = z.infer<typeof imageSizeSchema>;

// 내보내기 형식
export const exportFormats = ["png", "jpeg", "webp"] as const;
export type ExportFormat = (typeof exportFormats)[number];

// 내보내기 옵션
export const exportOptionsSchema = z.object({
  format: z.enum(exportFormats),
  quality: z.number().min(0.1).max(1).default(0.92),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type ExportOptions = z.infer<typeof exportOptionsSchema>;

// 히스토리 엔트리
export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  filters: ImageFilters;
  transform: ImageTransform;
  cropArea: CropArea | null;
  textLayers?: TextLayer[];
  drawPaths?: DrawPath[];
}

// 이미지 에디터 상태
export interface ImageEditorState {
  // 이미지 상태
  originalImage: string | null;
  originalSize: ImageSize | null;
  currentSize: ImageSize | null;

  // 편집 상태
  filters: ImageFilters;
  transform: ImageTransform;
  cropArea: CropArea | null;
  isCropping: boolean;

  // 크롭 설정
  cropSettings: CropSettings;

  // 텍스트 레이어
  textLayers: TextLayer[];
  selectedTextLayerId: string | null;

  // 그리기
  drawPaths: DrawPath[];
  brushSettings: BrushSettings;
  isDrawing: boolean;

  // UI 상태
  isLoading: boolean;
  activeTab: "filters" | "transform" | "resize" | "crop" | "text" | "draw";
  exportProgress: number | null; // null = 내보내기 중 아님, 0-100 = 진행률

  // 히스토리
  history: HistoryEntry[];
  historyIndex: number;

  // 액션
  loadImage: (file: File) => Promise<void>;
  setFilter: <K extends keyof ImageFilters>(key: K, value: ImageFilters[K]) => void;
  resetFilters: () => void;
  setTransform: <K extends keyof ImageTransform>(key: K, value: ImageTransform[K]) => void;
  resetTransform: () => void;
  setCropArea: (area: CropArea | null) => void;
  applyCrop: () => Promise<void>;
  setIsCropping: (isCropping: boolean) => void;
  setCropSettings: (settings: Partial<CropSettings>) => void;
  resize: (size: ImageSize, maintainAspectRatio?: boolean) => void;
  setActiveTab: (tab: ImageEditorState["activeTab"]) => void;
  reset: () => void;
  cleanup: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  exportImage: (options: ExportOptions) => Promise<string>;
  cancelExport: () => void;

  // 텍스트 레이어 액션
  addTextLayer: (text?: string) => void;
  updateTextLayer: (id: string, updates: Partial<Omit<TextLayer, "id">>) => void;
  removeTextLayer: (id: string) => void;
  selectTextLayer: (id: string | null) => void;
  applyWatermarkPreset: (presetId: string, text: string) => void;

  // 그리기 액션
  setBrushSettings: (settings: Partial<BrushSettings>) => void;
  startDrawing: () => void;
  addDrawPoint: (point: { x: number; y: number }) => void;
  endDrawing: () => void;
  addShapePath: (startPoint: { x: number; y: number }, endPoint: { x: number; y: number }) => void;
  removeDrawPath: (id: string) => void;
  clearAllDrawPaths: () => void;
}

// 필터 프리셋
export interface FilterPreset {
  id: string;
  name: string;
  nameKo: string;
  filters: Partial<ImageFilters>;
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: "original",
    name: "Original",
    nameKo: "원본",
    filters: {},
  },
  {
    id: "vivid",
    name: "Vivid",
    nameKo: "선명",
    filters: { saturation: 130, contrast: 110 },
  },
  {
    id: "warm",
    name: "Warm",
    nameKo: "따뜻한",
    filters: { sepia: 20, saturation: 110 },
  },
  {
    id: "cool",
    name: "Cool",
    nameKo: "차가운",
    filters: { hueRotate: 180, saturation: 80 },
  },
  {
    id: "vintage",
    name: "Vintage",
    nameKo: "빈티지",
    filters: { sepia: 40, contrast: 90, saturation: 80 },
  },
  {
    id: "dramatic",
    name: "Dramatic",
    nameKo: "드라마틱",
    filters: { contrast: 140, saturation: 90, brightness: 90 },
  },
  {
    id: "bw",
    name: "B&W",
    nameKo: "흑백",
    filters: { grayscale: 100 },
  },
  {
    id: "noir",
    name: "Noir",
    nameKo: "누아르",
    filters: { grayscale: 100, contrast: 130, brightness: 90 },
  },
];

// 기본 필터 값
export const DEFAULT_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  invert: 0,
};

// 기본 변환 값
export const DEFAULT_TRANSFORM: ImageTransform = {
  rotate: 0,
  flipHorizontal: false,
  flipVertical: false,
  scale: 1,
};
