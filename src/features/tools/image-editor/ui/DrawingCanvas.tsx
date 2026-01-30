"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useImageStore } from "../model/useImageStore";
import {
  renderAllDrawPaths,
  screenToDrawCoords,
  createBrushCursor,
} from "../lib/draw-utils";

interface DrawingCanvasProps {
  displayScale: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function DrawingCanvas({ displayScale, containerRef }: DrawingCanvasProps) {
  const {
    drawPaths,
    brushSettings,
    isDrawing,
    startDrawing,
    addDrawPoint,
    endDrawing,
    addShapePath,
    currentSize,
    originalSize,
  } = useImageStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [shapePreview, setShapePreview] = useState<{ x: number; y: number } | null>(null);

  const imageWidth = currentSize?.width || originalSize?.width || 0;
  const imageHeight = currentSize?.height || originalSize?.height || 0;

  const isShapeMode = ["line", "rectangle", "circle"].includes(brushSettings.mode);

  // Canvas 리렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas 크기 설정
    canvas.width = imageWidth * displayScale;
    canvas.height = imageHeight * displayScale;

    // Canvas 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 모든 경로 렌더링
    renderAllDrawPaths(ctx, drawPaths, canvas.width, canvas.height);

    // 도형 프리뷰 렌더링
    if (shapeStart && shapePreview && isShapeMode) {
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushSettings.size;
      ctx.strokeStyle = brushSettings.color;
      ctx.globalAlpha = brushSettings.opacity * 0.5;

      const x1 = (shapeStart.x / 100) * canvas.width;
      const y1 = (shapeStart.y / 100) * canvas.height;
      const x2 = (shapePreview.x / 100) * canvas.width;
      const y2 = (shapePreview.y / 100) * canvas.height;

      ctx.beginPath();

      if (brushSettings.mode === "line") {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      } else if (brushSettings.mode === "rectangle") {
        const x = Math.min(x1, x2);
        const y = Math.min(y1, y2);
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        ctx.rect(x, y, width, height);
      } else if (brushSettings.mode === "circle") {
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const radiusX = Math.abs(x2 - x1) / 2;
        const radiusY = Math.abs(y2 - y1) / 2;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      }

      ctx.stroke();
      ctx.restore();
    }
  }, [drawPaths, displayScale, imageWidth, imageHeight, shapeStart, shapePreview, isShapeMode, brushSettings]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      e.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();
      const point = screenToDrawCoords(
        e.clientX,
        e.clientY,
        rect,
        displayScale,
        imageWidth,
        imageHeight
      );

      if (isShapeMode) {
        setShapeStart(point);
        setShapePreview(point);
      } else {
        startDrawing();
        addDrawPoint(point);
      }
    },
    [containerRef, displayScale, imageWidth, imageHeight, isShapeMode, startDrawing, addDrawPoint]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const point = screenToDrawCoords(
        e.clientX,
        e.clientY,
        rect,
        displayScale,
        imageWidth,
        imageHeight
      );

      if (isShapeMode && shapeStart) {
        setShapePreview(point);
      } else if (isDrawing) {
        addDrawPoint(point);
      }
    },
    [containerRef, displayScale, imageWidth, imageHeight, isShapeMode, shapeStart, isDrawing, addDrawPoint]
  );

  const handleMouseUp = useCallback(() => {
    if (isShapeMode && shapeStart && shapePreview) {
      addShapePath(shapeStart, shapePreview);
      setShapeStart(null);
      setShapePreview(null);
    } else if (isDrawing) {
      endDrawing();
    }
  }, [isShapeMode, shapeStart, shapePreview, isDrawing, addShapePath, endDrawing]);

  // 글로벌 마우스 이벤트 핸들러
  useEffect(() => {
    const isActive = isDrawing || shapeStart;
    if (isActive) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDrawing, shapeStart, handleMouseMove, handleMouseUp]);

  const cursorStyle = createBrushCursor(brushSettings);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{
        cursor: cursorStyle,
        width: imageWidth * displayScale,
        height: imageHeight * displayScale,
      }}
      onMouseDown={handleMouseDown}
    />
  );
}
