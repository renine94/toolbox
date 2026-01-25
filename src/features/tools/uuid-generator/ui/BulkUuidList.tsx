"use client";

import { useTranslations } from "next-intl";
import { Copy, Trash2, Download } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useUuidStore } from "../model/useUuidStore";
import { copyToClipboard } from "../lib/uuid-utils";
import { toast } from "sonner";

export function BulkUuidList() {
  const config = useUuidStore((state) => state.config);
  const bulkUuids = useUuidStore((state) => state.bulkUuids);
  const setQuantity = useUuidStore((state) => state.setQuantity);
  const generateBulk = useUuidStore((state) => state.generateBulk);
  const clearBulk = useUuidStore((state) => state.clearBulk);
  const t = useTranslations("tools.uuidGenerator.ui");
  const tCommon = useTranslations("common.toast");

  const handleCopyAll = async () => {
    if (bulkUuids.length === 0) {
      toast.error(t("noUuidToCopy"));
      return;
    }
    const text = bulkUuids.map((item) => item.uuid).join("\n");
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(t("copiedCount", { count: bulkUuids.length }));
    } else {
      toast.error(tCommon("copyError"));
    }
  };

  const handleCopySingle = async (uuid: string) => {
    const success = await copyToClipboard(uuid);
    if (success) {
      toast.success(tCommon("copied"));
    } else {
      toast.error(tCommon("copyError"));
    }
  };

  const handleDownload = () => {
    if (bulkUuids.length === 0) {
      toast.error(t("noUuidToDownload"));
      return;
    }
    const text = bulkUuids.map((item) => item.uuid).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids-${config.version}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t("downloaded"));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">{t("quantity")}</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={100}
            value={config.quantity}
            onChange={(e) => {
              const rawValue = e.target.value;
              if (rawValue === "") {
                setQuantity(1);
                return;
              }
              const value = parseInt(rawValue);
              if (!isNaN(value)) {
                setQuantity(value);
              }
            }}
            onBlur={(e) => {
              const value = parseInt(e.target.value) || 1;
              const clamped = Math.max(1, Math.min(100, value));
              setQuantity(clamped);
            }}
            className="w-24"
          />
        </div>
        <Button onClick={generateBulk}>{t("bulkGenerateButton")}</Button>
        {bulkUuids.length > 0 && (
          <>
            <Button variant="outline" onClick={handleCopyAll}>
              <Copy className="h-4 w-4 mr-2" />
              {t("copyAll")}
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              {t("download")}
            </Button>
            <Button variant="ghost" onClick={clearBulk}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t("reset")}
            </Button>
          </>
        )}
      </div>

      {bulkUuids.length > 0 && (
        <ScrollArea className="h-[300px] rounded-lg border">
          <div className="p-4 space-y-2">
            {bulkUuids.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted group"
              >
                <span className="text-sm text-muted-foreground w-8">
                  {index + 1}.
                </span>
                <code className="flex-1 text-sm font-mono">{item.uuid}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopySingle(item.uuid)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {bulkUuids.length === 0 && (
        <div className="h-[100px] flex items-center justify-center text-muted-foreground border rounded-lg">
          {t("emptyBulk")}
        </div>
      )}
    </div>
  );
}
