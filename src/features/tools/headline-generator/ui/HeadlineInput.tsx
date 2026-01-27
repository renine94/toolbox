"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Sparkles, X } from "lucide-react";
import { useHeadlineStore } from "../model/useHeadlineStore";

export function HeadlineInput() {
  const t = useTranslations("tools.headlineGenerator.ui");
  const { topic, setTopic, generateVariations } = useHeadlineStore();

  const handleGenerate = () => {
    if (topic.trim()) {
      generateVariations();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && topic.trim()) {
      generateVariations();
    }
  };

  const handleClear = () => {
    setTopic("");
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="topic-input">{t("topicLabel")}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("topicPlaceholder")}
            className="pr-10"
          />
          {topic && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button onClick={handleGenerate} disabled={!topic.trim()}>
          <Sparkles className="mr-2 h-4 w-4" />
          {t("generate")}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{t("topicDescription")}</p>
    </div>
  );
}
