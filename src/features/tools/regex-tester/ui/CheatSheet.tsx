"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { useRegexStore } from "../model/useRegexStore";
import { SYNTAX_GUIDE, COMMON_PATTERNS } from "../lib/cheatsheet-data";
import { ChevronDown, ChevronRight, BookOpen, Zap } from "lucide-react";
import { toast } from "sonner";

type Tab = "syntax" | "patterns";

export function CheatSheet() {
  const [activeTab, setActiveTab] = useState<Tab>("patterns");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "메타문자",
  ]);
  const { setPattern, setTestText } = useRegexStore();

  const toggleCategory = (title: string) => {
    setExpandedCategories((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const applyPattern = (pattern: string, testText?: string) => {
    setPattern(pattern);
    if (testText) {
      setTestText(testText);
    }
    toast.success("패턴이 적용되었습니다");
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("patterns")}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "patterns"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Zap className="w-4 h-4" />
          예제 패턴
        </button>
        <button
          onClick={() => setActiveTab("syntax")}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "syntax"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          문법 가이드
        </button>
      </div>

      {/* Common Patterns */}
      {activeTab === "patterns" && (
        <div className="space-y-2 max-h-[400px] overflow-auto pr-2">
          {COMMON_PATTERNS.map((item) => (
            <div
              key={item.name}
              className="p-3 bg-muted/50 rounded-md border hover:bg-muted transition-colors cursor-pointer"
              onClick={() => applyPattern(item.pattern, item.testText)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{item.name}</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  적용
                </Button>
              </div>
              <code className="text-xs text-muted-foreground block truncate font-mono">
                /{item.pattern}/g
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Syntax Guide */}
      {activeTab === "syntax" && (
        <div className="space-y-2 max-h-[400px] overflow-auto pr-2">
          {SYNTAX_GUIDE.map((category) => (
            <div key={category.title} className="border rounded-md">
              <button
                onClick={() => toggleCategory(category.title)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium text-sm">{category.title}</span>
                {expandedCategories.includes(category.title) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {expandedCategories.includes(category.title) && (
                <div className="px-3 pb-3 space-y-1">
                  {category.items.map((item) => (
                    <div
                      key={item.pattern}
                      className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded cursor-pointer"
                      onClick={() => applyPattern(item.pattern)}
                    >
                      <code className="text-xs font-mono bg-primary/10 px-1.5 py-0.5 rounded min-w-[60px] text-center">
                        {item.pattern}
                      </code>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground">
                          {item.description}
                        </p>
                        {item.example && (
                          <p className="text-xs text-muted-foreground truncate">
                            예: {item.example}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
