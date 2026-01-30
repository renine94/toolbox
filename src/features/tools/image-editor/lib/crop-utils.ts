import { CropArea, AspectRatioPreset } from "../model/types";

/**
 * 종횡비 프리셋을 숫자 비율로 변환
 */
export function getAspectRatioValue(preset: AspectRatioPreset): number | null {
  switch (preset) {
    case "free":
      return null;
    case "1:1":
      return 1;
    case "4:3":
      return 4 / 3;
    case "3:2":
      return 3 / 2;
    case "16:9":
      return 16 / 9;
    case "9:16":
      return 9 / 16;
    default:
      return null;
  }
}

/**
 * 화면 좌표를 원본 이미지 좌표로 변환
 */
export function screenToImageCoords(
  screenX: number,
  screenY: number,
  canvasRect: DOMRect,
  imageWidth: number,
  imageHeight: number,
  displayScale: number
): { x: number; y: number } {
  const relativeX = (screenX - canvasRect.left) / displayScale;
  const relativeY = (screenY - canvasRect.top) / displayScale;

  return {
    x: Math.max(0, Math.min(imageWidth, relativeX)),
    y: Math.max(0, Math.min(imageHeight, relativeY)),
  };
}

/**
 * 원본 이미지 좌표를 화면 좌표로 변환
 */
export function imageToScreenCoords(
  imageX: number,
  imageY: number,
  canvasRect: DOMRect,
  displayScale: number
): { x: number; y: number } {
  return {
    x: canvasRect.left + imageX * displayScale,
    y: canvasRect.top + imageY * displayScale,
  };
}

/**
 * 크롭 영역을 종횡비에 맞게 조정
 */
export function constrainCropAreaToAspectRatio(
  area: CropArea,
  aspectRatio: number | null,
  imageWidth: number,
  imageHeight: number,
  resizeHandle: string
): CropArea {
  if (!aspectRatio) {
    return area;
  }

  let { x, y, width, height } = area;

  // 리사이즈 핸들에 따라 조정할 축 결정
  const isHorizontalHandle = resizeHandle.includes("e") || resizeHandle.includes("w");
  const isVerticalHandle = resizeHandle.includes("n") || resizeHandle.includes("s");

  if (isHorizontalHandle && !isVerticalHandle) {
    // 가로 조정 → 세로를 비율에 맞춤
    height = width / aspectRatio;
  } else if (isVerticalHandle && !isHorizontalHandle) {
    // 세로 조정 → 가로를 비율에 맞춤
    width = height * aspectRatio;
  } else {
    // 대각선 핸들 → 더 큰 변경에 맞춤
    const newHeight = width / aspectRatio;
    if (newHeight <= imageHeight) {
      height = newHeight;
    } else {
      height = imageHeight;
      width = height * aspectRatio;
    }
  }

  // 이미지 경계를 벗어나지 않도록 조정
  if (x + width > imageWidth) {
    width = imageWidth - x;
    height = width / aspectRatio;
  }
  if (y + height > imageHeight) {
    height = imageHeight - y;
    width = height * aspectRatio;
  }

  return { x, y, width, height };
}

/**
 * 크롭 영역이 이미지 경계 내에 있도록 보정
 */
export function clampCropArea(
  area: CropArea,
  imageWidth: number,
  imageHeight: number,
  minSize: number = 20
): CropArea {
  let { x, y, width, height } = area;

  // 최소 크기 보장
  width = Math.max(minSize, width);
  height = Math.max(minSize, height);

  // 이미지 경계 내로 제한
  width = Math.min(width, imageWidth);
  height = Math.min(height, imageHeight);

  x = Math.max(0, Math.min(x, imageWidth - width));
  y = Math.max(0, Math.min(y, imageHeight - height));

  return { x, y, width, height };
}

/**
 * 기본 크롭 영역 생성 (이미지 중앙, 80% 크기)
 */
export function createDefaultCropArea(
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number | null = null
): CropArea {
  let width = imageWidth * 0.8;
  let height = imageHeight * 0.8;

  if (aspectRatio) {
    // 종횡비에 맞춤
    const currentRatio = width / height;
    if (currentRatio > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }
  }

  return {
    x: (imageWidth - width) / 2,
    y: (imageHeight - height) / 2,
    width,
    height,
  };
}

/**
 * 리사이즈 핸들의 커서 스타일 결정
 */
export function getResizeCursor(handle: string): string {
  switch (handle) {
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    case "nw":
    case "se":
      return "nwse-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    default:
      return "move";
  }
}

/**
 * 마우스 위치가 어느 리사이즈 핸들 위에 있는지 확인
 */
export function getHandleAtPosition(
  mouseX: number,
  mouseY: number,
  cropArea: CropArea,
  handleSize: number = 10
): string | null {
  const { x, y, width, height } = cropArea;
  const halfHandle = handleSize / 2;

  // 모서리 핸들 확인
  const corners = [
    { name: "nw", cx: x, cy: y },
    { name: "ne", cx: x + width, cy: y },
    { name: "sw", cx: x, cy: y + height },
    { name: "se", cx: x + width, cy: y + height },
  ];

  for (const corner of corners) {
    if (
      mouseX >= corner.cx - halfHandle &&
      mouseX <= corner.cx + halfHandle &&
      mouseY >= corner.cy - halfHandle &&
      mouseY <= corner.cy + halfHandle
    ) {
      return corner.name;
    }
  }

  // 변 핸들 확인
  const edges = [
    { name: "n", x1: x + halfHandle, x2: x + width - halfHandle, y1: y - halfHandle, y2: y + halfHandle },
    { name: "s", x1: x + halfHandle, x2: x + width - halfHandle, y1: y + height - halfHandle, y2: y + height + halfHandle },
    { name: "w", x1: x - halfHandle, x2: x + halfHandle, y1: y + halfHandle, y2: y + height - halfHandle },
    { name: "e", x1: x + width - halfHandle, x2: x + width + halfHandle, y1: y + halfHandle, y2: y + height - halfHandle },
  ];

  for (const edge of edges) {
    if (
      mouseX >= edge.x1 &&
      mouseX <= edge.x2 &&
      mouseY >= edge.y1 &&
      mouseY <= edge.y2
    ) {
      return edge.name;
    }
  }

  // 크롭 영역 내부인지 확인
  if (
    mouseX >= x &&
    mouseX <= x + width &&
    mouseY >= y &&
    mouseY <= y + height
  ) {
    return "move";
  }

  return null;
}
