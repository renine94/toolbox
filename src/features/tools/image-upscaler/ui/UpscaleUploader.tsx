"use client";

import { useCallback, useRef } from "react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUpscaleStore } from "../model/useUpscaleStore";
import { toast } from "sonner";

export function UpscaleUploader() {
  const { loadImage, isLoading } = useUpscaleStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("tools.imageUpscaler.ui.upload");
  const tToast = useTranslations("tools.imageUpscaler.ui.toast");

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          await loadImage(file);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "loadError";
          toast.error(tToast(errorMessage as Parameters<typeof tToast>[0]));
        }
      }
    },
    [loadImage, tToast]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        try {
          await loadImage(file);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "loadError";
          toast.error(tToast(errorMessage as Parameters<typeof tToast>[0]));
        }
      }
    },
    [loadImage, tToast]
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

        <h3 className="text-lg font-semibold mb-2">{t("title")}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t("description")}</p>
        <p className="text-xs text-muted-foreground/70 mb-4">{t("formats")}</p>

        <Button variant="outline" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("loading")}
            </>
          ) : (
            t("selectFile")
          )}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </Card>
  );
}
