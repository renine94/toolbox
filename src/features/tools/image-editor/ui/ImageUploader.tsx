"use client";

import { useCallback, useRef } from "react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
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
          <ImagePlus className="w-8 h-8 text-muted-foreground" />
        </div>

        <h3 className="text-lg font-semibold mb-2">이미지 업로드</h3>
        <p className="text-sm text-muted-foreground mb-4">
          이미지를 드래그하여 놓거나 클릭하여 선택하세요
        </p>
        <p className="text-xs text-muted-foreground/70 mb-4">
          PNG, JPG, WEBP, GIF 지원 (최대 10MB)
        </p>

        <Button variant="outline" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              로딩 중...
            </>
          ) : (
            "파일 선택"
          )}
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
