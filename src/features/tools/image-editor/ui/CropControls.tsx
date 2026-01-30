"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { useImageStore } from "../model/useImageStore";
import { aspectRatioPresets, AspectRatioPreset } from "../model/types";
import { Check, RotateCcw, Square, RectangleHorizontal, RectangleVertical, Crop, Loader2 } from "lucide-react";
import { createDefaultCropArea, getAspectRatioValue } from "../lib/crop-utils";

const ASPECT_RATIO_ICONS: Record<AspectRatioPreset, React.ReactNode> = {
  "free": <Crop className="w-4 h-4" />,
  "1:1": <Square className="w-4 h-4" />,
  "4:3": <RectangleHorizontal className="w-4 h-4" />,
  "3:2": <RectangleHorizontal className="w-4 h-4" />,
  "16:9": <RectangleHorizontal className="w-4 h-4" />,
  "9:16": <RectangleVertical className="w-4 h-4" />,
};

const ASPECT_RATIO_LABELS: Record<AspectRatioPreset, string> = {
  "free": "자유",
  "1:1": "1:1",
  "4:3": "4:3",
  "3:2": "3:2",
  "16:9": "16:9",
  "9:16": "9:16",
};

export function CropControls() {
  const {
    cropArea,
    cropSettings,
    setCropSettings,
    setCropArea,
    applyCrop,
    currentSize,
    originalSize,
    isLoading,
  } = useImageStore();

  const [isApplying, setIsApplying] = useState(false);

  const imageWidth = currentSize?.width || originalSize?.width || 0;
  const imageHeight = currentSize?.height || originalSize?.height || 0;

  const handleApply = async () => {
    setIsApplying(true);
    await applyCrop();
    setIsApplying(false);
  };

  const handleReset = () => {
    // 크롭 영역을 기본값으로 리셋
    if (imageWidth && imageHeight) {
      const aspectRatio = getAspectRatioValue(cropSettings.aspectRatio);
      const defaultArea = createDefaultCropArea(imageWidth, imageHeight, aspectRatio);
      setCropArea(defaultArea);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold">자르기</h3>

      {/* 종횡비 선택 */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">종횡비</label>
        <div className="grid grid-cols-3 gap-2">
          {aspectRatioPresets.map((preset) => (
            <Button
              key={preset}
              variant={cropSettings.aspectRatio === preset ? "default" : "outline"}
              size="sm"
              onClick={() => setCropSettings({ aspectRatio: preset })}
              className="flex items-center gap-1"
            >
              {ASPECT_RATIO_ICONS[preset]}
              <span className="text-xs">{ASPECT_RATIO_LABELS[preset]}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* 현재 크롭 영역 정보 */}
      {cropArea && (
        <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
          <p>
            선택 영역: {Math.round(cropArea.width)} × {Math.round(cropArea.height)}px
          </p>
          <p className="text-xs mt-1">
            위치: ({Math.round(cropArea.x)}, {Math.round(cropArea.y)})
          </p>
        </div>
      )}

      {/* 적용/초기화 버튼 */}
      <div className="flex gap-2">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          초기화
        </Button>
        <Button
          onClick={handleApply}
          disabled={!cropArea || isApplying || isLoading}
          className="flex-1"
        >
          {isApplying ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-1" />
          )}
          {isApplying ? "적용 중..." : "적용"}
        </Button>
      </div>

      {/* 사용법 안내 */}
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-2">
        <p>• 이미지 위의 <strong>흰색 테두리 영역</strong>이 자르기 영역입니다</p>
        <p>• 영역 내부를 드래그하여 이동합니다</p>
        <p>• 모서리/변의 핸들을 드래그하여 크기를 조절합니다</p>
        <p>• 삼등분선 가이드로 구도를 맞춥니다</p>
      </div>
    </Card>
  );
}
