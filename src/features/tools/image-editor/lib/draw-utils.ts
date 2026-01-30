import { DrawPath, BrushSettings } from "../model/types";

/**
 * 브러시 경로를 Canvas에 렌더링
 */
export function renderDrawPath(
  ctx: CanvasRenderingContext2D,
  path: DrawPath,
  canvasWidth: number,
  canvasHeight: number
): void {
  const { points, settings, mode, startPoint, endPoint } = path;

  ctx.save();

  // 기본 스타일 설정
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = settings.size;
  ctx.strokeStyle = settings.color;
  ctx.globalAlpha = settings.opacity;

  // 지우개 모드
  if (mode === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
  }

  // 도형 그리기
  if (mode === "line" && startPoint && endPoint) {
    drawLine(ctx, startPoint, endPoint, canvasWidth, canvasHeight);
  } else if (mode === "rectangle" && startPoint && endPoint) {
    drawRectangle(ctx, startPoint, endPoint, canvasWidth, canvasHeight);
  } else if (mode === "circle" && startPoint && endPoint) {
    drawCircle(ctx, startPoint, endPoint, canvasWidth, canvasHeight);
  } else if ((mode === "brush" || mode === "eraser") && points.length > 0) {
    // 자유 그리기
    drawBrushPath(ctx, points, canvasWidth, canvasHeight);
  }

  ctx.restore();
}

/**
 * 자유 그리기 경로 렌더링 (부드러운 곡선)
 */
function drawBrushPath(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  canvasWidth: number,
  canvasHeight: number
): void {
  if (points.length < 2) return;

  // 상대 좌표를 절대 좌표로 변환
  const absolutePoints = points.map((p) => ({
    x: (p.x / 100) * canvasWidth,
    y: (p.y / 100) * canvasHeight,
  }));

  ctx.beginPath();
  ctx.moveTo(absolutePoints[0].x, absolutePoints[0].y);

  if (absolutePoints.length === 2) {
    // 두 점만 있으면 직선
    ctx.lineTo(absolutePoints[1].x, absolutePoints[1].y);
  } else {
    // Bezier 곡선으로 부드럽게
    for (let i = 1; i < absolutePoints.length - 1; i++) {
      const xc = (absolutePoints[i].x + absolutePoints[i + 1].x) / 2;
      const yc = (absolutePoints[i].y + absolutePoints[i + 1].y) / 2;
      ctx.quadraticCurveTo(absolutePoints[i].x, absolutePoints[i].y, xc, yc);
    }
    // 마지막 점까지 연결
    const lastPoint = absolutePoints[absolutePoints.length - 1];
    const secondLastPoint = absolutePoints[absolutePoints.length - 2];
    ctx.quadraticCurveTo(secondLastPoint.x, secondLastPoint.y, lastPoint.x, lastPoint.y);
  }

  ctx.stroke();
}

/**
 * 직선 그리기
 */
function drawLine(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  end: { x: number; y: number },
  canvasWidth: number,
  canvasHeight: number
): void {
  const x1 = (start.x / 100) * canvasWidth;
  const y1 = (start.y / 100) * canvasHeight;
  const x2 = (end.x / 100) * canvasWidth;
  const y2 = (end.y / 100) * canvasHeight;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/**
 * 사각형 그리기
 */
function drawRectangle(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  end: { x: number; y: number },
  canvasWidth: number,
  canvasHeight: number
): void {
  const x1 = (start.x / 100) * canvasWidth;
  const y1 = (start.y / 100) * canvasHeight;
  const x2 = (end.x / 100) * canvasWidth;
  const y2 = (end.y / 100) * canvasHeight;

  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.stroke();
}

/**
 * 원 그리기
 */
function drawCircle(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  end: { x: number; y: number },
  canvasWidth: number,
  canvasHeight: number
): void {
  const x1 = (start.x / 100) * canvasWidth;
  const y1 = (start.y / 100) * canvasHeight;
  const x2 = (end.x / 100) * canvasWidth;
  const y2 = (end.y / 100) * canvasHeight;

  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const radiusX = Math.abs(x2 - x1) / 2;
  const radiusY = Math.abs(y2 - y1) / 2;

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * 모든 그리기 경로를 Canvas에 렌더링
 */
export function renderAllDrawPaths(
  ctx: CanvasRenderingContext2D,
  paths: DrawPath[],
  canvasWidth: number,
  canvasHeight: number
): void {
  paths.forEach((path) => {
    renderDrawPath(ctx, path, canvasWidth, canvasHeight);
  });
}

/**
 * 화면 좌표를 상대 좌표(%)로 변환
 */
export function screenToDrawCoords(
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
 * 브러시 커서 CSS 생성
 */
export function createBrushCursor(settings: BrushSettings): string {
  const size = Math.max(4, settings.size);
  const color = settings.mode === "eraser" ? "#888888" : settings.color;

  // SVG 원형 커서 생성
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size + 4}" height="${size + 4}">
      <circle cx="${(size + 4) / 2}" cy="${(size + 4) / 2}" r="${size / 2}"
              fill="none" stroke="${color}" stroke-width="1" opacity="0.8"/>
      <circle cx="${(size + 4) / 2}" cy="${(size + 4) / 2}" r="1" fill="${color}"/>
    </svg>
  `.trim();

  const encoded = encodeURIComponent(svg);
  return `url('data:image/svg+xml,${encoded}') ${(size + 4) / 2} ${(size + 4) / 2}, crosshair`;
}
