"use client";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Slider } from "@/shared/ui/slider";
import { useImageStore } from "../model/useImageStore";
import { brushModes, BrushMode } from "../model/types";
import {
  Pencil,
  Eraser,
  Minus,
  Square,
  Circle,
  Trash2,
} from "lucide-react";

const MODE_ICONS: Record<BrushMode, React.ReactNode> = {
  brush: <Pencil className="w-4 h-4" />,
  eraser: <Eraser className="w-4 h-4" />,
  line: <Minus className="w-4 h-4" />,
  rectangle: <Square className="w-4 h-4" />,
  circle: <Circle className="w-4 h-4" />,
};

const MODE_LABELS: Record<BrushMode, string> = {
  brush: "브러시",
  eraser: "지우개",
  line: "직선",
  rectangle: "사각형",
  circle: "원",
};

// 빠른 색상 선택을 위한 프리셋
const COLOR_PRESETS = [
  "#ff0000", // 빨강
  "#ff9900", // 주황
  "#ffff00", // 노랑
  "#00ff00", // 초록
  "#00ffff", // 청록
  "#0000ff", // 파랑
  "#9900ff", // 보라
  "#ff00ff", // 마젠타
  "#ffffff", // 흰색
  "#000000", // 검정
];

export function BrushControls() {
  const { brushSettings, setBrushSettings, drawPaths, clearAllDrawPaths } = useImageStore();

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold">그리기</h3>

      {/* 모드 선택 */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">도구</label>
        <div className="grid grid-cols-5 gap-1">
          {brushModes.map((mode) => (
            <Button
              key={mode}
              variant={brushSettings.mode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => setBrushSettings({ mode })}
              title={MODE_LABELS[mode]}
            >
              {MODE_ICONS[mode]}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {MODE_LABELS[brushSettings.mode]}
        </p>
      </div>

      {/* 브러시 크기 */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">크기</span>
          <span>{brushSettings.size}px</span>
        </div>
        <Slider
          value={[brushSettings.size]}
          onValueChange={([value]) => setBrushSettings({ size: value })}
          min={1}
          max={100}
          step={1}
        />
        {/* 크기 프리뷰 */}
        <div className="flex justify-center py-2">
          <div
            className="rounded-full"
            style={{
              width: Math.min(brushSettings.size, 50),
              height: Math.min(brushSettings.size, 50),
              backgroundColor:
                brushSettings.mode === "eraser" ? "#888" : brushSettings.color,
              opacity: brushSettings.opacity,
            }}
          />
        </div>
      </div>

      {/* 색상 (지우개 모드가 아닐 때만) */}
      {brushSettings.mode !== "eraser" && (
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">색상</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={brushSettings.color}
              onChange={(e) => setBrushSettings({ color: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <Input
              value={brushSettings.color}
              onChange={(e) => setBrushSettings({ color: e.target.value })}
              className="flex-1"
            />
          </div>
          {/* 색상 프리셋 */}
          <div className="grid grid-cols-5 gap-1">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                className={`w-full aspect-square rounded border-2 ${
                  brushSettings.color === color
                    ? "border-primary"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setBrushSettings({ color })}
              />
            ))}
          </div>
        </div>
      )}

      {/* 투명도 */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">투명도</span>
          <span>{Math.round(brushSettings.opacity * 100)}%</span>
        </div>
        <Slider
          value={[brushSettings.opacity * 100]}
          onValueChange={([value]) => setBrushSettings({ opacity: value / 100 })}
          min={10}
          max={100}
          step={1}
        />
      </div>

      {/* 모두 지우기 */}
      {drawPaths.length > 0 && (
        <Button
          variant="destructive"
          onClick={clearAllDrawPaths}
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          모두 지우기 ({drawPaths.length}개)
        </Button>
      )}

      {/* 사용법 안내 */}
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-2">
        <p>• 브러시/지우개: 드래그하여 자유롭게 그립니다</p>
        <p>• 도형: 시작점에서 끝점까지 드래그합니다</p>
        <p>• 지우개는 그린 선을 지웁니다</p>
      </div>
    </Card>
  );
}
