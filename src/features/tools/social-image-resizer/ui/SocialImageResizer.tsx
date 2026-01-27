"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { RotateCcw } from "lucide-react";

import { ImageUploader } from "./ImageUploader";
import { ResizePreview } from "./ResizePreview";
import { PlatformPresets } from "./PlatformPresets";
import { DownloadSection } from "./DownloadSection";
import { useResizerStore } from "../model/useResizerStore";

export function SocialImageResizer() {
  const t = useTranslations("tools.socialImageResizer.ui");
  const reset = useResizerStore((state) => state.reset);
  const originalImage = useResizerStore((state) => state.originalImage);
  const isResizing = useResizerStore((state) => state.isResizing);

  return (
    <div className="space-y-6">
      {/* 상단 컨트롤 */}
      {originalImage && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={isResizing}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t("reset")}
          </Button>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 왼쪽: 이미지 업로드 & 미리보기 */}
        <div className="lg:col-span-1 space-y-6">
          <ImageUploader />
          <ResizePreview />
          <DownloadSection />
        </div>

        {/* 오른쪽: 플랫폼 프리셋 선택 */}
        <div className="lg:col-span-2">
          <PlatformPresets />
        </div>
      </div>
    </div>
  );
}
