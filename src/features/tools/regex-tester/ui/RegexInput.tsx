"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useRegexStore } from "../model/useRegexStore";
import { isValidRegex } from "../lib/regex-utils";

export function RegexInput() {
  const { pattern, setPattern, flags } = useRegexStore();
  const validation = isValidRegex(pattern, flags);
  const t = useTranslations("tools.regexTester.ui");

  return (
    <div className="space-y-2">
      <Label htmlFor="regex-pattern" className="text-sm font-medium">
        {t("pattern")}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
          /
        </div>
        <Input
          id="regex-pattern"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder={t("patternPlaceholder")}
          className={`pl-6 pr-6 font-mono ${
            pattern && !validation.valid
              ? "border-red-500 focus-visible:ring-red-500"
              : pattern && validation.valid
                ? "border-green-500 focus-visible:ring-green-500"
                : ""
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
          /{flags.join("")}
        </div>
      </div>
      {pattern && !validation.valid && (
        <p className="text-sm text-red-500">{validation.error}</p>
      )}
    </div>
  );
}
