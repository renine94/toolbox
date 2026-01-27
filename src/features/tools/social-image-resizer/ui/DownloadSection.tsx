"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Download, Loader2, XCircle, Package, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useResizerStore } from "../model/useResizerStore";
import { PLATFORM_INFO } from "../model/types";
import { getPresetById, formatPresetName, formatPresetSize } from "../lib/platform-presets";
import { formatFileSize } from "../lib/resize-utils";

export function DownloadSection() {
  const t = useTranslations("tools.socialImageResizer.ui.download");
  const tToast = useTranslations("tools.socialImageResizer.toast");
  const tPlatforms = useTranslations("tools.socialImageResizer.platforms");
  const tPresetNames = useTranslations("tools.socialImageResizer.presetNames");

  const originalImage = useResizerStore((state) => state.originalImage);
  const selectedPresets = useResizerStore((state) => state.selectedPresets);
  const resizedImages = useResizerStore((state) => state.resizedImages);
  const isResizing = useResizerStore((state) => state.isResizing);
  const currentPresetIndex = useResizerStore((state) => state.currentPresetIndex);
  const totalPresets = useResizerStore((state) => state.totalPresets);
  const resizeAll = useResizerStore((state) => state.resizeAll);
  const cancelResize = useResizerStore((state) => state.cancelResize);
  const downloadSingle = useResizerStore((state) => state.downloadSingle);
  const downloadAll = useResizerStore((state) => state.downloadAll);

  const completedCount = useMemo(() => {
    let count = 0;
    resizedImages.forEach((img) => {
      if (img.status === "completed") count++;
    });
    return count;
  }, [resizedImages]);

  const progress = useMemo(() => {
    if (!isResizing || totalPresets === 0) return 0;
    return Math.round(((currentPresetIndex + 1) / totalPresets) * 100);
  }, [isResizing, currentPresetIndex, totalPresets]);

  const handleResizeAll = async () => {
    await resizeAll();
    const state = useResizerStore.getState();
    let completed = 0;
    state.resizedImages.forEach((img) => {
      if (img.status === "completed") completed++;
    });
    if (completed > 0) {
      toast.success(tToast("resizeComplete", { count: completed }));
    }
  };

  const handleDownloadAll = async () => {
    await downloadAll();
    toast.success(tToast("downloadComplete"));
  };

  const handleDownloadSingle = (presetId: string) => {
    downloadSingle(presetId);
    toast.success(tToast("downloaded"));
  };

  // 이미지가 없으면 표시하지 않음
  if (!originalImage) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("title")}</CardTitle>
          <Badge variant="secondary">
            {t("completedCount", { count: completedCount })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 리사이즈 버튼 */}
        <div className="flex gap-2">
          {isResizing ? (
            <>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={cancelResize}
              >
                {t("cancel")}
              </Button>
              <div className="flex-1 space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {t("processing", {
                    current: currentPresetIndex + 1,
                    total: totalPresets,
                  })}
                </p>
              </div>
            </>
          ) : (
            <>
              <Button
                className="flex-1"
                onClick={handleResizeAll}
                disabled={selectedPresets.size === 0}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {t("resizeButton", { count: selectedPresets.size })}
              </Button>
              {completedCount > 0 && (
                <Button
                  variant="secondary"
                  onClick={handleDownloadAll}
                >
                  <Package className="h-4 w-4 mr-2" />
                  {t("downloadAll")}
                </Button>
              )}
            </>
          )}
        </div>

        {/* 리사이즈된 이미지 목록 */}
        {resizedImages.size > 0 && (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {Array.from(selectedPresets).map((presetId) => {
                const preset = getPresetById(presetId);
                const resized = resizedImages.get(presetId);

                if (!preset) return null;

                const platformInfo = PLATFORM_INFO[preset.platform];

                return (
                  <div
                    key={presetId}
                    className="flex items-center gap-4 p-3 rounded-lg border"
                  >
                    {/* 썸네일 */}
                    <div className="relative w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      {resized?.status === "completed" && resized.dataUrl ? (
                        <Image
                          src={resized.dataUrl}
                          alt={preset.name}
                          fill
                          className="object-cover"
                        />
                      ) : resized?.status === "resizing" ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : resized?.status === "error" ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <XCircle className="h-6 w-6 text-destructive" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded bg-border" />
                        </div>
                      )}
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: platformInfo.color }}
                        />
                        <p className="font-medium text-sm truncate">
                          {tPlatforms(platformInfo.nameKey)} - {tPresetNames(preset.nameKey)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatPresetSize(preset)}
                        {resized?.status === "completed" &&
                          ` (${formatFileSize(resized.size)})`}
                      </p>
                    </div>

                    {/* 상태 / 다운로드 버튼 */}
                    <div className="flex-shrink-0">
                      {resized?.status === "completed" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadSingle(presetId)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      ) : resized?.status === "resizing" ? (
                        <Badge variant="secondary">
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          {t("resizing")}
                        </Badge>
                      ) : resized?.status === "error" ? (
                        <Badge variant="destructive">{t("error")}</Badge>
                      ) : (
                        <Badge variant="outline">{t("pending")}</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* 빈 상태 */}
        {resizedImages.size === 0 && selectedPresets.size > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t("readyToResize", { count: selectedPresets.size })}</p>
          </div>
        )}

        {selectedPresets.size === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t("selectPresetsHint")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
