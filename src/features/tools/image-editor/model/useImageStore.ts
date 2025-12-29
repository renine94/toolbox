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
} from "./types";
import { applyFiltersToCanvas, applyTransformToCanvas, loadImageAsDataURL } from "../lib/image-utils";

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
  isLoading: false,
  activeTab: "filters",
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
        history: [],
        historyIndex: -1,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
      throw new Error("이미지를 로드하는 데 실패했습니다.");
    }
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
    };

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);

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
    };

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);

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
    };

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);

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
    };

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);

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

  // 크롭 적용
  applyCrop: () => {
    const state = get();
    if (!state.cropArea || !state.currentSize) return;

    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      action: "크롭 적용",
      filters: state.filters,
      transform: state.transform,
      cropArea: state.cropArea,
    };

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);

    set({
      currentSize: {
        width: Math.round(state.cropArea.width),
        height: Math.round(state.cropArea.height),
      },
      isCropping: false,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
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
    };

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);

    set({
      currentSize: size,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // 탭 변경
  setActiveTab: (tab) => {
    set({ activeTab: tab, isCropping: tab === "crop" });
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
      historyIndex: state.historyIndex + 1,
    });
  },

  // 실행 취소 가능 여부
  canUndo: () => get().historyIndex > 0,

  // 다시 실행 가능 여부
  canRedo: () => get().historyIndex < get().history.length - 1,

  // 이미지 내보내기
  exportImage: async (options: ExportOptions): Promise<string> => {
    const state = get();
    if (!state.originalImage) {
      throw new Error("이미지가 없습니다.");
    }

    // 캔버스 생성
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context를 가져올 수 없습니다.");

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

    // 변환 적용
    applyTransformToCanvas(canvas, ctx, img, state.transform, targetWidth, targetHeight);

    // 필터 적용
    applyFiltersToCanvas(ctx, state.filters, targetWidth, targetHeight);

    // 내보내기
    const mimeType = `image/${options.format}`;
    return canvas.toDataURL(mimeType, options.quality);
  },
}));
