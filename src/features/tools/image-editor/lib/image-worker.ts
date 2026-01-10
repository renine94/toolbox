import type { ImageFilters } from "../model/types";

// Worker 입력 메시지 타입
export type WorkerInput =
  | {
      type: "applyFilters";
      imageData: ImageData;
      filters: ImageFilters;
    }
  | {
      type: "cancel";
    };

// Worker 출력 메시지 타입
export type WorkerOutput =
  | {
      type: "progress";
      percent: number;
    }
  | {
      type: "complete";
      imageData: ImageData;
    }
  | {
      type: "error";
      message: string;
    };

let isCancelled = false;

/**
 * ImageData에 필터 적용 (Worker용)
 */
function applyFiltersToImageData(
  imageData: ImageData,
  filters: ImageFilters,
  onProgress: (percent: number) => void
): ImageData {
  const data = imageData.data;
  const totalPixels = data.length / 4;
  const progressInterval = Math.floor(totalPixels / 10); // 10% 단위로 보고

  for (let i = 0; i < data.length; i += 4) {
    // 취소 확인
    if (isCancelled) {
      throw new Error("cancelled");
    }

    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 밝기 조정
    const brightness = filters.brightness / 100;
    r *= brightness;
    g *= brightness;
    b *= brightness;

    // 대비 조정
    const contrast = (filters.contrast - 100) / 100;
    const factor = (1 + contrast) / (1 - contrast);
    r = factor * (r - 128) + 128;
    g = factor * (g - 128) + 128;
    b = factor * (b - 128) + 128;

    // 채도 조정
    const saturation = filters.saturation / 100;
    const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
    r = gray + saturation * (r - gray);
    g = gray + saturation * (g - gray);
    b = gray + saturation * (b - gray);

    // 세피아
    if (filters.sepia > 0) {
      const sepiaAmount = filters.sepia / 100;
      const sepiaR = r * 0.393 + g * 0.769 + b * 0.189;
      const sepiaG = r * 0.349 + g * 0.686 + b * 0.168;
      const sepiaB = r * 0.272 + g * 0.534 + b * 0.131;
      r = r * (1 - sepiaAmount) + sepiaR * sepiaAmount;
      g = g * (1 - sepiaAmount) + sepiaG * sepiaAmount;
      b = b * (1 - sepiaAmount) + sepiaB * sepiaAmount;
    }

    // 그레이스케일
    if (filters.grayscale > 0) {
      const grayAmount = filters.grayscale / 100;
      const grayValue = 0.2989 * r + 0.587 * g + 0.114 * b;
      r = r * (1 - grayAmount) + grayValue * grayAmount;
      g = g * (1 - grayAmount) + grayValue * grayAmount;
      b = b * (1 - grayAmount) + grayValue * grayAmount;
    }

    // 반전
    if (filters.invert > 0) {
      const invertAmount = filters.invert / 100;
      r = r * (1 - invertAmount) + (255 - r) * invertAmount;
      g = g * (1 - invertAmount) + (255 - g) * invertAmount;
      b = b * (1 - invertAmount) + (255 - b) * invertAmount;
    }

    // 색조 회전 (Hue Rotate)
    if (filters.hueRotate > 0) {
      const angle = (filters.hueRotate * Math.PI) / 180;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const newR =
        r * (0.213 + cos * 0.787 - sin * 0.213) +
        g * (0.715 - cos * 0.715 - sin * 0.715) +
        b * (0.072 - cos * 0.072 + sin * 0.928);
      const newG =
        r * (0.213 - cos * 0.213 + sin * 0.143) +
        g * (0.715 + cos * 0.285 + sin * 0.14) +
        b * (0.072 - cos * 0.072 - sin * 0.283);
      const newB =
        r * (0.213 - cos * 0.213 - sin * 0.787) +
        g * (0.715 - cos * 0.715 + sin * 0.715) +
        b * (0.072 + cos * 0.928 + sin * 0.072);

      r = newR;
      g = newG;
      b = newB;
    }

    // 값 범위 제한
    data[i] = Math.max(0, Math.min(255, Math.round(r)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));

    // 진행률 보고 (10% 단위)
    const pixelIndex = i / 4;
    if (pixelIndex > 0 && pixelIndex % progressInterval === 0) {
      const percent = Math.floor((pixelIndex / totalPixels) * 100);
      onProgress(percent);
    }
  }

  return imageData;
}

// Worker 메시지 핸들러
self.onmessage = (e: MessageEvent<WorkerInput>) => {
  const { type } = e.data;

  if (type === "cancel") {
    isCancelled = true;
    return;
  }

  if (type === "applyFilters") {
    isCancelled = false;
    const { imageData, filters } = e.data;

    try {
      const result = applyFiltersToImageData(imageData, filters, (percent) => {
        self.postMessage({ type: "progress", percent } as WorkerOutput);
      });

      self.postMessage(
        { type: "complete", imageData: result } as WorkerOutput,
        // @ts-expect-error - Transferable objects
        [result.data.buffer]
      );
    } catch (error) {
      if (error instanceof Error && error.message === "cancelled") {
        return;
      }
      self.postMessage({
        type: "error",
        message: error instanceof Error ? error.message : "알 수 없는 오류",
      } as WorkerOutput);
    }
  }
};
