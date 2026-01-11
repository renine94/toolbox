"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useConverterStore } from "../model/useConverterStore";
import { FILE_LIMITS } from "../model/types";
import { ConverterUploader } from "./ConverterUploader";
import { ImagePreview } from "./ImagePreview";
import { ConversionSettings } from "./ConversionSettings";
import { ConversionProgress } from "./ConversionProgress";
import { ConversionResult } from "./ConversionResult";

export function ImageConverter() {
  const t = useTranslations("tools.imageConverter.ui");
  const tToast = useTranslations("tools.imageConverter.toast");
  const { images, isConverting, addImages, reset } = useConverterStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasImages = images.length > 0;
  const hasCompleted = images.some((img) => img.status === "completed");

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      await addImages(Array.from(files));
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "maxFilesReached") {
          toast.error(tToast("maxFilesReached"));
        } else {
          toast.error(tToast("loadError"));
        }
      }
    }

    e.target.value = "";
  };

  const handleReset = () => {
    reset();
    toast.success(t("reset.success"));
  };

  return (
    <div className="space-y-6">
      {/* 숨겨진 파일 입력 (추가 업로드용) */}
      <input
        ref={fileInputRef}
        type="file"
        accept={FILE_LIMITS.supportedTypes.join(",")}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 초기화 버튼 */}
      {hasImages && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isConverting}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t("reset.button")}
          </Button>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      {!hasImages ? (
        // 업로드 영역만 표시
        <ConverterUploader />
      ) : (
        // 이미지가 있으면 그리드 레이아웃
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          {/* 왼쪽: 이미지 미리보기 + 결과 */}
          <div className="space-y-6">
            <ImagePreview onAddMore={handleAddMore} />
            <ConversionProgress />
            {hasCompleted && <ConversionResult />}
          </div>

          {/* 오른쪽: 설정 패널 */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <ConversionSettings />
          </div>
        </div>
      )}
    </div>
  );
}
