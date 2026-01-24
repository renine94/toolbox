"use client";

import { useCallback, useRef } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useConverterStore } from "../model/useConverterStore";
import { FILE_LIMITS } from "../model/types";

export function ConverterUploader() {
  const t = useTranslations("tools.imageConverter.ui.upload");
  const tToast = useTranslations("tools.imageConverter.toast");
  const inputRef = useRef<HTMLInputElement>(null);
  const { addImages, images } = useConverterStore();

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      try {
        const result = await addImages(Array.from(files));

        // 실패한 파일이 있으면 에러 타입별로 toast 표시
        if (result.failures.length > 0) {
          // 에러 타입별로 그룹화
          const errorGroups = result.failures.reduce(
            (acc, failure) => {
              acc[failure.error] = (acc[failure.error] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          );

          // 각 에러 타입에 대해 toast 표시
          Object.entries(errorGroups).forEach(([errorType, count]) => {
            const message =
              count > 1
                ? `${tToast(errorType)} (${count}${tToast("filesCount")})`
                : tToast(errorType);
            toast.error(message);
          });
        }
      } catch (error) {
        // maxFilesReached는 여전히 throw됨
        if (error instanceof Error) {
          if (error.message === "maxFilesReached") {
            toast.error(tToast("maxFilesReached"));
          } else {
            toast.error(tToast("loadError"));
          }
        }
      }
    },
    [addImages, tToast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // 같은 파일 재선택 가능하도록 초기화
    e.target.value = "";
  };

  const remainingSlots = FILE_LIMITS.maxFiles - images.length;

  return (
    <Card
      className="p-6 border-2 border-dashed cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/30"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={FILE_LIMITS.supportedTypes.join(",")}
        multiple
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="p-4 rounded-full bg-primary/10">
          <Upload className="w-8 h-8 text-primary" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ImageIcon className="w-3 h-3" />
            <span>{t("formats")}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {t("limits", {
            maxSize: FILE_LIMITS.maxSizeMB,
            maxDimension: FILE_LIMITS.maxDimension,
            remaining: remainingSlots,
            max: FILE_LIMITS.maxFiles,
          })}
        </p>

        <Button variant="outline" size="sm" type="button">
          {t("selectFiles")}
        </Button>
      </div>
    </Card>
  );
}
