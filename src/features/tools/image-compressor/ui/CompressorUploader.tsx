"use client";

import { useCallback } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useCompressorStore } from "../model/useCompressorStore";
import { FILE_LIMITS } from "../model/types";

export function CompressorUploader() {
  const t = useTranslations("tools.imageCompressor.ui.upload");
  const tToast = useTranslations("tools.imageCompressor.toast");
  const addImages = useCompressorStore((state) => state.addImages);
  const images = useCompressorStore((state) => state.images);

  const remainingSlots = FILE_LIMITS.maxFiles - images.length;

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      try {
        const result = await addImages(fileArray);

        if (result.failures.length > 0) {
          result.failures.forEach((failure) => {
            const errorKey = failure.error as
              | "fileTooLarge"
              | "unsupportedFormat"
              | "dimensionTooLarge"
              | "loadError";
            toast.error(`${failure.fileName}: ${tToast(errorKey)}`);
          });
        }

        if (result.successCount > 0) {
          toast.success(
            `${result.successCount}${tToast("filesCount")} ${tToast("uploadSuccess")}`
          );
        }
      } catch (error) {
        if (error instanceof Error && error.message === "maxFilesReached") {
          toast.error(tToast("maxFilesReached"));
        } else {
          toast.error(tToast("loadError"));
        }
      }
    },
    [addImages, tToast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = "";
    },
    [handleFiles]
  );

  if (remainingSlots <= 0) {
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
          multiple
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
              remaining: remainingSlots,
              max: FILE_LIMITS.maxFiles,
            })}
          </p>
          <Button type="button" variant="outline" size="sm">
            {t("selectFiles")}
          </Button>
        </div>
      </label>
    </Card>
  );
}
