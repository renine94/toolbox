"use client";

import { useTranslations } from "next-intl";
import { History, Trash2, ExternalLink, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { useUTMStore } from "../model/useUTMStore";
import { formatShortDate } from "../lib/utm-utils";

export function UTMHistory() {
  const t = useTranslations("tools.utmBuilder.ui");
  const tCommon = useTranslations("common");
  const { history, deleteHistoryItem, clearHistory, loadFromHistory } =
    useUTMStore();

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(tCommon("toast.copied"));
    } catch {
      toast.error(tCommon("toast.copyError"));
    }
  };

  const handleLoad = (item: (typeof history)[0]) => {
    loadFromHistory(item);
    toast.success(t("historyLoaded"));
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t("history")}
          </CardTitle>
          <CardDescription>{t("historyDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>{t("noHistory")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              {t("history")}
              <span className="text-sm font-normal text-muted-foreground">
                ({history.length})
              </span>
            </CardTitle>
            <CardDescription>{t("historyDescription")}</CardDescription>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                {t("clearHistory")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("clearHistoryConfirm")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("clearHistoryDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{tCommon("buttons.close")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearHistory}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {tCommon("buttons.delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-auto max-h-[400px]">
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="group p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono truncate text-muted-foreground">
                      {item.baseUrl}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                        {item.params.utm_source}
                      </span>
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                        {item.params.utm_medium}
                      </span>
                      <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded">
                        {item.params.utm_campaign}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatShortDate(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleLoad(item)}
                      title={t("loadHistory")}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleCopy(item.generatedUrl)}
                      title={tCommon("buttons.copy")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => window.open(item.generatedUrl, "_blank")}
                      title={t("openInNewTab")}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteHistoryItem(item.id)}
                      title={tCommon("buttons.delete")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
