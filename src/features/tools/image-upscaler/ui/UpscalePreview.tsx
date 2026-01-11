"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Slider } from "@/shared/ui/slider";
import { Badge } from "@/shared/ui/badge";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUpscaleStore } from "../model/useUpscaleStore";
import { formatDimensions } from "../lib/upscale-utils";

export function UpscalePreview() {
  const {
    originalImage,
    upscaledImage,
    originalSize,
    upscaledSize,
    isProcessing,
    progress,
  } = useUpscaleStore();
  const t = useTranslations("tools.imageUpscaler.ui.preview");

  const [comparePosition, setComparePosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setComparePosition(Math.max(0, Math.min(100, percentage)));
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;

      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setComparePosition(Math.max(0, Math.min(100, percentage)));
    },
    []
  );

  if (!originalImage) return null;

  const displayImage = upscaledImage || originalImage;
  const displaySize = upscaledImage ? upscaledSize : originalSize;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("title")}</CardTitle>
          <div className="flex gap-2">
            {originalSize && (
              <Badge variant="outline">
                {t("original")}: {formatDimensions(originalSize)}
              </Badge>
            )}
            {upscaledSize && (
              <Badge variant="secondary">
                {t("upscaled")}: {formatDimensions(upscaledSize)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* 처리 중 오버레이 */}
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-sm font-medium">{t("processing")}</p>
            <div className="w-48 mt-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {progress}%
              </p>
            </div>
          </div>
        )}

        {/* 비교 미리보기 */}
        {upscaledImage ? (
          <div className="space-y-4">
            <div
              ref={containerRef}
              className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden cursor-ew-resize select-none"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* 원본 이미지 (왼쪽) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
              >
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-full object-contain"
                  draggable={false}
                />
                <Badge
                  className="absolute top-2 left-2"
                  variant="secondary"
                >
                  {t("original")}
                </Badge>
              </div>

              {/* 업스케일 이미지 (오른쪽) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${comparePosition}%)` }}
              >
                <img
                  src={upscaledImage}
                  alt="Upscaled"
                  className="w-full h-full object-contain"
                  draggable={false}
                />
                <Badge
                  className="absolute top-2 right-2"
                  variant="default"
                >
                  {t("upscaled")}
                </Badge>
              </div>

              {/* 슬라이더 핸들 */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
                style={{ left: `${comparePosition}%`, transform: "translateX(-50%)" }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-primary-foreground rounded-full" />
                    <div className="w-0.5 h-3 bg-primary-foreground rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{t("original")}</span>
              <Slider
                value={[comparePosition]}
                onValueChange={([value]) => setComparePosition(value)}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">{t("upscaled")}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {t("dragToCompare")}
            </p>
          </div>
        ) : (
          /* 원본 이미지만 표시 */
          <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={displayImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            {displaySize && (
              <Badge className="absolute bottom-2 right-2" variant="secondary">
                {formatDimensions(displaySize)}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
