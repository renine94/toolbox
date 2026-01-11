"use client";

import { useTranslations } from "next-intl";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useUuidStore } from "../model/useUuidStore";
import { copyToClipboard } from "../lib/uuid-utils";
import { toast } from "sonner";

export function UuidDisplay() {
  const currentUuid = useUuidStore((state) => state.currentUuid);
  const config = useUuidStore((state) => state.config);
  const generate = useUuidStore((state) => state.generate);
  const t = useTranslations("tools.uuidGenerator.ui");
  const tCommon = useTranslations("common.toast");

  const handleCopy = async () => {
    if (!currentUuid) {
      toast.error(t("noUuidToCopy"));
      return;
    }
    const success = await copyToClipboard(currentUuid);
    if (success) {
      toast.success(tCommon("copied"));
    } else {
      toast.error(tCommon("copyError"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <input
              type="text"
              value={currentUuid}
              readOnly
              placeholder={t("placeholder")}
              className="w-full px-4 py-3 text-lg font-mono bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          disabled={!currentUuid}
          title={t("copyTooltip")}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button onClick={generate} size="icon" title={t("generateTooltip")}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{t("versionLabel")}: {config.version.toUpperCase()}</span>
        <span>{t("lengthLabel")}: {currentUuid.length}{t("lengthUnit")}</span>
      </div>
    </div>
  );
}
