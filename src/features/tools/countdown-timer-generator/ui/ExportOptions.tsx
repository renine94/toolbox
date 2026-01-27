"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Copy, Download, Code } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useCountdownStore } from "../model/useCountdownStore";
import { generateEmbedCode } from "../lib/countdown-utils";
import { TIMER_PREVIEW_ID } from "./TimerPreview";

export function ExportOptions() {
  const t = useTranslations("tools.countdownTimerGenerator.ui");
  const tCommon = useTranslations("common.toast");
  const { config } = useCountdownStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const embedCode = generateEmbedCode(config);

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast.success(tCommon("copied"));
    } catch {
      toast.error(tCommon("copyError"));
    }
  };

  const handleDownloadPng = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById(TIMER_PREVIEW_ID);
      if (!element) {
        toast.error(tCommon("error"));
        return;
      }

      // html2canvas-pro 동적 임포트
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      // PNG로 다운로드
      const link = document.createElement("a");
      link.download = `countdown-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success(tCommon("downloaded"));
    } catch (error) {
      console.error("Download error:", error);
      toast.error(tCommon("error"));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* PNG Download */}
      <div className="space-y-2">
        <Label>{t("downloadPng")}</Label>
        <Button
          onClick={handleDownloadPng}
          disabled={isDownloading}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? t("downloading") : t("downloadPngButton")}
        </Button>
        <p className="text-xs text-muted-foreground">{t("downloadPngHint")}</p>
      </div>

      {/* Embed Code */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            {t("embedCode")}
          </Label>
          <Button variant="outline" size="sm" onClick={handleCopyEmbed}>
            <Copy className="h-4 w-4 mr-1" />
            {t("copy")}
          </Button>
        </div>
        <Textarea
          value={embedCode}
          readOnly
          className="font-mono text-xs h-32 resize-none"
        />
        <p className="text-xs text-muted-foreground">{t("embedCodeHint")}</p>
      </div>
    </div>
  );
}
