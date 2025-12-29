"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { useImageStore } from "../model/useImageStore";
import { FILTER_PRESETS, DEFAULT_FILTERS, ImageFilters } from "../model/types";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

function Slider({ label, value, min, max, step = 1, unit = "", onChange }: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}

export function FilterControls() {
  const { filters, setFilter, resetFilters } = useImageStore();

  const applyPreset = (preset: typeof FILTER_PRESETS[0]) => {
    // 먼저 기본값으로 초기화
    Object.keys(DEFAULT_FILTERS).forEach((key) => {
      const k = key as keyof ImageFilters;
      setFilter(k, DEFAULT_FILTERS[k]);
    });
    // 프리셋 값 적용
    Object.entries(preset.filters).forEach(([key, value]) => {
      setFilter(key as keyof ImageFilters, value as number);
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">필터</CardTitle>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            초기화
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 프리셋 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">프리셋</Label>
          <div className="grid grid-cols-4 gap-2">
            {FILTER_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => applyPreset(preset)}
              >
                {preset.nameKo}
              </Button>
            ))}
          </div>
        </div>

        {/* 기본 조정 */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">기본 조정</Label>

          <Slider
            label="밝기"
            value={filters.brightness}
            min={0}
            max={200}
            unit="%"
            onChange={(v) => setFilter("brightness", v)}
          />

          <Slider
            label="대비"
            value={filters.contrast}
            min={0}
            max={200}
            unit="%"
            onChange={(v) => setFilter("contrast", v)}
          />

          <Slider
            label="채도"
            value={filters.saturation}
            min={0}
            max={200}
            unit="%"
            onChange={(v) => setFilter("saturation", v)}
          />
        </div>

        {/* 효과 */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">효과</Label>

          <Slider
            label="흐림"
            value={filters.blur}
            min={0}
            max={20}
            unit="px"
            onChange={(v) => setFilter("blur", v)}
          />

          <Slider
            label="색조 회전"
            value={filters.hueRotate}
            min={0}
            max={360}
            unit="°"
            onChange={(v) => setFilter("hueRotate", v)}
          />

          <Slider
            label="그레이스케일"
            value={filters.grayscale}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => setFilter("grayscale", v)}
          />

          <Slider
            label="세피아"
            value={filters.sepia}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => setFilter("sepia", v)}
          />

          <Slider
            label="반전"
            value={filters.invert}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => setFilter("invert", v)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
