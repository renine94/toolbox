import { create } from "zustand";
import {
  ImageEditorState,
  ImageFilters,
  ImageTransform,
  ImageSize,
  CropArea,
  ExportOptions,
  HistoryEntry,
  DEFAULT_FILTERS,
  DEFAULT_TRANSFORM,
  DEFAULT_CROP_SETTINGS,
  DEFAULT_BRUSH_SETTINGS,
  DEFAULT_MOSAIC_SETTINGS,
  DEFAULT_TEXT_LAYER,
  TextLayer,
  DrawPath,
  MosaicArea,
  CropSettings,
  BrushSettings,
  MosaicSettings,
  WATERMARK_PRESETS,
} from "./types";
import { applyTransformToCanvas, loadImageAsDataURL } from "../lib/image-utils";
import { renderAllTextLayers } from "../lib/text-utils";
import { renderAllDrawPaths } from "../lib/draw-utils";
import { renderAllMosaicAreas } from "../lib/mosaic-utils";
import { createDefaultCropArea, getAspectRatioValue } from "../lib/crop-utils";
import type { WorkerInput, WorkerOutput } from "../lib/image-worker";

// Worker 인스턴스 (싱글톤)
let imageWorker: Worker | null = null;

// Worker 설정
const EXPORT_TIMEOUT = 30000; // 30초 타임아웃
const MAX_HISTORY_SIZE = 50; // 히스토리 최대 크기

function getImageWorker(): Worker {
  if (!imageWorker) {
    imageWorker = new Worker(
      new URL("../lib/image-worker.ts", import.meta.url)
    );
  }
  return imageWorker;
}

// Worker 정리 함수 (메모리 누수 방지)
function cleanupImageWorker(): void {
  if (imageWorker) {
    imageWorker.terminate();
    imageWorker = null;
  }
}

