"use client";

import { useCallback } from "react";
import { Button } from "@/shared/ui/button";
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
import { Upload, Trash2, Clock, Link2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useLinkShortenerStore } from "../model/useLinkShortenerStore";
import {
  copyToClipboard,
  formatDate,
  truncateUrl,
} from "../lib/link-shortener-utils";

export function ShortenHistory() {
  const { history, loadFromHistory, deleteFromHistory, clearHistory } =
    useLinkShortenerStore();

  const handleLoad = useCallback(
    (id: string) => {
      loadFromHistory(id);
      toast.success("이력을 불러왔습니다");
    },
    [loadFromHistory]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteFromHistory(id);
      toast.success("이력이 삭제되었습니다");
    },
    [deleteFromHistory]
  );

  const handleClearAll = useCallback(() => {
    clearHistory();
    toast.success("모든 이력이 삭제되었습니다");
  }, [clearHistory]);

  const handleCopy = useCallback(async (shortUrl: string) => {
    try {
      await copyToClipboard(shortUrl);
      toast.success("클립보드에 복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  }, []);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <Link2 className="h-12 w-12 mb-4 opacity-50" />
        <p>저장된 이력이 없습니다</p>
        <p className="text-sm mt-1">URL을 단축하면 이력에 자동 저장됩니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {history.length}개 저장됨
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              전체 삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>전체 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                모든 단축 이력을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAll}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                전체 삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ScrollArea className="h-[280px]">
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-mono text-sm truncate">{item.shortUrl}</p>
                <p
                  className="text-xs text-muted-foreground truncate"
                  title={item.originalUrl}
                >
                  {truncateUrl(item.originalUrl, 45)}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted">
                    {item.provider}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(item.shortUrl)}
                  title="복사"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLoad(item.id)}
                  title="불러오기"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>이력 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        이 단축 URL 이력을 삭제하시겠습니까?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
