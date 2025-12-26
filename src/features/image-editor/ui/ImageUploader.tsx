"use client";

import { useCallback, useRef } from "react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useImageStore } from "../model/useImageStore";

export function ImageUploader() {
  const { loadImage, isLoading } = useImageStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          await loadImage(file);
        } catch {
          // 에러 처리는 스토어에서 처리됨
        }
      }
    },
    [loadImage]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        try {
          await loadImage(file);
        } catch {
          // 에러 처리는 스토어에서 처리됨
        }
      }
    },
    [loadImage]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <Card
      className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold mb-2">이미지 업로드</h3>
        <p className="text-sm text-muted-foreground mb-4">
          이미지를 드래그하여 놓거나 클릭하여 선택하세요
        </p>
        <p className="text-xs text-muted-foreground/70 mb-4">
          PNG, JPG, WEBP, GIF 지원 (최대 10MB)
        </p>

        <Button variant="outline" disabled={isLoading}>
          {isLoading ? "로딩 중..." : "파일 선택"}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </Card>
  );
}
