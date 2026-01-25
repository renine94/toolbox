"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Play, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { useCompressorStore } from "../model/useCompressorStore";
import { CompressorUploader } from "./CompressorUploader";
import { CompressionModeSelector } from "./CompressionModeSelector";
import { ImagePreviewList } from "./ImagePreviewList";
import { CompressionProgress } from "./CompressionProgress";
import { CompressionResult } from "./CompressionResult";

export function ImageCompressor() {
  const t = useTranslations("tools.imageCompressor.ui");
  const tToast = useTranslations("tools.imageCompressor.toast");

  const images = useCompressorStore((state) => state.images);
  const isCompressing = useCompressorStore((state) => state.isCompressing);
  const compressAll = useCompressorStore((state) => state.compressAll);
  const reset = useCompressorStore((state) => state.reset);

  const pendingImages = images.filter(
    (img) => img.status === "pending" || img.status === "error"
  );
  const completedImages = images.filter((img) => img.status === "completed");

  const handleCompress = async () => {
    try {
      await compressAll();
      toast.success(tToast("compressionComplete"));
    } catch {
      toast.error(tToast("compressionError"));
    }
  };

  const handleReset = () => {
    reset();
    toast.success(t("reset.success"));
  };

  return (
    <div className="space-y-6">
      {/* 상단 영역: 업로드 또는 설정 */}
      {images.length === 0 ? (
        <CompressorUploader />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* 왼쪽: 이미지 목록 & 결과 */}
          <div className="space-y-6">
            <ImagePreviewList />
            <CompressionProgress />
            <CompressionResult />
          </div>

          {/* 오른쪽: 설정 & 액션 버튼 */}
          <div className="space-y-6">
            <CompressionModeSelector />

            {/* 액션 버튼 */}
            <div className="flex flex-col gap-3">
              {pendingImages.length > 0 && (
                <Button
                  onClick={handleCompress}
                  disabled={isCompressing}
                  size="lg"
                  className="w-full gap-2"
                >
                  <Play className="h-4 w-4" />
                  {t("settings.compressButton", { count: pendingImages.length })}
                </Button>
              )}

              {(completedImages.length > 0 || images.length > 0) && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isCompressing}
                  className="w-full gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t("reset.button")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
