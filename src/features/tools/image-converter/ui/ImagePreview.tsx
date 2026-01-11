"use client";

import { useTranslations } from "next-intl";
import {
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useConverterStore } from "../model/useConverterStore";
import { formatFileSize, formatDimensions } from "../lib/converter-utils";
import type { ImageStatus } from "../model/types";

function StatusBadge({ status }: { status: ImageStatus }) {
  const t = useTranslations("tools.imageConverter.ui.preview.status");

  const config: Record<
    ImageStatus,
    {
      icon: typeof Clock;
      label: string;
      variant: "default" | "secondary" | "destructive";
      animate?: boolean;
      className?: string;
    }
  > = {
    pending: {
      icon: Clock,
      label: t("pending"),
      variant: "secondary",
    },
    converting: {
      icon: Loader2,
      label: t("converting"),
      variant: "default",
      animate: true,
    },
    completed: {
      icon: CheckCircle,
      label: t("completed"),
      variant: "default",
      className: "bg-green-500 hover:bg-green-600",
    },
    error: {
      icon: AlertCircle,
      label: t("error"),
      variant: "destructive",
    },
  };

  const { icon: Icon, label, variant, animate, className } = config[status];

  return (
    <Badge variant={variant} className={className}>
      <Icon className={`w-3 h-3 mr-1 ${animate ? "animate-spin" : ""}`} />
      {label}
    </Badge>
  );
}

interface ImagePreviewProps {
  onAddMore: () => void;
}

export function ImagePreview({ onAddMore }: ImagePreviewProps) {
  const t = useTranslations("tools.imageConverter.ui.preview");
  const { images, removeImage, clearImages, isConverting } = useConverterStore();

  if (images.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {t("title")}
            <Badge variant="outline">{t("fileCount", { count: images.length })}</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddMore}
              disabled={isConverting}
            >
              <Plus className="w-4 h-4 mr-1" />
              {t("addMore")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearImages}
              disabled={isConverting}
            >
              {t("clearAll")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group rounded-lg border bg-card overflow-hidden"
            >
              {/* 썸네일 */}
              <div className="aspect-square relative bg-muted">
                <img
                  src={image.dataUrl}
                  alt={image.name}
                  className="absolute inset-0 w-full h-full object-contain"
                />
                {/* 삭제 버튼 */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(image.id)}
                  disabled={isConverting}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              {/* 정보 */}
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="text-sm font-medium truncate flex-1"
                    title={image.name}
                  >
                    {image.name}
                  </p>
                  <StatusBadge status={image.status} />
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{image.originalFormat}</span>
                  <span>•</span>
                  <span>{formatFileSize(image.size)}</span>
                  <span>•</span>
                  <span>{formatDimensions(image.dimensions)}</span>
                </div>

                {image.error && (
                  <p className="text-xs text-destructive">{image.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
