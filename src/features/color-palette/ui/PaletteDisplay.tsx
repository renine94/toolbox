"use client";

import { useMemo } from "react";
import { usePaletteStore } from "../model/usePaletteStore";
import { generateHarmony } from "../lib/harmony";
import { ColorCard } from "./ColorCard";
import { PaletteColor } from "../model/types";

interface PaletteDisplayProps {
  onColorsChange?: (colors: PaletteColor[]) => void;
}

export function PaletteDisplay({ onColorsChange }: PaletteDisplayProps) {
  const { baseColor, harmonyType, customColors, removeCustomColor } =
    usePaletteStore();

  // Generate harmony colors
  const harmonyColors = useMemo(() => {
    return generateHarmony(baseColor, harmonyType);
  }, [baseColor, harmonyType]);

  // Combine colors based on harmony type
  const displayColors = useMemo(() => {
    if (harmonyType === "custom") {
      return customColors;
    }
    return harmonyColors;
  }, [harmonyType, harmonyColors, customColors]);

  // Notify parent of color changes
  useMemo(() => {
    onColorsChange?.(displayColors);
  }, [displayColors, onColorsChange]);

  if (displayColors.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
        {harmonyType === "custom"
          ? "색상을 추가해주세요"
          : "팔레트를 생성 중..."}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">팔레트 ({displayColors.length}색)</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {displayColors.map((color) => (
          <ColorCard
            key={color.id}
            color={color}
            showRemove={harmonyType === "custom"}
            onRemove={() => removeCustomColor(color.id)}
          />
        ))}
      </div>
    </div>
  );
}
