"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { X, RefreshCw } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useResizerStore } from "../model/useResizerStore";
import { formatFileSize } from "../lib/resize-utils";

export function ResizePreview() {
  const t = useTranslations("tools.socialImageResizer.ui.preview");
  const originalImage = useResizerStore((state) => state.originalImage);
  const clearImage = useResizerStore((state) => state.clearImage);
  const isResizing = useResizerStore((state) => state.isResizing);

  if (!originalImage) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("title")}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearImage}
            disabled={isResizing}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <Image
            src={originalImage.dataUrl}
            alt={originalImage.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("fileName")}</span>
            <span className="font-medium truncate max-w-[200px]">
              {originalImage.name}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("originalSize")}</span>
            <span className="font-medium">
              {originalImage.dimensions.width} x {originalImage.dimensions.height}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("fileSize")}</span>
            <span className="font-medium">{formatFileSize(originalImage.size)}</span>
          </div>
        </div>

        {/* 새 이미지 업로드 버튼 */}
        <div className="mt-4">
          <label className="w-full cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const store = useResizerStore.getState();
                  store.setImage(file);
                }
                e.target.value = "";
              }}
              disabled={isResizing}
            />
            <div className={`flex items-center justify-center gap-2 w-full h-10 px-4 py-2 rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${isResizing ? "opacity-50 cursor-not-allowed" : ""}`}>
              <RefreshCw className="h-4 w-4" />
              {t("changeImage")}
            </div>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
