"use client";

import { Button } from "@/shared/ui/button";
import { useRegexStore } from "../model/useRegexStore";
import { formatDate } from "../lib/regex-utils";
import { Trash2, Clock, X } from "lucide-react";
import { toast } from "sonner";

export function History() {
  const { history, loadFromHistory, removeFromHistory, clearHistory } =
    useRegexStore();

  const handleLoad = (item: (typeof history)[0]) => {
    loadFromHistory(item);
    toast.success("히스토리에서 불러왔습니다");
  };

  const handleRemove = (
    e: React.MouseEvent,
    id: string
  ) => {
    e.stopPropagation();
    removeFromHistory(id);
    toast.success("히스토리에서 삭제되었습니다");
  };

  const handleClearAll = () => {
    clearHistory();
    toast.success("히스토리가 모두 삭제되었습니다");
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Clock className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">저장된 히스토리가 없습니다</p>
        <p className="text-xs mt-1">패턴을 저장하면 여기에 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {history.length}개의 저장된 패턴
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          전체 삭제
        </Button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-auto pr-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-muted/50 rounded-md border hover:bg-muted transition-colors cursor-pointer group"
            onClick={() => handleLoad(item)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <code className="text-sm font-mono block truncate text-foreground">
                  /{item.pattern}/{item.flags.join("")}
                </code>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {item.testText.slice(0, 50)}
                  {item.testText.length > 50 ? "..." : ""}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(item.createdAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                onClick={(e) => handleRemove(e, item.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
