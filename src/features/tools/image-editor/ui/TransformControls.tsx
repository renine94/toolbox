"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { RotateCcw, RotateCw, FlipHorizontal2, FlipVertical2 } from "lucide-react";
import { useImageStore } from "../model/useImageStore";

export function TransformControls() {
  const { transform, setTransform, resetTransform } = useImageStore();

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">변환</CardTitle>
          <Button variant="ghost" size="sm" onClick={resetTransform}>
            초기화
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 회전 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">회전</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTransform("rotate", (transform.rotate - 90 + 360) % 360 - 180)}
              title="왼쪽으로 90° 회전"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTransform("rotate", (transform.rotate + 90 + 180) % 360 - 180)}
              title="오른쪽으로 90° 회전"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <span className="ml-auto text-sm text-muted-foreground tabular-nums">
              {transform.rotate}°
            </span>
          </div>
          <Slider
            value={[transform.rotate]}
            onValueChange={([val]) => setTransform("rotate", val)}
            min={-180}
            max={180}
            step={1}
            className="w-full"
          />
        </div>

        {/* 뒤집기 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">뒤집기</Label>
          <div className="flex items-center gap-2">
            <Button
              variant={transform.flipHorizontal ? "default" : "outline"}
              size="sm"
              onClick={() => setTransform("flipHorizontal", !transform.flipHorizontal)}
              className="flex-1"
            >
              <FlipHorizontal2 className="w-4 h-4 mr-2" />
              가로
            </Button>
            <Button
              variant={transform.flipVertical ? "default" : "outline"}
              size="sm"
              onClick={() => setTransform("flipVertical", !transform.flipVertical)}
              className="flex-1"
            >
              <FlipVertical2 className="w-4 h-4 mr-2" />
              세로
            </Button>
          </div>
        </div>

        {/* 스케일 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">확대/축소</Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {Math.round(transform.scale * 100)}%
            </span>
          </div>
          <Slider
            value={[transform.scale * 100]}
            onValueChange={([val]) => setTransform("scale", val / 100)}
            min={10}
            max={200}
            step={1}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setTransform("scale", 0.5)}
            >
              50%
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setTransform("scale", 1)}
            >
              100%
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setTransform("scale", 1.5)}
            >
              150%
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
