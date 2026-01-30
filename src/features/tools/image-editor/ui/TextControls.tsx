"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Slider } from "@/shared/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useImageStore } from "../model/useImageStore";
import {
  FONT_FAMILIES,
  WATERMARK_PRESETS,
  TextAlignment,
} from "../model/types";
import {
  Plus,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  Droplet,
} from "lucide-react";

export function TextControls() {
  const {
    textLayers,
    selectedTextLayerId,
    addTextLayer,
    updateTextLayer,
    removeTextLayer,
    selectTextLayer,
    applyWatermarkPreset,
  } = useImageStore();

  const [watermarkText, setWatermarkText] = useState("");

  const selectedLayer = textLayers.find((l) => l.id === selectedTextLayerId);

  const handleAddText = () => {
    addTextLayer();
  };

  const handleApplyWatermark = (presetId: string) => {
    if (!watermarkText.trim()) return;
    applyWatermarkPreset(presetId, watermarkText);
    setWatermarkText("");
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold">텍스트 / 워터마크</h3>

      {/* 텍스트 추가 버튼 */}
      <Button onClick={handleAddText} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        텍스트 추가
      </Button>

      {/* 워터마크 프리셋 */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">워터마크 프리셋</label>
        <Input
          placeholder="워터마크 텍스트 입력"
          value={watermarkText}
          onChange={(e) => setWatermarkText(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-2">
          {WATERMARK_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              size="sm"
              onClick={() => handleApplyWatermark(preset.id)}
              disabled={!watermarkText.trim()}
            >
              <Droplet className="w-3 h-3 mr-1" />
              {preset.nameKo}
            </Button>
          ))}
        </div>
      </div>

      {/* 레이어 목록 */}
      {textLayers.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">텍스트 레이어</label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {textLayers.map((layer, index) => (
              <div
                key={layer.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                  layer.id === selectedTextLayerId
                    ? "bg-primary/10 border border-primary"
                    : "bg-muted/50 hover:bg-muted"
                }`}
                onClick={() => selectTextLayer(layer.id)}
              >
                <span className="text-sm truncate flex-1">
                  {index + 1}. {layer.text.substring(0, 20)}
                  {layer.text.length > 20 ? "..." : ""}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTextLayer(layer.id);
                  }}
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 선택된 레이어 편집 */}
      {selectedLayer && (
        <div className="space-y-4 border-t pt-4">
          <h4 className="text-sm font-medium">레이어 편집</h4>

          {/* 텍스트 입력 */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">텍스트</label>
            <textarea
              className="w-full p-2 text-sm border rounded resize-none bg-background"
              rows={2}
              value={selectedLayer.text}
              onChange={(e) =>
                updateTextLayer(selectedLayer.id, { text: e.target.value })
              }
            />
          </div>

          {/* 폰트 선택 */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">폰트</label>
            <Select
              value={selectedLayer.fontFamily}
              onValueChange={(value) =>
                updateTextLayer(selectedLayer.id, { fontFamily: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 폰트 크기 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">크기</span>
              <span>{selectedLayer.fontSize}px</span>
            </div>
            <Slider
              value={[selectedLayer.fontSize]}
              onValueChange={([value]) =>
                updateTextLayer(selectedLayer.id, { fontSize: value })
              }
              min={8}
              max={200}
              step={1}
            />
          </div>

          {/* 색상 */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">색상</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedLayer.color}
                onChange={(e) =>
                  updateTextLayer(selectedLayer.id, { color: e.target.value })
                }
                className="w-10 h-10 rounded cursor-pointer"
              />
              <Input
                value={selectedLayer.color}
                onChange={(e) =>
                  updateTextLayer(selectedLayer.id, { color: e.target.value })
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* 투명도 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">투명도</span>
              <span>{Math.round(selectedLayer.opacity * 100)}%</span>
            </div>
            <Slider
              value={[selectedLayer.opacity * 100]}
              onValueChange={([value]) =>
                updateTextLayer(selectedLayer.id, { opacity: value / 100 })
              }
              min={0}
              max={100}
              step={1}
            />
          </div>

          {/* 회전 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">회전</span>
              <span>{selectedLayer.rotation}°</span>
            </div>
            <div className="flex gap-2">
              <Slider
                value={[selectedLayer.rotation]}
                onValueChange={([value]) =>
                  updateTextLayer(selectedLayer.id, { rotation: value })
                }
                min={-180}
                max={180}
                step={1}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateTextLayer(selectedLayer.id, { rotation: 0 })
                }
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* 스타일 버튼 */}
          <div className="flex gap-2">
            <Button
              variant={selectedLayer.bold ? "default" : "outline"}
              size="sm"
              onClick={() =>
                updateTextLayer(selectedLayer.id, { bold: !selectedLayer.bold })
              }
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant={selectedLayer.italic ? "default" : "outline"}
              size="sm"
              onClick={() =>
                updateTextLayer(selectedLayer.id, {
                  italic: !selectedLayer.italic,
                })
              }
            >
              <Italic className="w-4 h-4" />
            </Button>
            <div className="flex-1" />
            <Button
              variant={selectedLayer.alignment === "left" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                updateTextLayer(selectedLayer.id, { alignment: "left" as TextAlignment })
              }
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={selectedLayer.alignment === "center" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                updateTextLayer(selectedLayer.id, { alignment: "center" as TextAlignment })
              }
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={selectedLayer.alignment === "right" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                updateTextLayer(selectedLayer.id, { alignment: "right" as TextAlignment })
              }
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* 사용법 안내 */}
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-2">
        <p>• 텍스트를 드래그하여 위치를 조절합니다</p>
        <p>• 워터마크 프리셋으로 빠르게 추가할 수 있습니다</p>
      </div>
    </Card>
  );
}
