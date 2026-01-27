"use client";

import { useCallback } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useResizerStore } from "../model/useResizerStore";
import { FILE_LIMITS } from "../model/types";

export function ImageUploader() {
  const t = useTranslations("tools.socialImageResizer.ui.upload");
  const tToast = useTranslations("tools.socialImageResizer.toast");
  const setImage = useResizerStore((state) => state.setImage);
  const originalImage = useResizerStore((state) => state.originalImage);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;

      const result = await setImage(file);

      if (!result.success && result.failure) {
        const errorKey = result.failure.error as
          | "fileTooLarge"
          | "unsupportedFormat"
          | "dimensionTooLarge"
          | "loadError";
        toast.error(tToast(errorKey));
      } else if (result.success) {
        toast.success(tToast("uploadSuccess"));
      }
    },
    [setImage, tToast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      handleFile(file || null);
      e.target.value = "";
    },
    [handleFile]
  );

  // 이미지가 있으면 표시하지 않음
  if (originalImage) {
    return null;
  }

  return (
    <Card
      className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
        <input
          type="file"
          accept={FILE_LIMITS.supportedTypes.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{t("title")}</h3>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            <span>{t("formats")}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("limits", {
              maxSize: FILE_LIMITS.maxSizeMB,
              maxDimension: FILE_LIMITS.maxDimension,
            })}
          </p>
          <Button type="button" variant="outline" size="sm">
            {t("selectFile")}
          </Button>
        </div>
      </label>
    </Card>
  );
}