// 히스토리 크기 제한 헬퍼 함수
function limitHistorySize(history: HistoryEntry[]): HistoryEntry[] {
  if (history.length > MAX_HISTORY_SIZE) {
    return history.slice(-MAX_HISTORY_SIZE);
  }
  return history;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useImageStore = create<ImageEditorState>((set, get) => ({
  // 초기 상태
  originalImage: null,
  originalSize: null,
  currentSize: null,
  filters: { ...DEFAULT_FILTERS },
  transform: { ...DEFAULT_TRANSFORM },
  cropArea: null,
  isCropping: false,
  cropSettings: { ...DEFAULT_CROP_SETTINGS },
  textLayers: [],
  selectedTextLayerId: null,
  drawPaths: [],
  brushSettings: { ...DEFAULT_BRUSH_SETTINGS },
  isDrawing: false,
  mosaicAreas: [],
  mosaicSettings: { ...DEFAULT_MOSAIC_SETTINGS },
  isMosaicing: false,
  isLoading: false,
  activeTab: "filters",
  exportProgress: null,
  history: [],
  historyIndex: -1,

  // 이미지 로드
  loadImage: async (file: File) => {
    set({ isLoading: true });
    try {
      const dataUrl = await loadImageAsDataURL(file);

      // 이미지 크기 가져오기
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = dataUrl;
      });

      const size: ImageSize = { width: img.width, height: img.height };

      set({
        originalImage: dataUrl,
        originalSize: size,
        currentSize: size,
        filters: { ...DEFAULT_FILTERS },
        transform: { ...DEFAULT_TRANSFORM },
        cropArea: null,
        isCropping: false,
        cropSettings: { ...DEFAULT_CROP_SETTINGS },
        textLayers: [],
        selectedTextLayerId: null,
        drawPaths: [],
        brushSettings: { ...DEFAULT_BRUSH_SETTINGS },
        isDrawing: false,
        mosaicAreas: [],
        mosaicSettings: { ...DEFAULT_MOSAIC_SETTINGS },
        isMosaicing: false,
        history: [],
        historyIndex: -1,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
      throw new Error("이미지를 로드하는 데 실패했습니다.");
    }
  },

  // 히스토리 엔트리 생성 헬퍼
  createHistoryEntry: (action: string, updates: Partial<HistoryEntry> = {}): HistoryEntry => {
    const state = get();
    return {
      id: generateId(),
      timestamp: Date.now(),
      action,
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: [...state.drawPaths],
      mosaicAreas: [...state.mosaicAreas],
      ...updates,
    };
  },

  // 필터 설정
  setFilter: <K extends keyof ImageFilters>(key: K, value: ImageFilters[K]) => {
    const state = get();
    const newFilters = { ...state.filters, [key]: value };

    // 히스토리에 추가
    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: `필터 변경: ${key}`,
      filters: newFilters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: [...state.drawPaths],
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      filters: newFilters,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 필터 초기화
  resetFilters: () => {
    const state = get();
    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "필터 초기화",
      filters: { ...DEFAULT_FILTERS },
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: [...state.drawPaths],
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      filters: { ...DEFAULT_FILTERS },
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 변환 설정
  setTransform: <K extends keyof ImageTransform>(key: K, value: ImageTransform[K]) => {
    const state = get();
    const newTransform = { ...state.transform, [key]: value };

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: `변환: ${key}`,
      filters: state.filters,
      transform: newTransform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: [...state.drawPaths],
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      transform: newTransform,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 변환 초기화
  resetTransform: () => {
    const state = get();
    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "변환 초기화",
      filters: state.filters,
      transform: { ...DEFAULT_TRANSFORM },
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: [...state.drawPaths],
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      transform: { ...DEFAULT_TRANSFORM },
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 크롭 영역 설정
  setCropArea: (area: CropArea | null) => {
    set({ cropArea: area });
  },

  // 크롭 모드 설정
  setIsCropping: (isCropping: boolean) => {
    set({ isCropping, cropArea: isCropping ? get().cropArea : null });
  },

  // 크롭 적용 (실제로 이미지를 자름)
  applyCrop: async () => {
    const state = get();
    if (!state.cropArea || !state.originalImage) return;

    set({ isLoading: true });

    try {
      // 원본 이미지 로드
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = state.originalImage!;
      });

      // Canvas에 크롭된 영역만 그리기
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        set({ isLoading: false });
        return;
      }

      const cropX = Math.round(state.cropArea.x);
      const cropY = Math.round(state.cropArea.y);
      const cropWidth = Math.round(state.cropArea.width);
      const cropHeight = Math.round(state.cropArea.height);

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // 크롭 영역만 캔버스에 그리기
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,  // 소스 영역
        0, 0, cropWidth, cropHeight            // 대상 영역
      );

      // 새로운 Data URL 생성
      const croppedDataUrl = canvas.toDataURL("image/png");

      const newSize = { width: cropWidth, height: cropHeight };

      const entry: HistoryEntry = {
        id: generateId(),
        timestamp: Date.now(),
        action: "크롭 적용",
        filters: state.filters,
        transform: state.transform,
        cropArea: state.cropArea,
        textLayers: [...state.textLayers],
        drawPaths: [...state.drawPaths],
        mosaicAreas: [...state.mosaicAreas],
      };

      let newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(entry);
      newHistory = limitHistorySize(newHistory);

      set({
        originalImage: croppedDataUrl,
        originalSize: newSize,
        currentSize: newSize,
        cropArea: null,
        isCropping: false,
        isLoading: false,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  // 크롭 설정 변경
  setCropSettings: (settings: Partial<CropSettings>) => {
    set((state) => ({
      cropSettings: { ...state.cropSettings, ...settings },
    }));
  },

  // 리사이즈
  resize: (size: ImageSize) => {
    const state = get();
    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: `리사이즈: ${size.width}x${size.height}`,
      filters: state.filters,
      transform: state.transform,
      cropArea: null,
      textLayers: [...state.textLayers],
      drawPaths: [...state.drawPaths],
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      currentSize: size,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 탭 변경
  setActiveTab: (tab) => {
    const state = get();

    if (tab === "crop") {
      // crop 탭 진입 시 바로 기본 크롭 영역 생성
      const imageWidth = state.currentSize?.width || state.originalSize?.width || 0;
      const imageHeight = state.currentSize?.height || state.originalSize?.height || 0;

      if (imageWidth && imageHeight) {
        const aspectRatio = getAspectRatioValue(state.cropSettings.aspectRatio);
        const defaultArea = createDefaultCropArea(imageWidth, imageHeight, aspectRatio);
        set({ activeTab: tab, isCropping: true, cropArea: defaultArea });
      } else {
        set({ activeTab: tab, isCropping: true });
      }
    } else {
      // 다른 탭으로 전환 시 크롭 모드 해제
      set({ activeTab: tab, isCropping: false, cropArea: null });
    }
  },

  // 전체 초기화
  reset: () => {
    const state = get();
    set({
      filters: { ...DEFAULT_FILTERS },
      transform: { ...DEFAULT_TRANSFORM },
      currentSize: state.originalSize,
      cropArea: null,
      isCropping: false,
      cropSettings: { ...DEFAULT_CROP_SETTINGS },
      textLayers: [],
      selectedTextLayerId: null,
      drawPaths: [],
      brushSettings: { ...DEFAULT_BRUSH_SETTINGS },
      isDrawing: false,
      mosaicAreas: [],
      mosaicSettings: { ...DEFAULT_MOSAIC_SETTINGS },
      isMosaicing: false,
      history: [],
      historyIndex: -1,
    });
  },

  // Worker 정리 (컴포넌트 언마운트 시 호출)
  cleanup: () => {
    cleanupImageWorker();
    set({
      originalImage: null,
      originalSize: null,
      currentSize: null,
      filters: { ...DEFAULT_FILTERS },
      transform: { ...DEFAULT_TRANSFORM },
      cropArea: null,
      isCropping: false,
      cropSettings: { ...DEFAULT_CROP_SETTINGS },
      textLayers: [],
      selectedTextLayerId: null,
      drawPaths: [],
      brushSettings: { ...DEFAULT_BRUSH_SETTINGS },
      isDrawing: false,
      mosaicAreas: [],
      mosaicSettings: { ...DEFAULT_MOSAIC_SETTINGS },
      isMosaicing: false,
      isLoading: false,
      exportProgress: null,
      history: [],
      historyIndex: -1,
    });
  },

  // 실행 취소
  undo: () => {
    const state = get();
    if (state.historyIndex <= 0) return;

    const prevEntry = state.history[state.historyIndex - 1];
    set({
      filters: prevEntry.filters,
      transform: prevEntry.transform,
      cropArea: prevEntry.cropArea,
      textLayers: prevEntry.textLayers || [],
      drawPaths: prevEntry.drawPaths || [],
      mosaicAreas: prevEntry.mosaicAreas || [],
      historyIndex: state.historyIndex - 1,
    });
  },

  // 다시 실행
  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;

    const nextEntry = state.history[state.historyIndex + 1];
    set({
      filters: nextEntry.filters,
      transform: nextEntry.transform,
      cropArea: nextEntry.cropArea,
      textLayers: nextEntry.textLayers || [],
      drawPaths: nextEntry.drawPaths || [],
      mosaicAreas: nextEntry.mosaicAreas || [],
      historyIndex: state.historyIndex + 1,
    });
  },

  // 실행 취소 가능 여부
  canUndo: () => get().historyIndex > 0,

  // 다시 실행 가능 여부
  canRedo: () => get().historyIndex < get().history.length - 1,

  // 내보내기 취소
  cancelExport: () => {
    const worker = getImageWorker();
    worker.postMessage({ type: "cancel" } as WorkerInput);
    set({ exportProgress: null });
  },

  // ==================== 텍스트 레이어 액션 ====================

  // 텍스트 레이어 추가
  addTextLayer: (text?: string) => {
    const state = get();
    const newLayer: TextLayer = {
      id: generateId(),
      ...DEFAULT_TEXT_LAYER,
      text: text || DEFAULT_TEXT_LAYER.text,
    };

    const newTextLayers = [...state.textLayers, newLayer];

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "텍스트 레이어 추가",
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: newTextLayers,
      drawPaths: [...state.drawPaths],
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      textLayers: newTextLayers,
      selectedTextLayerId: newLayer.id,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 텍스트 레이어 업데이트
  updateTextLayer: (id: string, updates: Partial<Omit<TextLayer, "id">>) => {
    const state = get();
    const newTextLayers = state.textLayers.map((layer) =>
      layer.id === id ? { ...layer, ...updates } : layer
    );

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "텍스트 레이어 수정",
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: newTextLayers,
      drawPaths: [...state.drawPaths],
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      textLayers: newTextLayers,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 텍스트 레이어 삭제
  removeTextLayer: (id: string) => {
    const state = get();
    const newTextLayers = state.textLayers.filter((layer) => layer.id !== id);

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "텍스트 레이어 삭제",
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: newTextLayers,
      drawPaths: [...state.drawPaths],
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      textLayers: newTextLayers,
      selectedTextLayerId: state.selectedTextLayerId === id ? null : state.selectedTextLayerId,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 텍스트 레이어 선택
  selectTextLayer: (id: string | null) => {
    set({ selectedTextLayerId: id });
  },

  // 워터마크 프리셋 적용
  applyWatermarkPreset: (presetId: string, text: string) => {
    const preset = WATERMARK_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const state = get();
    const newLayer: TextLayer = {
      id: generateId(),
      ...DEFAULT_TEXT_LAYER,
      ...preset.settings,
      text,
    };

    const newTextLayers = [...state.textLayers, newLayer];

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: `워터마크 적용: ${preset.nameKo}`,
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: newTextLayers,
      drawPaths: [...state.drawPaths],
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      textLayers: newTextLayers,
      selectedTextLayerId: newLayer.id,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // ==================== 그리기 액션 ====================

  // 브러시 설정 변경
  setBrushSettings: (settings: Partial<BrushSettings>) => {
    set((state) => ({
      brushSettings: { ...state.brushSettings, ...settings },
    }));
  },

  // 그리기 시작
  startDrawing: () => {
    const state = get();
    const newPath: DrawPath = {
      id: generateId(),
      mode: state.brushSettings.mode,
      points: [],
      settings: { ...state.brushSettings },
    };

    set({
      isDrawing: true,
      drawPaths: [...state.drawPaths, newPath],
    });
  },

  // 그리기 점 추가
  addDrawPoint: (point: { x: number; y: number }) => {
    const state = get();
    if (!state.isDrawing || state.drawPaths.length === 0) return;

    const currentPath = state.drawPaths[state.drawPaths.length - 1];
    const updatedPath = {
      ...currentPath,
      points: [...currentPath.points, point],
    };

    set({
      drawPaths: [...state.drawPaths.slice(0, -1), updatedPath],
    });
  },

  // 그리기 종료
  endDrawing: () => {
    const state = get();
    if (!state.isDrawing) return;

    // 빈 경로 제거
    const lastPath = state.drawPaths[state.drawPaths.length - 1];
    let newDrawPaths = state.drawPaths;
    if (lastPath && lastPath.points.length < 2) {
      newDrawPaths = state.drawPaths.slice(0, -1);
    }

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "그리기",
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: newDrawPaths,
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      isDrawing: false,
      drawPaths: newDrawPaths,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 도형 경로 추가
  addShapePath: (startPoint: { x: number; y: number }, endPoint: { x: number; y: number }) => {
    const state = get();
    const newPath: DrawPath = {
      id: generateId(),
      mode: state.brushSettings.mode,
      points: [],
      startPoint,
      endPoint,
      settings: { ...state.brushSettings },
    };

    const newDrawPaths = [...state.drawPaths, newPath];

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: `도형 그리기: ${state.brushSettings.mode}`,
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: newDrawPaths,
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      drawPaths: newDrawPaths,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 그리기 경로 삭제
  removeDrawPath: (id: string) => {
    const state = get();
    const newDrawPaths = state.drawPaths.filter((path) => path.id !== id);

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "그리기 삭제",
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: newDrawPaths,
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      drawPaths: newDrawPaths,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 모든 그리기 지우기
  clearAllDrawPaths: () => {
    const state = get();
    if (state.drawPaths.length === 0) return;

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "모든 그리기 지우기",
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: [],
      mosaicAreas: [...state.mosaicAreas],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      drawPaths: [],
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // ==================== 모자이크 액션 ====================

  // 모자이크 설정 변경
  setMosaicSettings: (settings: Partial<MosaicSettings>) => {
    set((state) => ({
      mosaicSettings: { ...state.mosaicSettings, ...settings },
    }));
  },

  // 모자이크 그리기 시작 (브러시 모드)
  startMosaicing: () => {
    const state = get();
    const newArea: MosaicArea = {
      id: generateId(),
      mode: state.mosaicSettings.mode,
      pixelSize: state.mosaicSettings.pixelSize,
      points: [],
      brushSize: state.mosaicSettings.brushSize,
    };

    set({
      isMosaicing: true,
      mosaicAreas: [...state.mosaicAreas, newArea],
    });
  },

  // 모자이크 포인트 추가 (브러시 모드)
  addMosaicPoint: (point: { x: number; y: number }) => {
    const state = get();
    if (!state.isMosaicing || state.mosaicAreas.length === 0) return;

    const currentArea = state.mosaicAreas[state.mosaicAreas.length - 1];
    const updatedArea = {
      ...currentArea,
      points: [...currentArea.points, point],
    };

    set({
      mosaicAreas: [...state.mosaicAreas.slice(0, -1), updatedArea],
    });
  },

  // 모자이크 그리기 종료 (브러시 모드)
  endMosaicing: () => {
    const state = get();
    if (!state.isMosaicing) return;

    // 빈 영역 제거
    const lastArea = state.mosaicAreas[state.mosaicAreas.length - 1];
    let newMosaicAreas = state.mosaicAreas;
    if (lastArea && lastArea.points.length < 2) {
      newMosaicAreas = state.mosaicAreas.slice(0, -1);
    }

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "모자이크",
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: [...state.drawPaths],
      mosaicAreas: newMosaicAreas,
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      isMosaicing: false,
      mosaicAreas: newMosaicAreas,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 사각형 모자이크 추가
  addMosaicRect: (startPoint: { x: number; y: number }, endPoint: { x: number; y: number }) => {
    const state = get();
    const newArea: MosaicArea = {
      id: generateId(),
      mode: "rectangle",
      pixelSize: state.mosaicSettings.pixelSize,
      points: [],
      brushSize: state.mosaicSettings.brushSize,
      startPoint,
      endPoint,
    };

    const newMosaicAreas = [...state.mosaicAreas, newArea];

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "사각형 모자이크",
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: [...state.drawPaths],
      mosaicAreas: newMosaicAreas,
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      mosaicAreas: newMosaicAreas,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 모자이크 영역 삭제
  removeMosaicArea: (id: string) => {
    const state = get();
    const newMosaicAreas = state.mosaicAreas.filter((area) => area.id !== id);

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "모자이크 삭제",
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: [...state.drawPaths],
      mosaicAreas: newMosaicAreas,
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      mosaicAreas: newMosaicAreas,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 모든 모자이크 지우기
  clearAllMosaicAreas: () => {
    const state = get();
    if (state.mosaicAreas.length === 0) return;

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "모든 모자이크 지우기",
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
      textLayers: [...state.textLayers],
      drawPaths: [...state.drawPaths],
      mosaicAreas: [],
    };

    let newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    newHistory = limitHistorySize(newHistory);

    set({
      mosaicAreas: [],
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 이미지 내보내기 (Worker 기반)
  exportImage: async (options: ExportOptions): Promise<string> => {
    const state = get();
    if (!state.originalImage) {
      throw new Error("이미지가 없습니다.");
    }

    set({ exportProgress: 0 });

    // 캔버스 생성
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      set({ exportProgress: null });
      throw new Error("Canvas context를 가져올 수 없습니다.");
    }

    // 이미지 로드
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = state.originalImage!;
    });

    // 크기 설정
    const targetWidth = options.width || state.currentSize?.width || img.width;
    const targetHeight = options.height || state.currentSize?.height || img.height;

    // 변환 적용 (빠름 - 메인 스레드에서 처리)
    applyTransformToCanvas(canvas, ctx, img, state.transform, targetWidth, targetHeight);

    // 필터 적용 (Worker에서 처리)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const worker = getImageWorker();

    const workerPromise = new Promise<ImageData>((resolve, reject) => {
      const handleMessage = (e: MessageEvent<WorkerOutput>) => {
        switch (e.data.type) {
          case "progress":
            set({ exportProgress: e.data.percent });
            break;
          case "complete":
            worker.removeEventListener("message", handleMessage);
            set({ exportProgress: 100 });
            resolve(e.data.imageData);
            break;
          case "error":
            worker.removeEventListener("message", handleMessage);
            set({ exportProgress: null });
            reject(new Error(e.data.message));
            break;
        }
      };

      worker.addEventListener("message", handleMessage);

      // Transferable 객체로 전송 (복사 대신 이동)
      worker.postMessage(
        {
          type: "applyFilters",
          imageData,
          filters: state.filters,
        } as WorkerInput,
        [imageData.data.buffer]
      );
    });

    // 타임아웃과 함께 Worker 응답 대기
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("이미지 내보내기 시간이 초과되었습니다. 다시 시도해주세요.")),
        EXPORT_TIMEOUT
      )
    );

    const processedImageData = await Promise.race([workerPromise, timeoutPromise]);

    // 처리된 이미지 데이터를 캔버스에 적용
    ctx.putImageData(processedImageData, 0, 0);

    // 모자이크 영역 렌더링 (필터 적용 후, 그리기 전)
    if (state.mosaicAreas.length > 0) {
      // 현재 캔버스 상태를 소스로 사용하여 모자이크 적용
      const mosaicSourceCanvas = document.createElement("canvas");
      mosaicSourceCanvas.width = canvas.width;
      mosaicSourceCanvas.height = canvas.height;
      const mosaicSourceCtx = mosaicSourceCanvas.getContext("2d");
      if (mosaicSourceCtx) {
        mosaicSourceCtx.drawImage(canvas, 0, 0);
        renderAllMosaicAreas(ctx, mosaicSourceCanvas, state.mosaicAreas, canvas.width, canvas.height);
      }
    }

    // 그리기 경로 렌더링 (필터 적용 후)
    if (state.drawPaths.length > 0) {
      renderAllDrawPaths(ctx, state.drawPaths, canvas.width, canvas.height);
    }

    // 텍스트 레이어 렌더링 (가장 위에)
    if (state.textLayers.length > 0) {
      renderAllTextLayers(ctx, state.textLayers, canvas.width, canvas.height);
    }

    // 내보내기
    const mimeType = `image/${options.format}`;
    const result = canvas.toDataURL(mimeType, options.quality);

    set({ exportProgress: null });
    return result;
  },
}));
