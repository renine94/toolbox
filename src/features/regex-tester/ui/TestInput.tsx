"use client";

import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { useRegexStore } from "../model/useRegexStore";

export function TestInput() {
  const { testText, setTestText } = useRegexStore();

  return (
    <div className="space-y-2 flex flex-col h-full">
      <Label htmlFor="test-text" className="text-sm font-medium">
        테스트 문자열
      </Label>
      <Textarea
        id="test-text"
        value={testText}
        onChange={(e) => setTestText(e.target.value)}
        placeholder="테스트할 문자열을 입력하세요..."
        className="flex-1 min-h-[200px] font-mono text-sm resize-none"
      />
    </div>
  );
}
