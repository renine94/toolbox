import { TextLayer } from "../model/types";

/**
 * 텍스트 레이어를 Canvas에 렌더링
 */
export function renderTextToCanvas(
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  canvasWidth: number,
  canvasHeight: number
): void {
  ctx.save();

  // 상대 좌표를 절대 좌표로 변환
  const x = (layer.x / 100) * canvasWidth;
  const y = (layer.y / 100) * canvasHeight;

  // 텍스트 위치로 이동
  ctx.translate(x, y);

  // 회전 적용
  if (layer.rotation !== 0) {
    ctx.rotate((layer.rotation * Math.PI) / 180);
  }

  // 폰트 설정
  const fontStyle = layer.italic ? "italic" : "normal";
  const fontWeight = layer.bold ? "bold" : "normal";
  ctx.font = `${fontStyle} ${fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;

  // 정렬 설정
  ctx.textAlign = layer.alignment;
  ctx.textBaseline = "middle";

  // 색상 및 투명도
  ctx.globalAlpha = layer.opacity;
  ctx.fillStyle = layer.color;

  // 텍스트 그림자 (가독성 향상)
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  // 텍스트 렌더링 (여러 줄 지원)
  const lines = layer.text.split("\n");
  const lineHeight = layer.fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = -totalHeight / 2 + lineHeight / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, 0, startY + index * lineHeight);
  });

  ctx.restore();
}

/**
 * 모든 텍스트 레이어를 Canvas에 렌더링
 */
export function renderAllTextLayers(
  ctx: CanvasRenderingContext2D,
  layers: TextLayer[],
  canvasWidth: number,
  canvasHeight: number
): void {
  layers.forEach((layer) => {
    renderTextToCanvas(ctx, layer, canvasWidth, canvasHeight);
  });
}

/**
 * 텍스트 크기 측정
 */
export function measureText(
  text: string,
  fontSize: number,
  fontFamily: string,
  bold: boolean,
  italic: boolean
): { width: number; height: number } {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 0, height: 0 };

  const fontStyle = italic ? "italic" : "normal";
  const fontWeight = bold ? "bold" : "normal";
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

  const lines = text.split("\n");
  const lineHeight = fontSize * 1.2;
  const maxWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));

  return {
    width: maxWidth,
    height: lines.length * lineHeight,
  };
}

/**
 * 화면 좌표를 상대 좌표(%)로 변환
 */
export function screenToRelativeCoords(
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
 * 상대 좌표(%)를 화면 좌표로 변환
 */
export function relativeToScreenCoords(
  relativeX: number,
  relativeY: number,
  displayScale: number,
  imageWidth: number,
  imageHeight: number
): { x: number; y: number } {
  return {
    x: (relativeX / 100) * imageWidth * displayScale,
    y: (relativeY / 100) * imageHeight * displayScale,
  };
}
