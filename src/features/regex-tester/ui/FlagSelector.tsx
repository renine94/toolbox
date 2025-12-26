"use client";

import { Button } from "@/shared/ui/button";
import { useRegexStore } from "../model/useRegexStore";
import { REGEX_FLAGS, RegexFlag } from "../model/types";

export function FlagSelector() {
  const { flags, toggleFlag } = useRegexStore();

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">플래그</p>
      <div className="flex flex-wrap gap-2">
        {REGEX_FLAGS.map(({ flag, name, description }) => (
          <Button
            key={flag}
            variant={flags.includes(flag) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFlag(flag)}
            className="font-mono"
            title={`${name}: ${description}`}
          >
            {flag}
            <span className="ml-1 text-xs opacity-70 hidden sm:inline">
              ({name})
            </span>
          </Button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        {flags.length > 0 ? (
          <span>
            활성: {flags.map((f) => REGEX_FLAGS.find((rf) => rf.flag === f)?.name).join(", ")}
          </span>
        ) : (
          <span>플래그를 선택하세요</span>
        )}
      </div>
    </div>
  );
}
