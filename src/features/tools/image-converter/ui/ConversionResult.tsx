"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Download,
  FolderArchive,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useConverterStore } from "../model/useConverterStore";
import {
  formatFileSize,
  formatDimensions,
  calculateSizeSaved,
} from "../lib/converter-utils";

export function ConversionResult() {
  const t = useTranslations("tools.imageConverter.ui.result");
  const tToast = useTranslations("tools.imageConverter.toast");
  const { images, options, downloadSingle, downloadAll } = useConverterStore();

  const completedImages = images.filter(
    (img) => img.status === "completed" && img.convertedDataUrl
  );

  if (completedImages.length === 0) return null;

  const handleDownloadAll = async () => {
    try {
      await downloadAll();
      toast.success(tToast("downloadComplete"));
    } catch {
      toast.error(tToast("downloadError"));
    }
  };

  const handleDownloadSingle = (id: string) => {
    downloadSingle(id);
    toast.success(tToast("downloadComplete"));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {t("title")}
            <Badge variant="secondary">
              {t("completedCount", { count: completedImages.length })}
            </Badge>
          </CardTitle>
          {completedImages.length > 1 && (
            <Button variant="default" size="sm" onClick={handleDownloadAll}>
              <FolderArchive className="w-4 h-4 mr-2" />
              {t("downloadAll")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {completedImages.map((image) => {
            const { savedBytes, savedPercent } = calculateSizeSaved(
              image.size,
              image.convertedSize || 0
            );
            const isSaved = savedBytes > 0;

            return (
              <div
                key={image.id}
                className="flex items-center gap-4 p-3 rounded-lg border bg-card"
              >
                {/* 썸네일 */}
                <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-muted">
                  <img
                    src={image.convertedDataUrl}
                    alt={image.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium truncate">{image.name}</p>

                  {/* 변환 정보 */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{image.originalFormat}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="font-medium text-foreground">
                      {options.outputFormat.toUpperCase()}
                    </span>
                  </div>

                  {/* 크기 비교 */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="text-muted-foreground">
                      {t("original")}: {formatFileSize(image.size)} (
                      {formatDimensions(image.dimensions)})
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span>
                      {t("converted")}:{" "}
                      {formatFileSize(image.convertedSize || 0)}
                      {image.convertedDimensions &&
                        ` (${formatDimensions(image.convertedDimensions)})`}
                    </span>
                    {/* 크기 변화 */}
                    {savedPercent !== 0 && (
                      <Badge
                        variant={isSaved ? "default" : "secondary"}
                        className={
                          isSaved
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-orange-500 hover:bg-orange-600"
                        }
                      >
                        {isSaved ? (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        )}
                        {isSaved ? "-" : "+"}
                        {Math.abs(savedPercent)}%
                      </Badge>
                    )}
                  </div>
                </div>

                {/* 다운로드 버튼 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadSingle(image.id)}
                >
                  <Download className="w-4 h-4" />
                  <span className="sr-only">{t("downloadSingle")}</span>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
