"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useImageStore } from "../model/useImageStore";
import { CropArea } from "../model/types";
import {
  clampCropArea,
  createDefaultCropArea,
  getAspectRatioValue,
  getHandleAtPosition,
  getResizeCursor,
  constrainCropAreaToAspectRatio,
} from "../lib/crop-utils";

interface CropOverlayProps {
  displayScale: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function CropOverlay({ displayScale, containerRef }: CropOverlayProps) {
  const {
    cropArea,
    setCropArea,
    cropSettings,
    currentSize,
    originalSize,
    isCropping,
  } = useImageStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialCropArea, setInitialCropArea] = useState<CropArea | null>(null);

  const imageWidth = currentSize?.width || originalSize?.width || 0;
  const imageHeight = currentSize?.height || originalSize?.height || 0;

  // 초기 크롭 영역 설정
  useEffect(() => {
    if (isCropping && !cropArea && imageWidth && imageHeight) {
      const aspectRatio = getAspectRatioValue(cropSettings.aspectRatio);
      const defaultArea = createDefaultCropArea(imageWidth, imageHeight, aspectRatio);
      setCropArea(defaultArea);
    }
  }, [isCropping, cropArea, imageWidth, imageHeight, cropSettings.aspectRatio, setCropArea]);

  // 종횡비 변경 시 크롭 영역 조정
  useEffect(() => {
    if (cropArea && isCropping && imageWidth && imageHeight) {
      const aspectRatio = getAspectRatioValue(cropSettings.aspectRatio);
      if (aspectRatio) {
        const adjusted = constrainCropAreaToAspectRatio(
          cropArea,
          aspectRatio,
          imageWidth,
          imageHeight,
          "se"
        );
        const clamped = clampCropArea(adjusted, imageWidth, imageHeight);
        setCropArea(clamped);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropSettings.aspectRatio, imageWidth, imageHeight]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!cropArea || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / displayScale;
      const mouseY = (e.clientY - rect.top) / displayScale;

      const handle = getHandleAtPosition(mouseX, mouseY, cropArea);
      if (handle) {
        setIsDragging(true);
        setDragHandle(handle);
        setDragStart({ x: mouseX, y: mouseY });
        setInitialCropArea({ ...cropArea });
        e.preventDefault();
      }
    },
    [cropArea, containerRef, displayScale]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !initialCropArea || !dragHandle || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / displayScale;
      const mouseY = (e.clientY - rect.top) / displayScale;

      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;

      let newArea: CropArea = { ...initialCropArea };

      if (dragHandle === "move") {
        // 이동
        newArea.x = initialCropArea.x + deltaX;
        newArea.y = initialCropArea.y + deltaY;
      } else {
        // 리사이즈
        if (dragHandle.includes("w")) {
          newArea.x = initialCropArea.x + deltaX;
          newArea.width = initialCropArea.width - deltaX;
        }
        if (dragHandle.includes("e")) {
          newArea.width = initialCropArea.width + deltaX;
        }
        if (dragHandle.includes("n")) {
          newArea.y = initialCropArea.y + deltaY;
          newArea.height = initialCropArea.height - deltaY;
        }
        if (dragHandle.includes("s")) {
          newArea.height = initialCropArea.height + deltaY;
        }

        // 종횡비 제약 적용
        const aspectRatio = getAspectRatioValue(cropSettings.aspectRatio);
        if (aspectRatio) {
          newArea = constrainCropAreaToAspectRatio(
            newArea,
            aspectRatio,
            imageWidth,
            imageHeight,
            dragHandle
          );
        }
      }

      // 경계 내로 제한
      const clamped = clampCropArea(newArea, imageWidth, imageHeight);
      setCropArea(clamped);
    },
    [isDragging, initialCropArea, dragHandle, dragStart, displayScale, containerRef, imageWidth, imageHeight, cropSettings.aspectRatio, setCropArea]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
    setInitialCropArea(null);
  }, []);

  // 글로벌 마우스 이벤트 핸들러
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 커서 업데이트
  const getCursor = useCallback(
    (e: React.MouseEvent) => {
      if (!cropArea || !containerRef.current) return "default";

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / displayScale;
      const mouseY = (e.clientY - rect.top) / displayScale;

      const handle = getHandleAtPosition(mouseX, mouseY, cropArea);
      return handle ? getResizeCursor(handle) : "default";
    },
    [cropArea, containerRef, displayScale]
  );

  if (!isCropping || !cropArea) return null;

  const scaledArea = {
    x: cropArea.x * displayScale,
    y: cropArea.y * displayScale,
    width: cropArea.width * displayScale,
    height: cropArea.height * displayScale,
  };

  const handleSize = 10;

  return (
    <div
      className="absolute inset-0 pointer-events-auto"
      onMouseDown={handleMouseDown}
      onMouseMove={(e) => {
        if (!isDragging && containerRef.current) {
          containerRef.current.style.cursor = getCursor(e);
        }
      }}
      style={{ cursor: isDragging ? getResizeCursor(dragHandle || "move") : "default" }}
    >
      {/* 어두운 오버레이 - 선택 영역 외부 */}
      <div className="absolute inset-0">
        {/* 상단 */}
        <div
          className="absolute bg-black/50"
          style={{
            left: 0,
            top: 0,
            right: 0,
            height: scaledArea.y,
          }}
        />
        {/* 하단 */}
        <div
          className="absolute bg-black/50"
          style={{
            left: 0,
            top: scaledArea.y + scaledArea.height,
            right: 0,
            bottom: 0,
          }}
        />
        {/* 좌측 */}
        <div
          className="absolute bg-black/50"
          style={{
            left: 0,
            top: scaledArea.y,
            width: scaledArea.x,
            height: scaledArea.height,
          }}
        />
        {/* 우측 */}
        <div
          className="absolute bg-black/50"
          style={{
            left: scaledArea.x + scaledArea.width,
            top: scaledArea.y,
            right: 0,
            height: scaledArea.height,
          }}
        />
      </div>

      {/* 크롭 영역 테두리 */}
      <div
        className="absolute border-2 border-white"
        style={{
          left: scaledArea.x,
          top: scaledArea.y,
          width: scaledArea.width,
          height: scaledArea.height,
        }}
      >
        {/* 가이드 그리드 (Rule of Thirds) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
        </div>
      </div>

      {/* 리사이즈 핸들 - 모서리 */}
      {["nw", "ne", "sw", "se"].map((corner) => {
        const isLeft = corner.includes("w");
        const isTop = corner.includes("n");
        return (
          <div
            key={corner}
            className="absolute bg-white border border-gray-400 rounded-sm"
            style={{
              left: isLeft
                ? scaledArea.x - handleSize / 2
                : scaledArea.x + scaledArea.width - handleSize / 2,
              top: isTop
                ? scaledArea.y - handleSize / 2
                : scaledArea.y + scaledArea.height - handleSize / 2,
              width: handleSize,
              height: handleSize,
              cursor: getResizeCursor(corner),
            }}
          />
        );
      })}

      {/* 리사이즈 핸들 - 변 */}
      {["n", "s", "e", "w"].map((edge) => {
        const isHorizontal = edge === "n" || edge === "s";
        return (
          <div
            key={edge}
            className="absolute bg-white border border-gray-400 rounded-sm"
            style={{
              left: edge === "w"
                ? scaledArea.x - handleSize / 2
                : edge === "e"
                ? scaledArea.x + scaledArea.width - handleSize / 2
                : scaledArea.x + scaledArea.width / 2 - handleSize / 2,
              top: edge === "n"
                ? scaledArea.y - handleSize / 2
                : edge === "s"
                ? scaledArea.y + scaledArea.height - handleSize / 2
                : scaledArea.y + scaledArea.height / 2 - handleSize / 2,
              width: isHorizontal ? handleSize * 2 : handleSize,
              height: isHorizontal ? handleSize : handleSize * 2,
              cursor: getResizeCursor(edge),
            }}
          />
        );
      })}

      {/* 크기 표시 */}
      <div
        className="absolute bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none"
        style={{
          left: scaledArea.x + scaledArea.width / 2,
          top: scaledArea.y + scaledArea.height + 8,
          transform: "translateX(-50%)",
        }}
      >
        {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
      </div>
    </div>
  );
}
