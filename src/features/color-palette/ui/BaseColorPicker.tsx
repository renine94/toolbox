"use client";

import { HexColorPicker, HexColorInput } from "react-colorful";
import { Label } from "@/shared/ui/label";
import { usePaletteStore } from "../model/usePaletteStore";

export function BaseColorPicker() {
  const { baseColor, setBaseColor } = usePaletteStore();

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">기준 색상</Label>

      <div className="flex flex-col items-center gap-4">
        <HexColorPicker
          color={baseColor}
          onChange={setBaseColor}
          style={{ width: "100%", height: "160px" }}
        />

        <div className="flex items-center gap-2 w-full">
          <div
            className="w-10 h-10 rounded-md border shadow-sm shrink-0"
            style={{ backgroundColor: baseColor }}
          />
          <HexColorInput
            color={baseColor}
            onChange={setBaseColor}
            prefixed
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}
