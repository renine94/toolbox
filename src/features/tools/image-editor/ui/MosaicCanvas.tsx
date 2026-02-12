"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useImageStore } from "../model/useImageStore";
import {
  renderAllMosaicAreas,
  renderMosaicArea,
  screenToMosaicCoords,
  createMosaicCursor,
} from "../lib/mosaic-utils";

interface MosaicCanvasProps {
  displayScale: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function MosaicCanvas({ displayScale, containerRef }: MosaicCanvasProps) {
  const {
    mosaicAreas,
    mosaicSettings,
    isMosaicing,
    startMosaicing,
    addMosaicPoint,
    endMosaicing,
    addMosaicRect,
    currentSize,
    originalSize,
    originalImage,
  } = useImageStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceImgRef = useRef<HTMLImageElement | null>(null);
  const [rectStart, setRectStart] = useState<{ x: number; y: number } | null>(null);
  const [rectPreview, setRectPreview] = useState<{ x: number; y: number } | null>(null);

  const imageWidth = currentSize?.width || originalSize?.width || 0;
  const imageHeight = currentSize?.height || originalSize?.height || 0;

  const isRectMode = mosaicSettings.mode === "rectangle";

  // 원본 이미지 로드
  useEffect(() => {
    if (!originalImage) {
      sourceImgRef.current = null;
      return;
    }

    const img = new Image();
    img.onload = () => {
      sourceImgRef.current = img;
    };
    img.src = originalImage;
  }, [originalImage]);

  // Canvas 리렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    const sourceImg = sourceImgRef.current;
    if (!canvas || !sourceImg) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas 크기 설정
    canvas.width = imageWidth * displayScale;
    canvas.height = imageHeight * displayScale;

    // Canvas 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 모든 확정된 모자이크 영역 렌더링
    if (mosaicAreas.length > 0) {
      renderAllMosaicAreas(ctx, sourceImg, mosaicAreas, canvas.width, canvas.height);
    }

    // 사각형 프리뷰 렌더링
    if (rectStart && rectPreview && isRectMode) {
      // 프리뷰: 실제 모자이크 효과 + 점선 테두리
      const previewArea = {
        id: "preview",
        mode: "rectangle" as const,
        pixelSize: mosaicSettings.pixelSize,
        points: [],
        brushSize: mosaicSettings.brushSize,
        startPoint: rectStart,
        endPoint: rectPreview,
      };
      renderMosaicArea(ctx, sourceImg, previewArea, canvas.width, canvas.height);

      // 점선 테두리 추가
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 1;
      const x1 = (rectStart.x / 100) * canvas.width;
      const y1 = (rectStart.y / 100) * canvas.height;
      const x2 = (rectPreview.x / 100) * canvas.width;
      const y2 = (rectPreview.y / 100) * canvas.height;
      ctx.strokeRect(
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.abs(x2 - x1),
        Math.abs(y2 - y1)
      );
      ctx.restore();
    }
  }, [mosaicAreas, displayScale, imageWidth, imageHeight, rectStart, rectPreview, isRectMode, mosaicSettings, isMosaicing]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      e.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();
      const point = screenToMosaicCoords(
        e.clientX,
        e.clientY,
        rect,
        displayScale,
        imageWidth,
        imageHeight
      );

      if (isRectMode) {
        setRectStart(point);
        setRectPreview(point);
      } else {
        startMosaicing();
        addMosaicPoint(point);
      }
    },
    [containerRef, displayScale, imageWidth, imageHeight, isRectMode, startMosaicing, addMosaicPoint]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const point = screenToMosaicCoords(
        e.clientX,
        e.clientY,
        rect,
        displayScale,
        imageWidth,
        imageHeight
      );

      if (isRectMode && rectStart) {
        setRectPreview(point);
      } else if (isMosaicing) {
        addMosaicPoint(point);
      }
    },
    [containerRef, displayScale, imageWidth, imageHeight, isRectMode, rectStart, isMosaicing, addMosaicPoint]
  );

  const handleMouseUp = useCallback(() => {
    if (isRectMode && rectStart && rectPreview) {
      // 최소 크기 체크
      const dx = Math.abs(rectPreview.x - rectStart.x);
      const dy = Math.abs(rectPreview.y - rectStart.y);
      if (dx > 0.5 || dy > 0.5) {
        addMosaicRect(rectStart, rectPreview);
      }
      setRectStart(null);
      setRectPreview(null);
    } else if (isMosaicing) {
      endMosaicing();
    }
  }, [isRectMode, rectStart, rectPreview, isMosaicing, addMosaicRect, endMosaicing]);

  // 글로벌 마우스 이벤트 핸들러
  useEffect(() => {
    const isActive = isMosaicing || rectStart;
    if (isActive) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isMosaicing, rectStart, handleMouseMove, handleMouseUp]);

  const cursorStyle = createMosaicCursor(mosaicSettings);

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
