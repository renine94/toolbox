import { MosaicArea, MosaicSettings } from "../model/types";

/**
 * 사각형 영역에 모자이크(pixelation) 적용
 * Canvas drawImage 축소→확대 트릭으로 GPU 가속 활용
 */
function applyPixelation(
  ctx: CanvasRenderingContext2D,
  sourceImg: HTMLImageElement | HTMLCanvasElement,
  region: { x: number; y: number; w: number; h: number },
  pixelSize: number
): void {
  if (region.w <= 0 || region.h <= 0) return;

  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  // 축소 크기 계산
  const smallW = Math.max(1, Math.ceil(region.w / pixelSize));
  const smallH = Math.max(1, Math.ceil(region.h / pixelSize));
  tempCanvas.width = smallW;
  tempCanvas.height = smallH;

  // 원본 영역을 축소하여 그리기 (평균 색상 자동 계산)
  tempCtx.drawImage(
    sourceImg,
    region.x, region.y, region.w, region.h,
    0, 0, smallW, smallH
  );

  // 스무딩 끄고 원래 크기로 확대 → 모자이크 효과
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    tempCanvas,
    0, 0, smallW, smallH,
    region.x, region.y, region.w, region.h
  );
  ctx.imageSmoothingEnabled = true;
}

/**
 * 브러시 모드 모자이크 렌더링
 * 브러시 경로를 따라 clipping 후 pixelated 이미지 그리기
 */
function renderMosaicBrush(
  ctx: CanvasRenderingContext2D,
  sourceImg: HTMLImageElement | HTMLCanvasElement,
  area: MosaicArea,
  canvasWidth: number,
  canvasHeight: number
): void {
  const { points, brushSize, pixelSize } = area;
  if (points.length < 2) return;

  ctx.save();

  // 브러시 경로를 따라 클리핑 영역 생성
  const radius = (brushSize / 100) * Math.min(canvasWidth, canvasHeight) / 2;

  ctx.beginPath();
  for (const point of points) {
    const ax = (point.x / 100) * canvasWidth;
    const ay = (point.y / 100) * canvasHeight;
    ctx.moveTo(ax + radius, ay);
    ctx.arc(ax, ay, radius, 0, Math.PI * 2);
  }
  ctx.clip();

  // 클리핑된 영역에 pixelated 이미지 그리기
  applyPixelation(ctx, sourceImg, { x: 0, y: 0, w: canvasWidth, h: canvasHeight }, pixelSize);

  ctx.restore();
}

/**
 * 사각형 모드 모자이크 렌더링
 */
function renderMosaicRect(
  ctx: CanvasRenderingContext2D,
  sourceImg: HTMLImageElement | HTMLCanvasElement,
  area: MosaicArea,
  canvasWidth: number,
  canvasHeight: number
): void {
  const { startPoint, endPoint, pixelSize } = area;
  if (!startPoint || !endPoint) return;

  const x1 = (startPoint.x / 100) * canvasWidth;
  const y1 = (startPoint.y / 100) * canvasHeight;
  const x2 = (endPoint.x / 100) * canvasWidth;
  const y2 = (endPoint.y / 100) * canvasHeight;

  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1);
  const h = Math.abs(y2 - y1);

  if (w <= 0 || h <= 0) return;

  ctx.save();

  // 사각형 클리핑
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  applyPixelation(ctx, sourceImg, { x, y, w, h }, pixelSize);

  ctx.restore();
}

/**
 * 단일 MosaicArea 렌더링
 */
export function renderMosaicArea(
  ctx: CanvasRenderingContext2D,
  sourceImg: HTMLImageElement | HTMLCanvasElement,
  area: MosaicArea,
  canvasWidth: number,
  canvasHeight: number
): void {
  if (area.mode === "brush") {
    renderMosaicBrush(ctx, sourceImg, area, canvasWidth, canvasHeight);
  } else if (area.mode === "rectangle") {
    renderMosaicRect(ctx, sourceImg, area, canvasWidth, canvasHeight);
  }
}

/**
 * 모든 모자이크 영역을 Canvas에 렌더링
 */
export function renderAllMosaicAreas(
  ctx: CanvasRenderingContext2D,
  sourceImg: HTMLImageElement | HTMLCanvasElement,
  areas: MosaicArea[],
  canvasWidth: number,
  canvasHeight: number
): void {
  areas.forEach((area) => {
    renderMosaicArea(ctx, sourceImg, area, canvasWidth, canvasHeight);
  });
}

/**
 * 화면 좌표를 상대 좌표(%)로 변환
 */
export function screenToMosaicCoords(
  screenX: number,
  screenY: number,
  containerRect: DOMRect,
  displayScale: number,
  imageWidth: number,
  imageHeight: number
): { x: number; y: number } {
  const relativeX = (screenX - containerRect.left) / displayScale;
  const relativeY = (screenY - containerRect.top) / displayScale;

  return {
    x: Math.max(0, Math.min(100, (relativeX / imageWidth) * 100)),
    y: Math.max(0, Math.min(100, (relativeY / imageHeight) * 100)),
  };
}

/**
 * 모자이크 전용 커서 CSS 생성
 */
export function createMosaicCursor(settings: MosaicSettings): string {
  if (settings.mode === "rectangle") {
    return "crosshair";
  }

  // 브러시 모드: 원형 커서
  const size = Math.max(8, Math.min(settings.brushSize, 64));
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size + 4}" height="${size + 4}">
      <rect x="2" y="2" width="${size}" height="${size}" rx="2"
            fill="none" stroke="#666" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.8"/>
      <circle cx="${(size + 4) / 2}" cy="${(size + 4) / 2}" r="1.5" fill="#666"/>
    </svg>
  `.trim();

  const encoded = encodeURIComponent(svg);
  return `url('data:image/svg+xml,${encoded}') ${(size + 4) / 2} ${(size + 4) / 2}, crosshair`;
}
