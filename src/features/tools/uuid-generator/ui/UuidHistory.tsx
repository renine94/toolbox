"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Copy, Trash2, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Badge } from "@/shared/ui/badge";
import { useUuidStore } from "../model/useUuidStore";
import { copyToClipboard } from "../lib/uuid-utils";
import { toast } from "sonner";

export function UuidHistory() {
  const history = useUuidStore((state) => state.history);
  const clearHistory = useUuidStore((state) => state.clearHistory);
  const removeFromHistory = useUuidStore((state) => state.removeFromHistory);
  const t = useTranslations("tools.uuidGenerator.ui");
  const tCommon = useTranslations("common.toast");
  const locale = useLocale();

  const handleCopy = async (uuid: string) => {
    const success = await copyToClipboard(uuid);
    if (success) {
      toast.success(tCommon("copied"));
    } else {
      toast.error(tCommon("copyError"));
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString(locale === "ko" ? "ko-KR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (history.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground border rounded-lg">
        {t("emptyHistory")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t("recentCount", { count: history.length })}
        </span>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          <Trash2 className="h-4 w-4 mr-2" />
          {t("deleteAll")}
        </Button>
      </div>

      <ScrollArea className="h-[300px] rounded-lg border">
        <div className="p-4 space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted group"
            >
              <Badge variant="secondary" className="text-xs">
                {item.version}
              </Badge>
              <code className="flex-1 text-sm font-mono truncate">
                {item.uuid}
              </code>
              <span className="text-xs text-muted-foreground">
                {formatTime(item.createdAt)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(item.uuid)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromHistory(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
