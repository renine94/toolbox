"use client";

import { Button } from "@/shared/ui/button";
import { Copy, X } from "lucide-react";
import { toast } from "sonner";
import { PaletteColor } from "../model/types";
import { getContrastColor, toRgb } from "../lib/harmony";

interface ColorCardProps {
  color: PaletteColor;
  onRemove?: () => void;
  showRemove?: boolean;
}

export function ColorCard({ color, onRemove, showRemove = false }: ColorCardProps) {
  const contrastColor = getContrastColor(color.hex);
  const rgb = toRgb(color.hex);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} 복사됨`);
    } catch {
      toast.error("복사 실패");
    }
  };

  return (
    <div
      className="relative group rounded-lg overflow-hidden shadow-sm border transition-transform hover:scale-105"
      style={{ backgroundColor: color.hex }}
    >
      {/* Remove button */}
      {showRemove && onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40"
          onClick={onRemove}
        >
          <X className="h-3 w-3" style={{ color: contrastColor }} />
        </Button>
      )}

      {/* Color display area */}
      <div className="h-20 sm:h-24" />

      {/* Color info */}
      <div
        className="p-2 space-y-1 text-xs font-mono"
        style={{ color: contrastColor }}
      >
        {/* HEX */}
        <button
          className="flex items-center justify-between w-full hover:opacity-80 transition-opacity"
          onClick={() => copyToClipboard(color.hex, "HEX")}
        >
          <span className="uppercase">{color.hex}</span>
          <Copy className="h-3 w-3 opacity-50" />
        </button>

        {/* RGB */}
        <button
          className="flex items-center justify-between w-full hover:opacity-80 transition-opacity text-[10px] opacity-70"
          onClick={() =>
            copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")
          }
        >
          <span>
            {rgb.r}, {rgb.g}, {rgb.b}
          </span>
          <Copy className="h-3 w-3 opacity-50" />
        </button>
      </div>
    </div>
  );
}
