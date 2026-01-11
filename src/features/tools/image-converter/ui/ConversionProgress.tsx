"use client";

import { useTranslations } from "next-intl";
import { Loader2, StopCircle } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { useConverterStore } from "../model/useConverterStore";

export function ConversionProgress() {
  const t = useTranslations("tools.imageConverter.ui.progress");
  const { images, isConverting, currentImageIndex, cancelConversion } =
    useConverterStore();

  if (!isConverting) return null;

  const totalCount = images.filter(
    (img) => img.status === "pending" || img.status === "converting"
  ).length;
  const completedCount = images.filter(
    (img) => img.status === "completed"
  ).length;
  const progress =
    totalCount > 0 ? Math.round((completedCount / images.length) * 100) : 0;

  const currentImage =
    currentImageIndex >= 0
      ? images.find((img) => img.status === "converting")
      : null;

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="font-medium">{t("title")}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={cancelConversion}
              className="text-destructive hover:text-destructive"
            >
              <StopCircle className="w-4 h-4 mr-1" />
              {t("cancel")}
            </Button>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {t("processing", {
                current: completedCount + 1,
                total: images.length,
              })}
            </span>
            <span>{progress}%</span>
          </div>

          {currentImage && (
            <p className="text-sm truncate text-muted-foreground">
              {t("currentFile")}: {currentImage.name}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
