"use client";

import { useMemo } from "react";
import { useMarkdownStore } from "../model/useMarkdownStore";
import { Button } from "@/shared/ui/button";
import { Save, Clock, Type, FileText, Hash, ToggleLeft, ToggleRight } from "lucide-react";

export function StatsBar() {
  const {
    getStats,
    isAutoSaveEnabled,
    toggleAutoSave,
    saveDocument,
    lastSavedAt,
    currentDocumentId,
  } = useMarkdownStore();

  const stats = useMemo(() => getStats(), [getStats]);

  const lastSavedText = useMemo(() => {
    if (!lastSavedAt) return null;
    const diff = Date.now() - lastSavedAt;
    if (diff < 60000) return "방금 저장됨";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전 저장됨`;
    return new Date(lastSavedAt).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [lastSavedAt]);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20 text-sm text-muted-foreground">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" title="글자 수">
          <Type className="h-3.5 w-3.5" />
          <span>{stats.characters.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5" title="단어 수">
          <FileText className="h-3.5 w-3.5" />
          <span>{stats.words.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5" title="줄 수">
          <Hash className="h-3.5 w-3.5" />
          <span>{stats.lines.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5" title="예상 읽기 시간">
          <Clock className="h-3.5 w-3.5" />
          <span>{stats.readingTime}분</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {lastSavedText && (
          <span className="text-xs text-muted-foreground/70">
            {lastSavedText}
          </span>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAutoSave}
          className="h-7 gap-1.5 text-xs"
          title={isAutoSaveEnabled ? "자동 저장 끄기" : "자동 저장 켜기"}
        >
          {isAutoSaveEnabled ? (
            <ToggleRight className="h-4 w-4 text-green-500" />
          ) : (
            <ToggleLeft className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">자동 저장</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={saveDocument}
          disabled={!currentDocumentId && !isAutoSaveEnabled}
          className="h-7 gap-1.5 text-xs"
        >
          <Save className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">저장</span>
        </Button>
      </div>
    </div>
  );
}
