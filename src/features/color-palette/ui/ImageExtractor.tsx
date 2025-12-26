"use client";

import { useState, useRef } from "react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { extractColors } from "../lib/extract";
import { usePaletteStore } from "../model/usePaletteStore";

export function ImageExtractor() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setHarmonyType, addCustomColor, clearCustomColors } = usePaletteStore();

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Extract colors
    setIsExtracting(true);
    try {
      const colors = await extractColors(file, 5);
      setExtractedColors(colors);
      toast.success(`${colors.length}개 색상이 추출되었습니다`);
    } catch (err) {
      toast.error("색상 추출에 실패했습니다");
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleApplyColors = () => {
    if (extractedColors.length === 0) {
      toast.error("추출된 색상이 없습니다");
      return;
    }

    setHarmonyType("custom");
    clearCustomColors();
    extractedColors.forEach((color) => addCustomColor(color));
    toast.success("팔레트에 적용되었습니다");
  };

  const handleClear = () => {
    setPreview(null);
    setExtractedColors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">이미지에서 추출</Label>

      {!preview ? (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            이미지를 드래그하거나 클릭해서 업로드
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview */}
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 bg-black/50 hover:bg-black/70"
              onClick={handleClear}
            >
              <X className="h-3 w-3 text-white" />
            </Button>
          </div>

          {/* Extracted colors */}
          {extractedColors.length > 0 && (
            <div className="flex gap-1">
              {extractedColors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 h-8 rounded first:rounded-l-lg last:rounded-r-lg"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}

          {/* Apply button */}
          <Button
            onClick={handleApplyColors}
            disabled={isExtracting || extractedColors.length === 0}
            className="w-full"
            size="sm"
          >
            {isExtracting ? "추출 중..." : "팔레트에 적용"}
          </Button>
        </div>
      )}
    </div>
  );
}
