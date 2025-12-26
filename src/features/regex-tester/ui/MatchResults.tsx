"use client";

import { useRegexStore } from "../model/useRegexStore";
import { AlertCircle, Check } from "lucide-react";

export function MatchResults() {
  const { testText, result, pattern } = useRegexStore();

  // Render text with highlights
  const renderHighlightedText = () => {
    if (!result || result.matches.length === 0 || !testText) {
      return <span className="whitespace-pre-wrap">{testText}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort matches by index
    const sortedMatches = [...result.matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${i}`} className="whitespace-pre-wrap">
            {testText.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Add highlighted match
      parts.push(
        <mark
          key={`match-${i}`}
          className="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded whitespace-pre-wrap"
        >
          {match.fullMatch}
        </mark>
      );

      lastIndex = match.index + match.length;
    });

    // Add remaining text
    if (lastIndex < testText.length) {
      parts.push(
        <span key="text-end" className="whitespace-pre-wrap">
          {testText.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Status */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">매칭 결과</p>
        {result && (
          <div className="flex items-center gap-2 text-sm">
            {result.error ? (
              <span className="text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                오류
              </span>
            ) : (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                <Check className="w-4 h-4" />
                {result.totalMatches}개 매칭
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {result?.error && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">
          {result.error}
        </div>
      )}

      {/* Highlighted text */}
      <div className="flex-1 min-h-[200px] p-3 bg-muted/50 rounded-md border overflow-auto">
        <div className="font-mono text-sm leading-relaxed">
          {renderHighlightedText()}
        </div>
      </div>

      {/* Capture groups */}
      {result && result.matches.length > 0 && result.matches.some((m) => m.groups.length > 0) && (
        <div className="space-y-2">
          <p className="text-sm font-medium">캡처 그룹</p>
          <div className="max-h-[150px] overflow-auto space-y-2">
            {result.matches.map((match, i) => (
              <div
                key={i}
                className="p-2 bg-muted/50 rounded border text-sm font-mono"
              >
                <div className="text-muted-foreground text-xs mb-1">
                  매칭 #{i + 1} (위치: {match.index})
                </div>
                <div className="text-foreground mb-1">
                  전체: <span className="text-yellow-600 dark:text-yellow-400">{match.fullMatch}</span>
                </div>
                {match.groups.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {match.groups.map((group, j) => (
                      <span key={j} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-xs">
                        ${j + 1}: {group || "(빈 문자열)"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
