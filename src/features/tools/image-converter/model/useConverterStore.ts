import { create } from "zustand";
import type {
  ConverterState,
  ConversionOptions,
  ResizeOptions,
  UploadedImage,
} from "./types";
import { FILE_LIMITS } from "./types";
import {
  loadImageAsDataURL,
  validateImageFile,
  validateImageDimensions,
  getImageSize,
  convertImage,
  downloadImage,
  downloadAllAsZip,
  getFormatFromMimeType,
  generateId,
} from "../lib/converter-utils";

// 기본 변환 옵션
const DEFAULT_OPTIONS: ConversionOptions = {
  outputFormat: "png",
  quality: 92,
  backgroundColor: "#ffffff",
  preserveTransparency: true,
  resize: {
    mode: "none",
    percentage: 100,
    maintainAspectRatio: true,
  },
};

// 변환 취소 플래그
let cancelFlag = false;

export const useConverterStore = create<ConverterState>((set, get) => ({
  // 초기 상태
  images: [],
  options: DEFAULT_OPTIONS,
  isConverting: false,
  currentImageIndex: -1,

  // 이미지 추가
  addImages: async (files: File[]) => {
    const currentImages = get().images;
    const remainingSlots = FILE_LIMITS.maxFiles - currentImages.length;

    if (remainingSlots <= 0) {
      throw new Error("maxFilesReached");
    }

    const filesToProcess = files.slice(0, remainingSlots);
    const newImages: UploadedImage[] = [];

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
        console.error(`Failed to load image: ${file.name}`, error);
        // 개별 파일 실패는 건너뜀
      }
    }

    if (newImages.length > 0) {
      set((state) => ({
        images: [...state.images, ...newImages],
      }));
    }
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
  setOption: <K extends keyof ConversionOptions>(
    key: K,
    value: ConversionOptions[K]
  ) => {
    set((state) => ({
      options: { ...state.options, [key]: value },
      // 옵션 변경 시 완료된 변환 결과 초기화
      images: state.images.map((img) =>
        img.status === "completed"
          ? {
              ...img,
              status: "pending" as const,
              convertedDataUrl: undefined,
              convertedSize: undefined,
              convertedDimensions: undefined,
            }
          : img
      ),
    }));
  },

  // 리사이즈 옵션 설정
  setResizeOption: <K extends keyof ResizeOptions>(
    key: K,
    value: ResizeOptions[K]
  ) => {
    set((state) => ({
      options: {
        ...state.options,
        resize: { ...state.options.resize, [key]: value },
      },
      // 옵션 변경 시 완료된 변환 결과 초기화
      images: state.images.map((img) =>
        img.status === "completed"
          ? {
              ...img,
              status: "pending" as const,
              convertedDataUrl: undefined,
              convertedSize: undefined,
              convertedDimensions: undefined,
            }
          : img
      ),
    }));
  },

  // 옵션 초기화
  resetOptions: () => {
    set({ options: DEFAULT_OPTIONS });
  },

  // 모든 이미지 변환
  convertAll: async () => {
    const state = get();
    if (state.images.length === 0 || state.isConverting) return;

    cancelFlag = false;
    set({ isConverting: true });

    const pendingImages = state.images.filter(
      (img) => img.status === "pending" || img.status === "error"
    );

    for (let i = 0; i < pendingImages.length; i++) {
      if (cancelFlag) break;

      const image = pendingImages[i];
      set({ currentImageIndex: i });

      // 상태를 converting으로 변경
      set((state) => ({
        images: state.images.map((img) =>
          img.id === image.id
            ? { ...img, status: "converting" as const, progress: 0 }
            : img
        ),
      }));

      try {
        const result = await convertImage(
          image.dataUrl,
          image.dimensions,
          get().options
        );

        // 성공 시 상태 업데이트
        set((state) => ({
          images: state.images.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  status: "completed" as const,
                  progress: 100,
                  convertedDataUrl: result.dataUrl,
                  convertedSize: result.size,
                  convertedDimensions: result.dimensions,
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
                      : "conversionError",
                }
              : img
          ),
        }));
      }
    }

    set({ isConverting: false, currentImageIndex: -1 });
  },

  // 단일 이미지 변환
  convertSingle: async (id: string) => {
    const state = get();
    const image = state.images.find((img) => img.id === id);
    if (!image || state.isConverting) return;

    set({ isConverting: true });

    // 상태를 converting으로 변경
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? { ...img, status: "converting" as const, progress: 0 }
          : img
      ),
    }));

    try {
      const result = await convertImage(
        image.dataUrl,
        image.dimensions,
        get().options
      );

      // 성공 시 상태 업데이트
      set((state) => ({
        images: state.images.map((img) =>
          img.id === id
            ? {
                ...img,
                status: "completed" as const,
                progress: 100,
                convertedDataUrl: result.dataUrl,
                convertedSize: result.size,
                convertedDimensions: result.dimensions,
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
                  error instanceof Error ? error.message : "conversionError",
              }
            : img
        ),
      }));
    }

    set({ isConverting: false });
  },

  // 변환 취소
  cancelConversion: () => {
    cancelFlag = true;
    set((state) => ({
      isConverting: false,
      currentImageIndex: -1,
      images: state.images.map((img) =>
        img.status === "converting"
          ? { ...img, status: "pending" as const, progress: 0 }
          : img
      ),
    }));
  },

  // 단일 이미지 다운로드
  downloadSingle: (id: string) => {
    const state = get();
    const image = state.images.find((img) => img.id === id);
    if (!image || !image.convertedDataUrl) return;

    downloadImage(image.convertedDataUrl, image.name, state.options.outputFormat);
  },

  // 모든 이미지 다운로드 (ZIP)
  downloadAll: async () => {
    const state = get();
    const completedImages = state.images.filter(
      (img) => img.status === "completed" && img.convertedDataUrl
    );

    if (completedImages.length === 0) return;

    if (completedImages.length === 1) {
      // 단일 이미지는 직접 다운로드
      const image = completedImages[0];
      downloadImage(
        image.convertedDataUrl!,
        image.name,
        state.options.outputFormat
      );
      return;
    }

    // 여러 이미지는 ZIP으로 다운로드
    await downloadAllAsZip(
      completedImages.map((img) => ({
        name: img.name,
        dataUrl: img.convertedDataUrl!,
        format: state.options.outputFormat,
      }))
    );
  },

  // 전체 초기화
  reset: () => {
    cancelFlag = true;
    set({
      images: [],
      options: DEFAULT_OPTIONS,
      isConverting: false,
      currentImageIndex: -1,
    });
  },
}));
