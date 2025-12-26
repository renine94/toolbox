"use client";

import { useGradientStore } from "../model/useGradientStore";
import { PRESET_GRADIENTS } from "../model/types";
import { generateGradientCSS } from "../lib/gradient-utils";
import { toast } from "sonner";

export function PresetGradients() {
  const loadPreset = useGradientStore((state) => state.loadPreset);

  const handlePresetClick = (preset: (typeof PRESET_GRADIENTS)[0]) => {
    loadPreset(preset);
    toast.success(`${preset.name} 프리셋이 적용되었습니다`);
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {PRESET_GRADIENTS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => handlePresetClick(preset)}
          className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:ring-2 hover:ring-primary transition-all duration-200"
          title={preset.name}
        >
          <div
            className="absolute inset-0"
            style={{ background: generateGradientCSS(preset.config) }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end justify-center pb-1">
            <span className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium drop-shadow">
              {preset.name}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
