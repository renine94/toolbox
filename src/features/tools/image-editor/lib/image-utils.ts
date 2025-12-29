import { ImageFilters, ImageTransform } from "../model/types";

/**
 * File을 Data URL로 변환
 */
export async function loadImageAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("파일을 읽을 수 없습니다."));
      }
    };
    reader.onerror = () => reject(new Error("파일 읽기에 실패했습니다."));
    reader.readAsDataURL(file);
  });
}

/**
 * CSS 필터 문자열 생성
 */
export function getFilterString(filters: ImageFilters): string {
  const parts: string[] = [];

  if (filters.brightness !== 100) {
    parts.push(`brightness(${filters.brightness}%)`);
  }
  if (filters.contrast !== 100) {
    parts.push(`contrast(${filters.contrast}%)`);
  }
  if (filters.saturation !== 100) {
    parts.push(`saturate(${filters.saturation}%)`);
  }
  if (filters.blur > 0) {
    parts.push(`blur(${filters.blur}px)`);
  }
  if (filters.grayscale > 0) {
    parts.push(`grayscale(${filters.grayscale}%)`);
  }
  if (filters.sepia > 0) {
    parts.push(`sepia(${filters.sepia}%)`);
  }
  if (filters.hueRotate > 0) {
    parts.push(`hue-rotate(${filters.hueRotate}deg)`);
  }
  if (filters.invert > 0) {
    parts.push(`invert(${filters.invert}%)`);
  }

  return parts.length > 0 ? parts.join(" ") : "none";
}

/**
 * CSS transform 문자열 생성
 */
export function getTransformString(transform: ImageTransform): string {
  const parts: string[] = [];

  if (transform.rotate !== 0) {
    parts.push(`rotate(${transform.rotate}deg)`);
  }
  if (transform.flipHorizontal) {
    parts.push("scaleX(-1)");
  }
  if (transform.flipVertical) {
    parts.push("scaleY(-1)");
  }
  if (transform.scale !== 1) {
    parts.push(`scale(${transform.scale})`);
  }

  return parts.length > 0 ? parts.join(" ") : "none";
}

/**
 * 캔버스에 변환 적용
 */
export function applyTransformToCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  transform: ImageTransform,
  targetWidth: number,
  targetHeight: number
): void {
  // 회전 각도에 따른 캔버스 크기 조정
  const radians = (transform.rotate * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  const rotatedWidth = targetWidth * cos + targetHeight * sin;
  const rotatedHeight = targetWidth * sin + targetHeight * cos;

  canvas.width = Math.round(rotatedWidth);
  canvas.height = Math.round(rotatedHeight);

  // 중심으로 이동 후 변환 적용
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);

  // 뒤집기 적용
  const scaleX = transform.flipHorizontal ? -1 : 1;
  const scaleY = transform.flipVertical ? -1 : 1;
  ctx.scale(scaleX * transform.scale, scaleY * transform.scale);

  // 이미지 그리기
  ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
  ctx.restore();
}

/**
 * 캔버스에 필터 적용
 */
export function applyFiltersToCanvas(
  ctx: CanvasRenderingContext2D,
  filters: ImageFilters,
  width: number,
  height: number
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
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

      const newR = r * (0.213 + cos * 0.787 - sin * 0.213) +
                   g * (0.715 - cos * 0.715 - sin * 0.715) +
                   b * (0.072 - cos * 0.072 + sin * 0.928);
      const newG = r * (0.213 - cos * 0.213 + sin * 0.143) +
                   g * (0.715 + cos * 0.285 + sin * 0.14) +
                   b * (0.072 - cos * 0.072 - sin * 0.283);
      const newB = r * (0.213 - cos * 0.213 - sin * 0.787) +
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
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Data URL을 Blob으로 변환
 */
export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * 이미지 다운로드
 */
export function downloadImage(dataURL: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 종횡비 유지하며 새 크기 계산
 */
export function calculateAspectRatioSize(
  originalWidth: number,
  originalHeight: number,
  newWidth?: number,
  newHeight?: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  if (newWidth && !newHeight) {
    return {
      width: newWidth,
      height: Math.round(newWidth / aspectRatio),
    };
  }

  if (newHeight && !newWidth) {
    return {
      width: Math.round(newHeight * aspectRatio),
      height: newHeight,
    };
  }

  if (newWidth && newHeight) {
    return { width: newWidth, height: newHeight };
  }

  return { width: originalWidth, height: originalHeight };
}
