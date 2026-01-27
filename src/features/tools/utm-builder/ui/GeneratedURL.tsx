"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, QrCode, History, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Textarea } from "@/shared/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useUTMStore } from "../model/useUTMStore";
import { isValidUrl } from "../lib/utm-utils";

export function GeneratedURL() {
  const t = useTranslations("tools.utmBuilder.ui");
  const tCommon = useTranslations("common");
  const { baseUrl, params, generatedUrl, addToHistory, resetAll } = useUTMStore();
  const [copied, setCopied] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const isValid =
    isValidUrl(baseUrl) &&
    params.utm_source &&
    params.utm_medium &&
    params.utm_campaign;

  const handleCopy = async () => {
    if (!generatedUrl) {
      toast.error(t("nothingToCopy"));
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      toast.success(tCommon("toast.copied"));
      // 히스토리에 추가
      addToHistory();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(tCommon("toast.copyError"));
    }
  };

  const handleReset = () => {
    resetAll();
    toast.success(t("resetSuccess"));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {t("generatedUrl")}
            </CardTitle>
            <CardDescription>
              {t("generatedUrlDescription")}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              title={tCommon("buttons.reset")}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={generatedUrl}
            readOnly
            placeholder={t("generatedUrlPlaceholder")}
            className="min-h-[100px] resize-none font-mono text-sm pr-24"
          />
          <div className="absolute right-2 top-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!generatedUrl}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!generatedUrl}
                  className="h-8 w-8 p-0"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("qrCode")}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG
                      value={generatedUrl}
                      size={256}
                      level="M"
                      includeMargin
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center break-all max-w-full">
                    {generatedUrl}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* URL 파라미터 미리보기 */}
        {generatedUrl && (
          <div className="rounded-lg bg-muted p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("parameterPreview")}
            </p>
            <div className="grid gap-1 text-xs">
              <div className="flex gap-2">
                <span className="text-blue-500 dark:text-blue-400 font-mono">
                  utm_source
                </span>
                <span className="text-muted-foreground">=</span>
                <span className="font-mono">{params.utm_source}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500 dark:text-green-400 font-mono">
                  utm_medium
                </span>
                <span className="text-muted-foreground">=</span>
                <span className="font-mono">{params.utm_medium}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-orange-500 dark:text-orange-400 font-mono">
                  utm_campaign
                </span>
                <span className="text-muted-foreground">=</span>
                <span className="font-mono">{params.utm_campaign}</span>
              </div>
              {params.utm_term && (
                <div className="flex gap-2">
                  <span className="text-purple-500 dark:text-purple-400 font-mono">
                    utm_term
                  </span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-mono">{params.utm_term}</span>
                </div>
              )}
              {params.utm_content && (
                <div className="flex gap-2">
                  <span className="text-pink-500 dark:text-pink-400 font-mono">
                    utm_content
                  </span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-mono">{params.utm_content}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {!isValid && baseUrl && (
          <p className="text-sm text-muted-foreground">
            {t("fillRequired")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
