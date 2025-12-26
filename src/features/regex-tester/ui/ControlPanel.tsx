"use client";

import { Button } from "@/shared/ui/button";
import { useRegexStore } from "../model/useRegexStore";
import { Copy, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export function ControlPanel() {
  const { pattern, flags, clear, saveToHistory, result } = useRegexStore();

  const copyPattern = async () => {
    if (!pattern) {
      toast.error("복사할 패턴이 없습니다");
      return;
    }

    const regexString = `/${pattern}/${flags.join("")}`;
    try {
      await navigator.clipboard.writeText(regexString);
      toast.success("패턴이 복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  const copyMatches = async () => {
    if (!result || result.matches.length === 0) {
      toast.error("복사할 매칭 결과가 없습니다");
      return;
    }

    const matchesText = result.matches.map((m) => m.fullMatch).join("\n");
    try {
      await navigator.clipboard.writeText(matchesText);
      toast.success("매칭 결과가 복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  const handleSave = () => {
    if (!pattern) {
      toast.error("저장할 패턴이 없습니다");
      return;
    }
    saveToHistory();
    toast.success("히스토리에 저장되었습니다");
  };

  const handleClear = () => {
    clear();
    toast.success("초기화되었습니다");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={copyPattern}>
        <Copy className="w-4 h-4 mr-1" />
        패턴 복사
      </Button>
      <Button variant="outline" size="sm" onClick={copyMatches}>
        <Copy className="w-4 h-4 mr-1" />
        결과 복사
      </Button>
      <Button variant="outline" size="sm" onClick={handleSave}>
        <Save className="w-4 h-4 mr-1" />
        저장
      </Button>
      <Button variant="outline" size="sm" onClick={handleClear}>
        <Trash2 className="w-4 h-4 mr-1" />
        초기화
      </Button>
    </div>
  );
}
