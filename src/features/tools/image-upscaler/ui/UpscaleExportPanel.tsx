"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Download, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUpscaleStore } from "../model/useUpscaleStore";
import { exportFormats, type ExportFormat } from "../model/types";
import { downloadImage, generateFilename } from "../lib/upscale-utils";
import { toast } from "sonner";

export function UpscaleExportPanel() {
  const { upscaledImage, scale, exportImage, reset } = useUpscaleStore();
  const t = useTranslations("tools.imageUpscaler.ui.export");
  const tToast = useTranslations("tools.imageUpscaler.ui.toast");

  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState(92);
  const [isExporting, setIsExporting] = useState(false);

  const showQuality = format === "jpeg" || format === "webp";

  const handleDownload = async () => {
    if (!upscaledImage) return;

    setIsExporting(true);
    try {
      const dataUrl = await exportImage({
        format,
        quality: quality / 100,
      });

      const filename = generateFilename("upscaled-image", scale, format);
      downloadImage(dataUrl, filename);
      toast.success(tToast("downloadComplete"));
    } catch {
      toast.error(tToast("processError"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 포맷 선택 */}
        <div className="space-y-2">
          <Label>{t("format")}</Label>
          <Select
            value={format}
            onValueChange={(value) => setFormat(value as ExportFormat)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exportFormats.map((f) => (
                <SelectItem key={f} value={f}>
                  {f.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 품질 선택 (JPEG/WebP만) */}
        {showQuality && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>{t("quality")}</Label>
              <span className="text-sm text-muted-foreground">{quality}%</span>
            </div>
            <Slider
              value={[quality]}
              onValueChange={([value]) => setQuality(value)}
              min={10}
              max={100}
              step={1}
            />
          </div>
        )}

        {/* 다운로드 버튼 */}
        <Button
          className="w-full"
          onClick={handleDownload}
          disabled={!upscaledImage || isExporting}
        >
          <Download className="w-4 h-4 mr-2" />
          {t("download")}
        </Button>

        {/* 새 이미지 버튼 */}
        <Button
          variant="outline"
          className="w-full"
          onClick={reset}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("reset")}
        </Button>
      </CardContent>
    </Card>
  );
}
