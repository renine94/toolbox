"use client";

import { Button } from "@/shared/ui/button";
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
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
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
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
      </Button>

      {/* 다시 실행 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={redo}
        disabled={!canRedo()}
        title="다시 실행 (Ctrl+Y)"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
          />
        </svg>
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
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        초기화
      </Button>
    </div>
  );
}
