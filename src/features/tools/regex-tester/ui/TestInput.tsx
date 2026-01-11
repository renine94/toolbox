"use client";

import { useTranslations } from "next-intl";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { useRegexStore } from "../model/useRegexStore";

export function TestInput() {
  const { testText, setTestText } = useRegexStore();
  const t = useTranslations("tools.regexTester.ui");

  return (
    <div className="space-y-2 flex flex-col h-full">
      <Label htmlFor="test-text" className="text-sm font-medium">
        {t("testString")}
      </Label>
      <Textarea
        id="test-text"
        value={testText}
        onChange={(e) => setTestText(e.target.value)}
        placeholder={t("testStringPlaceholder")}
        className="flex-1 min-h-[200px] font-mono text-sm resize-none"
      />
    </div>
  );
}
