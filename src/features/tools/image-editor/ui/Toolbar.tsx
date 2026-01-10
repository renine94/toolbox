"use client";

import { Button } from "@/shared/ui/button";
import { ImagePlus, Undo2, Redo2, RotateCcw } from "lucide-react";
import { useImageStore } from "../model/useImageStore";

export function Toolbar() {
  const { originalImage, reset, undo, redo, canUndo, canRedo, loadImage } = useImageStore();

  const handleNewImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await loadImage(file);
      }
    };
    input.click();
  };

  if (!originalImage) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
      {/* 새 이미지 */}
      <Button variant="outline" size="sm" onClick={handleNewImage}>
        <ImagePlus className="w-4 h-4 mr-2" />
        새 이미지
      </Button>

      <div className="w-px h-6 bg-border" />

      {/* 실행 취소 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={undo}
        disabled={!canUndo()}
        title="실행 취소 (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </Button>

      {/* 다시 실행 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={redo}
        disabled={!canRedo()}
        title="다시 실행 (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border" />

      {/* 초기화 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={reset}
        className="text-destructive hover:text-destructive"
        title="모든 편집 초기화"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        초기화
      </Button>
    </div>
  );
}
