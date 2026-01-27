import { create } from "zustand";
import type {
  ResizerState,
  UploadedImage,
  ResizedImage,
  PresetId,
  Platform,
  AddImageResult,
} from "./types";
import { PLATFORM_PRESETS } from "./types";
import {
  generateId,
  validateImageFile,
  loadImageAsDataURL,
  getImageSize,
  validateImageDimensions,
  resizeImage,
  downloadImage,
  downloadAllAsZip,
  getErrorType,
} from "../lib/resize-utils";
import { getPresetById, getPlatformPresetIds, getAllPresetIds } from "../lib/platform-presets";

// 리사이즈 취소 플래그
let cancelFlag = false;

export const useResizerStore = create<ResizerState>((set, get) => ({
  // 초기 상태
  originalImage: null,
  selectedPresets: new Set<PresetId>(),
  resizedImages: new Map<PresetId, ResizedImage>(),
  isResizing: false,
  currentPresetIndex: -1,
  totalPresets: 0,

  // 이미지 설정
  setImage: async (file: File): Promise<AddImageResult> => {
    try {
      // 파일 유효성 검사
      validateImageFile(file);

      // Data URL로 변환
      const dataUrl = await loadImageAsDataURL(file);

      // 이미지 크기 확인
      const dimensions = await getImageSize(dataUrl);

      // 크기 제한 확인
      validateImageDimensions(dimensions);

      const image: UploadedImage = {
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        dimensions,
        dataUrl,
      };

      set({
        originalImage: image,
        resizedImages: new Map(),
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        failure: {
          fileName: file.name,
          error: getErrorType(error),
        },
      };
    }
  },

  // 이미지 제거
  clearImage: () => {
    set({
      originalImage: null,
      resizedImages: new Map(),
    });
  },

  // 프리셋 토글
  togglePreset: (presetId: PresetId) => {
    set((state) => {
      const newSelected = new Set(state.selectedPresets);
      if (newSelected.has(presetId)) {
        newSelected.delete(presetId);
      } else {
        newSelected.add(presetId);
      }

      // 프리셋 선택이 변경되면 해당 리사이즈 결과 초기화
      const newResizedImages = new Map(state.resizedImages);
      if (!newSelected.has(presetId)) {
        newResizedImages.delete(presetId);
      }

      return {
        selectedPresets: newSelected,
        resizedImages: newResizedImages,
      };
    });
  },

  // 모든 프리셋 선택
  selectAllPresets: () => {
    set({
      selectedPresets: new Set(getAllPresetIds()),
    });
  },

  // 모든 프리셋 해제
  deselectAllPresets: () => {
    set({
      selectedPresets: new Set(),
      resizedImages: new Map(),
    });
  },

  // 특정 플랫폼 프리셋 선택
  selectPlatformPresets: (platform: Platform) => {
    set((state) => {
      const platformPresetIds = getPlatformPresetIds(platform);
      const newSelected = new Set(state.selectedPresets);

      // 해당 플랫폼의 모든 프리셋이 선택되어 있으면 해제, 아니면 선택
      const allSelected = platformPresetIds.every((id) => newSelected.has(id));

      if (allSelected) {
        platformPresetIds.forEach((id) => newSelected.delete(id));
      } else {
        platformPresetIds.forEach((id) => newSelected.add(id));
      }

      return { selectedPresets: newSelected };
    });
  },

  // 모든 선택된 프리셋 리사이즈
  resizeAll: async () => {
    const state = get();
    if (!state.originalImage || state.selectedPresets.size === 0 || state.isResizing) {
      return;
    }

    cancelFlag = false;
    const selectedPresetIds = Array.from(state.selectedPresets);

    set({
      isResizing: true,
      totalPresets: selectedPresetIds.length,
      currentPresetIndex: 0,
    });

    for (let i = 0; i < selectedPresetIds.length; i++) {
      if (cancelFlag) break;

      const presetId = selectedPresetIds[i];
      const preset = getPresetById(presetId);
      const currentImage = get().originalImage;

      if (!preset || !currentImage) continue;

      set({ currentPresetIndex: i });

      // 리사이즈 중 상태로 변경
      set((state) => {
        const newResizedImages = new Map(state.resizedImages);
        newResizedImages.set(presetId, {
          presetId,
          dataUrl: "",
          width: preset.width,
          height: preset.height,
          size: 0,
          status: "resizing",
        });
        return { resizedImages: newResizedImages };
      });

      try {
        const result = await resizeImage(
          currentImage.dataUrl,
          preset,
          currentImage.dimensions
        );

        // 성공 시 상태 업데이트
        set((state) => {
          const newResizedImages = new Map(state.resizedImages);
          newResizedImages.set(presetId, {
            presetId,
            dataUrl: result.dataUrl,
            width: result.width,
            height: result.height,
            size: result.size,
            status: "completed",
          });
          return { resizedImages: newResizedImages };
        });
      } catch (error) {
        // 실패 시 상태 업데이트
        set((state) => {
          const newResizedImages = new Map(state.resizedImages);
          newResizedImages.set(presetId, {
            presetId,
            dataUrl: "",
            width: preset.width,
            height: preset.height,
            size: 0,
            status: "error",
            error: error instanceof Error ? error.message : "resizeError",
          });
          return { resizedImages: newResizedImages };
        });
      }
    }

    set({
      isResizing: false,
      currentPresetIndex: -1,
    });
  },

  // 리사이즈 취소
  cancelResize: () => {
    cancelFlag = true;
    set((state) => {
      const newResizedImages = new Map(state.resizedImages);
      // 리사이징 중인 항목을 pending으로 변경
      newResizedImages.forEach((value, key) => {
        if (value.status === "resizing") {
          newResizedImages.delete(key);
        }
      });

      return {
        isResizing: false,
        currentPresetIndex: -1,
        resizedImages: newResizedImages,
      };
    });
  },

  // 단일 이미지 다운로드
  downloadSingle: (presetId: PresetId) => {
    const state = get();
    const resized = state.resizedImages.get(presetId);
    const preset = getPresetById(presetId);

    if (!resized || !preset || !state.originalImage || resized.status !== "completed") {
      return;
    }

    downloadImage(resized.dataUrl, state.originalImage.name, preset);
  },

  // 모든 이미지 다운로드 (ZIP)
  downloadAll: async () => {
    const state = get();
    if (!state.originalImage) return;

    const completedImages: Array<{
      dataUrl: string;
      originalName: string;
      preset: (typeof PLATFORM_PRESETS)[number];
    }> = [];

    state.resizedImages.forEach((resized, presetId) => {
      if (resized.status === "completed") {
        const preset = getPresetById(presetId);
        if (preset) {
          completedImages.push({
            dataUrl: resized.dataUrl,
            originalName: state.originalImage!.name,
            preset,
          });
        }
      }
    });

    if (completedImages.length === 0) return;

    if (completedImages.length === 1) {
      // 단일 이미지는 직접 다운로드
      const { dataUrl, originalName, preset } = completedImages[0];
      downloadImage(dataUrl, originalName, preset);
      return;
    }

    // 여러 이미지는 ZIP으로 다운로드
    await downloadAllAsZip(completedImages);
  },

  // 전체 초기화
  reset: () => {
    cancelFlag = true;
    set({
      originalImage: null,
      selectedPresets: new Set(),
      resizedImages: new Map(),
      isResizing: false,
      currentPresetIndex: -1,
      totalPresets: 0,
    });
  },
}));
