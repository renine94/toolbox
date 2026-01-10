"use client";

import { Copy, Trash2, Type, Hash } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";
import { useLoremIpsumStore } from "../model/useLoremIpsumStore";

export function OutputPanel() {
  const { output, clear } = useLoremIpsumStore();

  const wordCount = output ? output.split(/\s+/).filter(Boolean).length : 0;
  const charCount = output.length;

  const handleCopy = async () => {
    if (!output) {
      toast.error("복사할 텍스트가 없습니다");
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      toast.success("클립보드에 복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  const handleClear = () => {
    clear();
    toast.success("텍스트가 삭제되었습니다");
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">생성된 텍스트</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!output}
          >
            <Copy className="w-4 h-4 mr-2" />
            복사
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!output}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            지우기
          </Button>
        </div>
      </div>

      {/* 출력 영역 */}
      <div className="flex-1 min-h-[300px] bg-muted/50 rounded-lg p-4 overflow-auto">
        {output ? (
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {output}
          </pre>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            &quot;텍스트 생성&quot; 버튼을 클릭하여 Lorem Ipsum을 생성하세요
          </p>
        )}
      </div>

      {/* 통계 */}
      {output && (
        <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Type className="w-4 h-4" />
            <span>단어: {wordCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Hash className="w-4 h-4" />
            <span>문자: {charCount.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
