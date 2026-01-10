"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import { useDebounceCallback } from "@/shared/hooks/use-debounce";
import { useImageStore } from "../model/useImageStore";

const PRESET_SIZES = [
  { label: "Instagram 정사각형", width: 1080, height: 1080 },
  { label: "Instagram 가로", width: 1080, height: 566 },
  { label: "Instagram 세로", width: 1080, height: 1350 },
  { label: "Facebook 커버", width: 820, height: 312 },
  { label: "Twitter 헤더", width: 1500, height: 500 },
  { label: "YouTube 썸네일", width: 1280, height: 720 },
  { label: "HD (720p)", width: 1280, height: 720 },
  { label: "Full HD (1080p)", width: 1920, height: 1080 },
  { label: "4K UHD", width: 3840, height: 2160 },
];

export function ResizeControls() {
  const { currentSize, originalSize, resize } = useImageStore();
  const [width, setWidth] = useState(currentSize?.width || 0);
  const [height, setHeight] = useState(currentSize?.height || 0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const aspectRatio = originalSize ? originalSize.width / originalSize.height : 1;

  const debouncedResize = useDebounceCallback((w: number, h: number) => {
    if (w > 0 && h > 0 && currentSize && (w !== currentSize.width || h !== currentSize.height)) {
      resize({ width: w, height: h });
    }
  }, 500);

  useEffect(() => {
    if (currentSize) {
      setWidth(currentSize.width);
      setHeight(currentSize.height);
    }
  }, [currentSize]);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    const newHeight = maintainAspectRatio ? Math.round(newWidth / aspectRatio) : height;
    if (maintainAspectRatio) {
      setHeight(newHeight);
    }
    debouncedResize(newWidth, maintainAspectRatio ? newHeight : height);
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    const newWidth = maintainAspectRatio ? Math.round(newHeight * aspectRatio) : width;
    if (maintainAspectRatio) {
      setWidth(newWidth);
    }
    debouncedResize(maintainAspectRatio ? newWidth : width, newHeight);
  };

  const handlePreset = (preset: typeof PRESET_SIZES[0]) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setMaintainAspectRatio(false);
    resize({ width: preset.width, height: preset.height });
  };

  const handleReset = () => {
    if (originalSize) {
      setWidth(originalSize.width);
      setHeight(originalSize.height);
      resize(originalSize);
    }
  };

  const scalePercentage = originalSize
    ? Math.round((width / originalSize.width) * 100)
    : 100;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">크기 조절</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            원본 크기
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 현재 크기 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width" className="text-sm">너비 (px)</Label>
            <Input
              id="width"
              type="number"
              min={1}
              max={10000}
              value={width}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm">높이 (px)</Label>
            <Input
              id="height"
              type="number"
              min={1}
              max={10000}
              value={height}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* 비율 유지 옵션 */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="maintain-ratio"
            checked={maintainAspectRatio}
            onCheckedChange={(checked) => setMaintainAspectRatio(!!checked)}
          />
          <Label htmlFor="maintain-ratio" className="text-sm cursor-pointer">
            종횡비 유지
          </Label>
          <span className="ml-auto text-xs text-muted-foreground">
            {scalePercentage}% 배율
          </span>
        </div>

        {/* 프리셋 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">프리셋 크기</Label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_SIZES.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-2 flex flex-col items-start"
                onClick={() => handlePreset(preset)}
              >
                <span className="font-medium">{preset.label}</span>
                <span className="text-muted-foreground">
                  {preset.width}×{preset.height}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* 퍼센트 크기 조절 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">비율로 조절</Label>
          <div className="flex items-center gap-2">
            {[25, 50, 75, 100, 150, 200].map((percent) => (
              <Button
                key={percent}
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  if (originalSize) {
                    const newWidth = Math.round(originalSize.width * (percent / 100));
                    const newHeight = Math.round(originalSize.height * (percent / 100));
                    setWidth(newWidth);
                    setHeight(newHeight);
                    resize({ width: newWidth, height: newHeight });
                  }
                }}
              >
                {percent}%
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
