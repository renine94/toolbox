"use client";

import { useTranslations } from "next-intl";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { useFakeDataStore } from "../model/useFakeDataStore";
import { downloadFile } from "../lib/fake-data-utils";

export function DataDisplay() {
  const t = useTranslations("tools.fakeDataGenerator.ui");
  const tCommon = useTranslations("common.toast");

  const output = useFakeDataStore((state) => state.output);
  const config = useFakeDataStore((state) => state.config);

  const handleCopy = async () => {
    if (!output) {
      toast.error(t("nothingToCopy"));
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      toast.success(tCommon("copied"));
    } catch {
      toast.error(tCommon("copyError"));
    }
  };

  const handleDownload = () => {
    if (!output) {
      toast.error(t("nothingToDownload"));
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    const extension = config.outputFormat;
    const mimeType =
      config.outputFormat === "json" ? "application/json" : "text/csv";
    const filename = `fake-data-${timestamp}.${extension}`;

    downloadFile(output, filename, mimeType);
    toast.success(tCommon("downloaded"));
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{t("generatedData")}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-1" />
            {t("copy")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" />
            {t("download")}
          </Button>
        </div>
      </div>

      {/* 출력 영역 */}
      <div className="flex-1 min-h-[400px] rounded-lg border bg-muted/50 overflow-auto">
        {output ? (
          <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-all">
            {output}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            {t("emptyOutput")}
          </div>
        )}
      </div>
    </div>
  );
}
