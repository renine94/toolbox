"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUpscaleStore } from "../model/useUpscaleStore";
import {
  scaleOptions,
  algorithmOptions,
  type ScaleOption,
  type AlgorithmOption,
} from "../model/types";
import { formatDimensions, estimateProcessingTime } from "../lib/upscale-utils";
import { toast } from "sonner";

export function UpscaleControls() {
  const {
    scale,
    setScale,
    algorithm,
    setAlgorithm,
    originalSize,
    isProcessing,
    progress,
    processUpscale,
    cancelUpscale,
  } = useUpscaleStore();

  const t = useTranslations("tools.imageUpscaler.ui.controls");
  const tAlgo = useTranslations("tools.imageUpscaler.ui.algorithm");
  const tToast = useTranslations("tools.imageUpscaler.ui.toast");

  const estimatedSize = originalSize
    ? {
        width: originalSize.width * scale,
        height: originalSize.height * scale,
      }
    : null;

  const estimatedTime = originalSize
    ? estimateProcessingTime(originalSize, scale, algorithm)
    : 0;

  const handleUpscale = async () => {
    try {
      await processUpscale();
      toast.success(tToast("processComplete"));
    } catch {
      toast.error(tToast("processError"));
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 스케일 선택 */}
        <div className="space-y-2">
          <Label>{t("scale")}</Label>
          <Select
            value={scale.toString()}
            onValueChange={(value) => setScale(Number(value) as ScaleOption)}
            disabled={isProcessing}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scaleOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}x
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 알고리즘 선택 */}
        <div className="space-y-2">
          <Label>{t("algorithm")}</Label>
          <Select
            value={algorithm}
            onValueChange={(value) => setAlgorithm(value as AlgorithmOption)}
            disabled={isProcessing}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {algorithmOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  <div className="flex flex-col">
                    <span>{tAlgo(option as Parameters<typeof tAlgo>[0])}</span>
                    <span className="text-xs text-muted-foreground">
                      {tAlgo(`${option}Desc` as Parameters<typeof tAlgo>[0])}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 예상 크기 */}
        {estimatedSize && (
          <div className="p-3 bg-muted rounded-lg space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("estimatedSize")}</span>
              <span className="font-medium">{formatDimensions(estimatedSize)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>예상 시간</span>
              <span>~{estimatedTime.toFixed(1)}초</span>
            </div>
          </div>
        )}

        {/* 업스케일 버튼 */}
        {isProcessing ? (
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t("processing", { progress })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={cancelUpscale}
              >
                <X className="w-4 h-4 mr-1" />
                {t("cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <Button className="w-full" onClick={handleUpscale}>
            <Sparkles className="w-4 h-4 mr-2" />
            {t("processButton")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
