"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";

import { useCompressorStore } from "../model/useCompressorStore";

export function CompressionProgress() {
  const t = useTranslations("tools.imageCompressor.ui.progress");

  const images = useCompressorStore((state) => state.images);
  const isCompressing = useCompressorStore((state) => state.isCompressing);
  const currentImageIndex = useCompressorStore(
    (state) => state.currentImageIndex
  );
  const cancelCompression = useCompressorStore(
    (state) => state.cancelCompression
  );

  if (!isCompressing) {
    return null;
  }

  const pendingImages = images.filter(
    (img) => img.status === "pending" || img.status === "compressing" || img.status === "error"
  );
  const current = currentImageIndex + 1;
  const total = pendingImages.length;
  const progress = total > 0 ? (current / total) * 100 : 0;

  const currentImage = pendingImages[currentImageIndex];

  return (
    <Card className="border-primary">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="font-medium">{t("title")}</span>
            </div>
            <Button variant="outline" size="sm" onClick={cancelCompression}>
              {t("cancel")}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t("processing", { current, total })}
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {currentImage && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{t("currentFile")}:</span>{" "}
              {currentImage.name}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
