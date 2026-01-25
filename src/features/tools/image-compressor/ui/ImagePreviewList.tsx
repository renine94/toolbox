"use client";

import { useTranslations } from "next-intl";
import { X, ImageIcon, Loader2, Check, AlertCircle, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

import { useCompressorStore } from "../model/useCompressorStore";
import { formatFileSize, formatDimensions } from "../lib/compressor-utils";
import { FILE_LIMITS, type ImageStatus } from "../model/types";

function StatusBadge({ status }: { status: ImageStatus }) {
  const t = useTranslations("tools.imageCompressor.ui.preview.status");

  const variants: Record<
    ImageStatus,
    { variant: "secondary" | "default" | "destructive"; icon: React.ReactNode }
  > = {
    pending: { variant: "secondary", icon: null },
    compressing: {
      variant: "default",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
    },
    completed: {
      variant: "default",
      icon: <Check className="h-3 w-3" />,
    },
    error: {
      variant: "destructive",
      icon: <AlertCircle className="h-3 w-3" />,
    },
  };

  const { variant, icon } = variants[status];

  return (
    <Badge variant={variant} className="text-xs gap-1">
      {icon}
      {t(status)}
    </Badge>
  );
}

export function ImagePreviewList() {
  const t = useTranslations("tools.imageCompressor.ui.preview");
  const images = useCompressorStore((state) => state.images);
  const removeImage = useCompressorStore((state) => state.removeImage);
  const clearImages = useCompressorStore((state) => state.clearImages);
  const isCompressing = useCompressorStore((state) => state.isCompressing);

  if (images.length === 0) {
    return null;
  }

  const remainingSlots = FILE_LIMITS.maxFiles - images.length;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="h-5 w-5" />
            {t("title")}
            <Badge variant="secondary" className="ml-2">
              {t("fileCount", { count: images.length })}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearImages}
            disabled={isCompressing}
            className="text-destructive hover:text-destructive"
          >
            {t("clearAll")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card"
            >
              {/* 썸네일 */}
              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                <img
                  src={image.dataUrl}
                  alt={image.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* 이미지 정보 */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{image.name}</p>
                  <StatusBadge status={image.status} />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{image.originalFormat}</span>
                  <span>•</span>
                  <span>{formatDimensions(image.dimensions)}</span>
                  <span>•</span>
                  <span>{formatFileSize(image.size)}</span>
                </div>
                {image.error && (
                  <p className="text-xs text-destructive">{image.error}</p>
                )}
              </div>

              {/* 삭제 버튼 */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeImage(image.id)}
                disabled={isCompressing}
                className="flex-shrink-0 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* 추가 업로드 영역 */}
          {remainingSlots > 0 && !isCompressing && (
            <label className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer text-muted-foreground hover:text-foreground">
              <input
                type="file"
                accept={FILE_LIMITS.supportedTypes.join(",")}
                multiple
                onChange={async (e) => {
                  if (e.target.files) {
                    const addImages = useCompressorStore.getState().addImages;
                    await addImages(Array.from(e.target.files));
                    e.target.value = "";
                  }
                }}
                className="hidden"
              />
              <Plus className="h-4 w-4" />
              <span className="text-sm">{t("addMore")}</span>
            </label>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
