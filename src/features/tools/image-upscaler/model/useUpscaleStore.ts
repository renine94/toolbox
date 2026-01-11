import { create } from "zustand";
import type {
  UpscaleState,
  ScaleOption,
  AlgorithmOption,
  ImageSize,
  ExportOptions,
  WorkerOutput,
} from "./types";
import {
  loadImageAsDataURL,
  validateImageFile,
  validateImageDimensions,
} from "../lib/upscale-utils";

let upscaleWorker: Worker | null = null;

function getUpscaleWorker(): Worker {
  if (!upscaleWorker && typeof window !== "undefined") {
    upscaleWorker = new Worker(
      new URL("../lib/upscale-worker.ts", import.meta.url)
    );
  }
  return upscaleWorker!;
}

function terminateWorker(): void {
  if (upscaleWorker) {
    upscaleWorker.terminate();
    upscaleWorker = null;
  }
}

export const useUpscaleStore = create<UpscaleState>((set, get) => ({
  // 초기 상태
  originalImage: null,
  upscaledImage: null,
  originalSize: null,
  upscaledSize: null,
  scale: 2,
  algorithm: "lanczos3",
  isLoading: false,
  isProcessing: false,
  progress: 0,
  error: null,

  // 이미지 로드
  loadImage: async (file: File) => {
    set({ isLoading: true, error: null });

    try {
      // 파일 유효성 검사
      validateImageFile(file);

      // Data URL로 변환
      const dataUrl = await loadImageAsDataURL(file);

      // 이미지 크기 확인
      const size = await new Promise<ImageSize>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = dataUrl;
      });

      // 크기 제한 확인
      validateImageDimensions(size);

      set({
        originalImage: dataUrl,
        originalSize: size,
        upscaledImage: null,
        upscaledSize: null,
        isLoading: false,
        error: null,
        progress: 0,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "loadError",
      });
    }
  },

  // 스케일 설정
  setScale: (scale: ScaleOption) => {
    set({ scale, upscaledImage: null, upscaledSize: null, progress: 0 });
  },

  // 알고리즘 설정
  setAlgorithm: (algorithm: AlgorithmOption) => {
    set({ algorithm, upscaledImage: null, upscaledSize: null, progress: 0 });
  },

  // 업스케일 처리
  processUpscale: async () => {
    const state = get();
    if (!state.originalImage || !state.originalSize) return;

    set({ isProcessing: true, progress: 0, error: null });

    try {
      // 이미지를 ImageData로 변환
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = state.originalImage!;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get canvas context");

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      const worker = getUpscaleWorker();

      return new Promise<void>((resolve, reject) => {
        const handleMessage = (e: MessageEvent<WorkerOutput>) => {
          switch (e.data.type) {
            case "progress":
              set({ progress: e.data.percent });
              break;

            case "complete":
              worker.removeEventListener("message", handleMessage);

              // 결과를 Data URL로 변환
              const resultCanvas = document.createElement("canvas");
              resultCanvas.width = e.data.imageData.width;
              resultCanvas.height = e.data.imageData.height;
              const resultCtx = resultCanvas.getContext("2d");
              if (!resultCtx) {
                set({ isProcessing: false, error: "canvasError" });
                reject(new Error("Failed to get canvas context"));
                return;
              }

              resultCtx.putImageData(e.data.imageData, 0, 0);
              const resultDataUrl = resultCanvas.toDataURL("image/png");

              set({
                upscaledImage: resultDataUrl,
                upscaledSize: {
                  width: e.data.imageData.width,
                  height: e.data.imageData.height,
                },
                isProcessing: false,
                progress: 100,
              });
              resolve();
              break;

            case "error":
              worker.removeEventListener("message", handleMessage);
              if (e.data.message !== "cancelled") {
                set({ isProcessing: false, error: e.data.message });
                reject(new Error(e.data.message));
              } else {
                set({ isProcessing: false, progress: 0 });
                resolve();
              }
              break;
          }
        };

        worker.addEventListener("message", handleMessage);

        // Transferable로 데이터 전송 (복사 대신 이동)
        worker.postMessage(
          {
            type: "upscale",
            imageData,
            scale: state.scale,
            algorithm: state.algorithm,
          },
          [imageData.data.buffer]
        );
      });
    } catch (error) {
      set({
        isProcessing: false,
        error: error instanceof Error ? error.message : "processError",
      });
    }
  },

  // 업스케일 취소
  cancelUpscale: () => {
    const worker = getUpscaleWorker();
    if (worker) {
      worker.postMessage({ type: "cancel" });
    }
    set({ isProcessing: false, progress: 0 });
  },

  // 이미지 내보내기
  exportImage: async (options: ExportOptions): Promise<string> => {
    const state = get();
    if (!state.upscaledImage) {
      throw new Error("No upscaled image to export");
    }

    const canvas = document.createElement("canvas");
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = state.upscaledImage!;
    });

    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    ctx.drawImage(img, 0, 0);

    const mimeType = `image/${options.format}`;
    return canvas.toDataURL(mimeType, options.quality);
  },

  // 초기화
  reset: () => {
    terminateWorker();
    set({
      originalImage: null,
      upscaledImage: null,
      originalSize: null,
      upscaledSize: null,
      scale: 2,
      algorithm: "lanczos3",
      isLoading: false,
      isProcessing: false,
      progress: 0,
      error: null,
    });
  },
}));
