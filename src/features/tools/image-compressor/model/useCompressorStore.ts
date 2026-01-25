import { create } from "zustand";
import type {
  CompressorState,
  CompressionOptions,
  UploadedImage,
  AddImagesResult,
  ImageAddFailure,
  ImageAddErrorType,
} from "./types";
import { FILE_LIMITS, TARGET_SIZE_LIMITS } from "./types";
import {
  loadImageAsDataURL,
  validateImageFile,
  validateImageDimensions,
  getImageSize,
  processCompression,
  downloadImage,
  downloadAllAsZip,
  getFormatFromMimeType,
  generateId,
} from "../lib/compressor-utils";

// 기본 압축 옵션
const DEFAULT_OPTIONS: CompressionOptions = {
  mode: "preset",
  preset: "medium",
  targetSizeKB: TARGET_SIZE_LIMITS.defaultKB,
  outputFormat: "original",
};

// 압축 취소 플래그
let cancelFlag = false;

export const useCompressorStore = create<CompressorState>((set, get) => ({
  // 초기 상태
  images: [],
  options: DEFAULT_OPTIONS,
  isCompressing: false,
  currentImageIndex: -1,

  // 이미지 추가
  addImages: async (files: File[]): Promise<AddImagesResult> => {
    const currentImages = get().images;
    const remainingSlots = FILE_LIMITS.maxFiles - currentImages.length;

    if (remainingSlots <= 0) {
      throw new Error("maxFilesReached");
    }

    const filesToProcess = files.slice(0, remainingSlots);
    const newImages: UploadedImage[] = [];
    const failures: ImageAddFailure[] = [];

    for (const file of filesToProcess) {
      try {
        // 파일 유효성 검사
        validateImageFile(file);

        // Data URL로 변환
        const dataUrl = await loadImageAsDataURL(file);

        // 이미지 크기 확인
        const size = await getImageSize(dataUrl);

        // 크기 제한 확인
        validateImageDimensions(size);

        const image: UploadedImage = {
          id: generateId(),
          file,
          name: file.name,
          originalFormat: getFormatFromMimeType(file.type),
          size: file.size,
          dimensions: size,
          dataUrl,
          status: "pending",
          progress: 0,
        };

        newImages.push(image);
      } catch (error) {
        let errorType: ImageAddErrorType = "loadError";
        if (error instanceof Error) {
          if (
            error.message === "fileTooLarge" ||
            error.message === "unsupportedFormat" ||
            error.message === "dimensionTooLarge"
          ) {
            errorType = error.message as ImageAddErrorType;
          }
        }
        failures.push({ fileName: file.name, error: errorType });
        console.error(`Failed to load image: ${file.name}`, error);
      }
    }

    if (newImages.length > 0) {
      set((state) => ({
        images: [...state.images, ...newImages],
      }));
    }

    return {
      successCount: newImages.length,
      failures,
    };
  },

  // 이미지 제거
  removeImage: (id: string) => {
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    }));
  },

  // 모든 이미지 제거
  clearImages: () => {
    set({ images: [] });
  },

  // 옵션 설정
  setOption: <K extends keyof CompressionOptions>(
    key: K,
    value: CompressionOptions[K]
  ) => {
    set((state) => ({
      options: { ...state.options, [key]: value },
      // 옵션 변경 시 완료된 압축 결과 초기화
      images: state.images.map((img) =>
        img.status === "completed"
          ? {
              ...img,
              status: "pending" as const,
              compressedDataUrl: undefined,
              compressedSize: undefined,
              compressedDimensions: undefined,
              actualQuality: undefined,
              targetNotReached: undefined,
            }
          : img
      ),
    }));
  },

  // 옵션 초기화
  resetOptions: () => {
    set({ options: DEFAULT_OPTIONS });
  },

  // 모든 이미지 압축
  compressAll: async () => {
    const state = get();
    if (state.images.length === 0 || state.isCompressing) return;

    cancelFlag = false;
    set({ isCompressing: true });

    const pendingImages = state.images.filter(
      (img) => img.status === "pending" || img.status === "error"
    );

    for (let i = 0; i < pendingImages.length; i++) {
      if (cancelFlag) break;

      const image = pendingImages[i];
      set({ currentImageIndex: i });

      // 상태를 compressing으로 변경
      set((state) => ({
        images: state.images.map((img) =>
          img.id === image.id
            ? { ...img, status: "compressing" as const, progress: 0 }
            : img
        ),
      }));

      try {
        const result = await processCompression(
          image.dataUrl,
          image.dimensions,
          get().options,
          image.file.type
        );

        // 성공 시 상태 업데이트
        set((state) => ({
          images: state.images.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  status: "completed" as const,
                  progress: 100,
                  compressedDataUrl: result.dataUrl,
                  compressedSize: result.size,
                  compressedDimensions: result.dimensions,
                  actualQuality: result.quality,
                  targetNotReached: result.targetNotReached,
                  error: undefined,
                }
              : img
          ),
        }));
      } catch (error) {
        // 실패 시 상태 업데이트
        set((state) => ({
          images: state.images.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  status: "error" as const,
                  progress: 0,
                  error:
                    error instanceof Error
                      ? error.message
                      : "compressionError",
                }
              : img
          ),
        }));
      }
    }

    set({ isCompressing: false, currentImageIndex: -1 });
  },

  // 단일 이미지 압축
  compressSingle: async (id: string) => {
    const state = get();
    const image = state.images.find((img) => img.id === id);
    if (!image || state.isCompressing) return;

    set({ isCompressing: true });

    // 상태를 compressing으로 변경
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? { ...img, status: "compressing" as const, progress: 0 }
          : img
      ),
    }));

    try {
      const result = await processCompression(
        image.dataUrl,
        image.dimensions,
        get().options,
        image.file.type
      );

      // 성공 시 상태 업데이트
      set((state) => ({
        images: state.images.map((img) =>
          img.id === id
            ? {
                ...img,
                status: "completed" as const,
                progress: 100,
                compressedDataUrl: result.dataUrl,
                compressedSize: result.size,
                compressedDimensions: result.dimensions,
                actualQuality: result.quality,
                targetNotReached: result.targetNotReached,
                error: undefined,
              }
            : img
        ),
      }));
    } catch (error) {
      // 실패 시 상태 업데이트
      set((state) => ({
        images: state.images.map((img) =>
          img.id === id
            ? {
                ...img,
                status: "error" as const,
                progress: 0,
                error:
                  error instanceof Error ? error.message : "compressionError",
              }
            : img
        ),
      }));
    }

    set({ isCompressing: false });
  },

  // 압축 취소
  cancelCompression: () => {
    cancelFlag = true;
    set((state) => ({
      isCompressing: false,
      currentImageIndex: -1,
      images: state.images.map((img) =>
        img.status === "compressing"
          ? { ...img, status: "pending" as const, progress: 0 }
          : img
      ),
    }));
  },

  // 단일 이미지 다운로드
  downloadSingle: (id: string) => {
    const state = get();
    const image = state.images.find((img) => img.id === id);
    if (!image || !image.compressedDataUrl) return;

    downloadImage(
      image.compressedDataUrl,
      image.name,
      state.options.outputFormat
    );
  },

  // 모든 이미지 다운로드 (ZIP)
  downloadAll: async () => {
    const state = get();
    const completedImages = state.images.filter(
      (img) => img.status === "completed" && img.compressedDataUrl
    );

    if (completedImages.length === 0) return;

    if (completedImages.length === 1) {
      // 단일 이미지는 직접 다운로드
      const image = completedImages[0];
      downloadImage(
        image.compressedDataUrl!,
        image.name,
        state.options.outputFormat
      );
      return;
    }

    // 여러 이미지는 ZIP으로 다운로드
    await downloadAllAsZip(
      completedImages.map((img) => ({
        name: img.name,
        dataUrl: img.compressedDataUrl!,
        outputFormat: state.options.outputFormat,
      }))
    );
  },

  // 전체 초기화
  reset: () => {
    cancelFlag = true;
    set({
      images: [],
      options: DEFAULT_OPTIONS,
      isCompressing: false,
      currentImageIndex: -1,
    });
  },
}));
