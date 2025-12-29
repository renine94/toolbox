"use client";

import { useMemo } from "react";
import { Card } from "@/shared/ui/card";
import { useImageStore } from "../model/useImageStore";
import { getFilterString, getTransformString } from "../lib/image-utils";

export function ImageCanvas() {
  const { originalImage, filters, transform, currentSize, originalSize } = useImageStore();

  const filterStyle = useMemo(() => getFilterString(filters), [filters]);
  const transformStyle = useMemo(() => getTransformString(transform), [transform]);

  if (!originalImage) {
    return null;
  }

  const displayWidth = currentSize?.width || originalSize?.width || 800;
  const displayHeight = currentSize?.height || originalSize?.height || 600;

  // 캔버스 영역에 맞게 스케일 조정
  const maxWidth = 800;
  const maxHeight = 600;
  const scale = Math.min(1, maxWidth / displayWidth, maxHeight / displayHeight);

  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex flex-col items-center gap-4">
        {/* 이미지 정보 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            원본: {originalSize?.width}×{originalSize?.height}px
          </span>
          {currentSize && (currentSize.width !== originalSize?.width || currentSize.height !== originalSize?.height) && (
            <span className="text-primary">
              → {currentSize.width}×{currentSize.height}px
            </span>
          )}
        </div>

        {/* 이미지 미리보기 영역 */}
        <div
          className="relative overflow-hidden rounded-lg bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjY2NjIi8+CiAgPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNjY2MiLz4KPC9zdmc+')] bg-repeat"
          style={{
            width: displayWidth * scale,
            height: displayHeight * scale,
          }}
        >
          <img
            src={originalImage}
            alt="편집 중인 이미지"
            className="w-full h-full object-contain transition-all duration-150"
            style={{
              filter: filterStyle,
              transform: transformStyle,
            }}
            draggable={false}
          />
        </div>

        {/* 줌 레벨 표시 */}
        <div className="text-xs text-muted-foreground">
          미리보기: {Math.round(scale * 100)}%
        </div>
      </div>
    </Card>
  );
}
