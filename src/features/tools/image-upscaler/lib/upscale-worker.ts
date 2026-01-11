/**
 * Image Upscaler Web Worker
 * Lanczos3, Bicubic, Bilinear 보간 알고리즘 구현
 */

import type {
  WorkerInput,
  WorkerOutput,
  AlgorithmOption,
} from "../model/types";

let isCancelled = false;

/**
 * Lanczos 커널 함수
 * x = 0에서 1, |x| >= a에서 0
 */
function lanczos(x: number, a: number): number {
  if (x === 0) return 1;
  if (Math.abs(x) >= a) return 0;
  const piX = Math.PI * x;
  return (a * Math.sin(piX) * Math.sin(piX / a)) / (piX * piX);
}

/**
 * Bicubic 커널 함수
 * Mitchell-Netravali 필터 (B=1/3, C=1/3)
 */
function bicubic(x: number): number {
  const absX = Math.abs(x);
  if (absX >= 2) return 0;

  const B = 1 / 3;
  const C = 1 / 3;

  if (absX < 1) {
    return (
      ((12 - 9 * B - 6 * C) * absX * absX * absX +
        (-18 + 12 * B + 6 * C) * absX * absX +
        (6 - 2 * B)) /
      6
    );
  } else {
    return (
      ((-B - 6 * C) * absX * absX * absX +
        (6 * B + 30 * C) * absX * absX +
        (-12 * B - 48 * C) * absX +
        (8 * B + 24 * C)) /
      6
    );
  }
}

/**
 * Bilinear 보간
 */
function bilinear(x: number): number {
  const absX = Math.abs(x);
  if (absX >= 1) return 0;
  return 1 - absX;
}

/**
 * 클램프 함수
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * 이미지 업스케일 처리
 */
function upscaleImage(
  srcData: Uint8ClampedArray,
  srcWidth: number,
  srcHeight: number,
  scale: number,
  algorithm: AlgorithmOption,
  onProgress: (percent: number) => void
): ImageData | null {
  const dstWidth = Math.floor(srcWidth * scale);
  const dstHeight = Math.floor(srcHeight * scale);
  const dstData = new Uint8ClampedArray(dstWidth * dstHeight * 4);

  // 알고리즘별 커널 함수 및 반경 설정
  let kernelFunc: (x: number, a?: number) => number;
  let radius: number;

  switch (algorithm) {
    case "lanczos3":
      kernelFunc = (x: number) => lanczos(x, 3);
      radius = 3;
      break;
    case "bicubic":
      kernelFunc = bicubic;
      radius = 2;
      break;
    case "bilinear":
    default:
      kernelFunc = bilinear;
      radius = 1;
      break;
  }

  let lastProgress = 0;

  for (let dstY = 0; dstY < dstHeight; dstY++) {
    if (isCancelled) {
      return null;
    }

    for (let dstX = 0; dstX < dstWidth; dstX++) {
      // 원본 이미지에서의 위치 계산
      const srcX = (dstX + 0.5) / scale - 0.5;
      const srcY = (dstY + 0.5) / scale - 0.5;

      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      let totalWeight = 0;

      // 커널 범위 내의 픽셀들을 샘플링
      const minKY = Math.floor(srcY) - radius + 1;
      const maxKY = Math.floor(srcY) + radius;
      const minKX = Math.floor(srcX) - radius + 1;
      const maxKX = Math.floor(srcX) + radius;

      for (let ky = minKY; ky <= maxKY; ky++) {
        for (let kx = minKX; kx <= maxKX; kx++) {
          // 경계 처리 (클램프)
          const sampleX = clamp(kx, 0, srcWidth - 1);
          const sampleY = clamp(ky, 0, srcHeight - 1);

          // 가중치 계산
          const weightX = kernelFunc(srcX - kx);
          const weightY = kernelFunc(srcY - ky);
          const weight = weightX * weightY;

          if (weight !== 0) {
            const srcIdx = (sampleY * srcWidth + sampleX) * 4;

            r += srcData[srcIdx] * weight;
            g += srcData[srcIdx + 1] * weight;
            b += srcData[srcIdx + 2] * weight;
            a += srcData[srcIdx + 3] * weight;
            totalWeight += weight;
          }
        }
      }

      // 정규화 및 결과 저장
      const dstIdx = (dstY * dstWidth + dstX) * 4;
      if (totalWeight > 0) {
        dstData[dstIdx] = clamp(Math.round(r / totalWeight), 0, 255);
        dstData[dstIdx + 1] = clamp(Math.round(g / totalWeight), 0, 255);
        dstData[dstIdx + 2] = clamp(Math.round(b / totalWeight), 0, 255);
        dstData[dstIdx + 3] = clamp(Math.round(a / totalWeight), 0, 255);
      }
    }

    // 진행률 보고 (5% 단위)
    const currentProgress = Math.floor((dstY / dstHeight) * 100);
    if (currentProgress >= lastProgress + 5) {
      lastProgress = currentProgress;
      onProgress(currentProgress);
    }
  }

  return new ImageData(dstData, dstWidth, dstHeight);
}

/**
 * Worker 메시지 핸들러
 */
self.onmessage = (e: MessageEvent<WorkerInput>) => {
  const { type, imageData, scale, algorithm } = e.data;

  if (type === "cancel") {
    isCancelled = true;
    return;
  }

  if (type === "upscale" && imageData && scale && algorithm) {
    isCancelled = false;

    try {
      const result = upscaleImage(
        imageData.data,
        imageData.width,
        imageData.height,
        scale,
        algorithm,
        (percent) => {
          self.postMessage({ type: "progress", percent } as WorkerOutput);
        }
      );

      if (result && !isCancelled) {
        self.postMessage(
          { type: "complete", imageData: result } as WorkerOutput,
          // @ts-expect-error - Transferable를 위한 배열
          [result.data.buffer]
        );
      } else if (isCancelled) {
        self.postMessage({
          type: "error",
          message: "cancelled",
        } as WorkerOutput);
      }
    } catch (error) {
      self.postMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      } as WorkerOutput);
    }
  }
};
