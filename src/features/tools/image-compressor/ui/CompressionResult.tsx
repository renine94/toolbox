"use client";

import { useTranslations } from "next-intl";
import {
  Download,
  FileArchive,
  ArrowDown,
  AlertTriangle,
  Check,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";

import { useCompressorStore } from "../model/useCompressorStore";
import {
  formatFileSize,
  formatDimensions,
  calculateSizeReduction,
} from "../lib/compressor-utils";

export function CompressionResult() {
  const t = useTranslations("tools.imageCompressor.ui.result");

  const images = useCompressorStore((state) => state.images);
  const downloadSingle = useCompressorStore((state) => state.downloadSingle);
  const downloadAll = useCompressorStore((state) => state.downloadAll);

  const completedImages = images.filter(
    (img) => img.status === "completed" && img.compressedDataUrl
  );

  if (completedImages.length === 0) {
    return null;
  }

  // 총 절감량 계산
  const totalOriginal = completedImages.reduce((sum, img) => sum + img.size, 0);
  const totalCompressed = completedImages.reduce(
    (sum, img) => sum + (img.compressedSize || 0),
    0
  );
  const totalReduction = calculateSizeReduction(totalOriginal, totalCompressed);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Check className="h-5 w-5 text-green-500" />
            {t("title")}
            <Badge variant="secondary" className="ml-2">
              {t("completedCount", { count: completedImages.length })}
            </Badge>
          </CardTitle>
          {completedImages.length > 1 && (
            <Button onClick={downloadAll} size="sm" className="gap-2">
              <FileArchive className="h-4 w-4" />
              {t("downloadAll")}
            </Button>
          )}
        </div>

        {/* 총 절감량 요약 */}
        <div className="flex items-center gap-4 mt-4 p-3 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400">
          <ArrowDown className="h-5 w-5" />
          <div className="text-sm">
            <span className="font-medium">{t("totalSaved")}:</span>{" "}
            {formatFileSize(totalReduction.savedBytes)} (
            {totalReduction.savedPercent}% {t("reduction")})
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completedImages.map((image) => {
            const reduction = calculateSizeReduction(
              image.size,
              image.compressedSize || 0
            );

            return (
              <div
                key={image.id}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card"
              >
                {/* 비교 이미지 */}
                <div className="flex gap-2">
                  {/* 원본 */}
                  <div className="space-y-1">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted">
                      <img
                        src={image.dataUrl}
                        alt={`${image.name} (original)`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                        {t("original")}
                      </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      {formatFileSize(image.size)}
                    </p>
                  </div>

                  {/* 화살표 */}
                  <div className="flex items-center">
                    <ArrowDown className="h-4 w-4 text-muted-foreground rotate-[-90deg]" />
                  </div>

                  {/* 압축 */}
                  <div className="space-y-1">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted">
                      <img
                        src={image.compressedDataUrl}
                        alt={`${image.name} (compressed)`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[10px] text-center py-0.5">
                        {t("compressed")}
                      </div>
                    </div>
                    <p className="text-xs text-center font-medium text-green-600 dark:text-green-400">
                      {formatFileSize(image.compressedSize || 0)}
                    </p>
                  </div>
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{image.name}</p>
                    {image.targetNotReached && (
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-600"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {t("targetNotReached")}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("reduction")}:
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        -{reduction.savedPercent}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("quality")}:
                      </span>
                      <span className="font-medium">{image.actualQuality}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("dimensions")}:
                      </span>
                      <span>
                        {formatDimensions(image.compressedDimensions || image.dimensions)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("saved")}:
                      </span>
                      <span className="font-medium">
                        {formatFileSize(reduction.savedBytes)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 다운로드 버튼 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadSingle(image.id)}
                  className="flex-shrink-0 gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t("download")}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
