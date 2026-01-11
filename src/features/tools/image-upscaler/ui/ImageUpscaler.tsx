"use client";

import { useUpscaleStore } from "../model/useUpscaleStore";
import { UpscaleUploader } from "./UpscaleUploader";
import { UpscalePreview } from "./UpscalePreview";
import { UpscaleControls } from "./UpscaleControls";
import { UpscaleExportPanel } from "./UpscaleExportPanel";

export function ImageUpscaler() {
  const { originalImage, upscaledImage } = useUpscaleStore();

  // 이미지가 없으면 업로더 표시
  if (!originalImage) {
    return <UpscaleUploader />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 왼쪽: 미리보기 (원본 vs 업스케일) */}
      <div className="lg:col-span-2">
        <UpscalePreview />
      </div>

      {/* 오른쪽: 컨트롤 패널 */}
      <div className="space-y-4">
        <UpscaleControls />
        {upscaledImage && <UpscaleExportPanel />}
      </div>
    </div>
  );
}
