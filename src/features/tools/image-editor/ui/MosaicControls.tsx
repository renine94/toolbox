"use client";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Slider } from "@/shared/ui/slider";
import { useImageStore } from "../model/useImageStore";
import { mosaicModes, MosaicMode } from "../model/types";
import { Pencil, Square, Trash2 } from "lucide-react";

const MODE_ICONS: Record<MosaicMode, React.ReactNode> = {
  brush: <Pencil className="w-4 h-4" />,
  rectangle: <Square className="w-4 h-4" />,
};

const MODE_LABELS: Record<MosaicMode, string> = {
  brush: "브러시",
  rectangle: "사각형",
};

export function MosaicControls() {
  const { mosaicSettings, setMosaicSettings, mosaicAreas, clearAllMosaicAreas } = useImageStore();

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold">모자이크</h3>

      {/* 모드 선택 */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">모드</label>
        <div className="grid grid-cols-2 gap-1">
          {mosaicModes.map((mode) => (
            <Button
              key={mode}
              variant={mosaicSettings.mode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => setMosaicSettings({ mode })}
              title={MODE_LABELS[mode]}
            >
              {MODE_ICONS[mode]}
              <span className="ml-1">{MODE_LABELS[mode]}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* 모자이크 강도 (픽셀 크기) */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">모자이크 강도</span>
          <span>{mosaicSettings.pixelSize}px</span>
        </div>
        <Slider
          value={[mosaicSettings.pixelSize]}
          onValueChange={([value]) => setMosaicSettings({ pixelSize: value })}
          min={2}
          max={50}
          step={1}
        />
        {/* 강도 프리뷰 */}
        <div className="flex justify-center py-2">
          <div
            className="rounded border border-muted-foreground/20 overflow-hidden"
            style={{ width: 60, height: 40 }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `repeating-conic-gradient(#888 0% 25%, #ccc 0% 50%)`,
                backgroundSize: `${Math.max(4, mosaicSettings.pixelSize)}px ${Math.max(4, mosaicSettings.pixelSize)}px`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 브러시 크기 (브러시 모드만) */}
      {mosaicSettings.mode === "brush" && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">브러시 크기</span>
            <span>{mosaicSettings.brushSize}px</span>
          </div>
          <Slider
            value={[mosaicSettings.brushSize]}
            onValueChange={([value]) => setMosaicSettings({ brushSize: value })}
            min={10}
            max={200}
            step={1}
          />
          {/* 크기 프리뷰 */}
          <div className="flex justify-center py-2">
            <div
              className="rounded-full border-2 border-dashed border-muted-foreground/50"
              style={{
                width: Math.min(mosaicSettings.brushSize, 60),
                height: Math.min(mosaicSettings.brushSize, 60),
              }}
            />
          </div>
        </div>
      )}

      {/* 모두 지우기 */}
      {mosaicAreas.length > 0 && (
        <Button
          variant="destructive"
          onClick={clearAllMosaicAreas}
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          모두 지우기 ({mosaicAreas.length}개)
        </Button>
      )}

      {/* 사용법 안내 */}
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-2">
        {mosaicSettings.mode === "brush" ? (
          <>
            <p>• 이미지 위에서 드래그하여 모자이크를 칠합니다</p>
            <p>• 브러시 크기와 강도를 조절할 수 있습니다</p>
          </>
        ) : (
          <>
            <p>• 이미지 위에서 드래그하여 영역을 선택합니다</p>
            <p>• 선택한 사각형 영역이 모자이크 처리됩니다</p>
          </>
        )}
      </div>
    </Card>
  );
}
