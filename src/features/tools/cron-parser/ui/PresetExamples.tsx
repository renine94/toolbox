"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useCronStore } from "../model/useCronStore";
import { getPresetsByCategory } from "../lib/cron-presets";
import { CronPreset } from "../model/types";

export function PresetExamples() {
  const t = useTranslations("tools.cronParser.ui");

  const { loadPreset } = useCronStore();
  const presets = getPresetsByCategory();

  const handlePresetClick = (preset: CronPreset) => {
    loadPreset(preset);
  };

  return (
    <div className="space-y-4">
      {/* 일반 프리셋 */}
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          {t("commonPresets")}
        </h3>
        <div className="space-y-1">
          {presets.common.map((preset) => (
            <PresetButton
              key={preset.expression}
              preset={preset}
              onClick={() => handlePresetClick(preset)}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* 고급 프리셋 */}
      <div>
        <h3 className="text-sm font-medium mb-2">{t("advancedPresets")}</h3>
        <div className="space-y-1">
          {presets.advanced.map((preset) => (
            <PresetButton
              key={preset.expression}
              preset={preset}
              onClick={() => handlePresetClick(preset)}
              t={t}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PresetButtonProps {
  preset: CronPreset;
  onClick: () => void;
  t: (key: string) => string;
}

function PresetButton({ preset, onClick, t }: PresetButtonProps) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start h-auto py-2 px-3 text-left"
      onClick={onClick}
    >
      <div className="flex flex-col items-start gap-0.5">
        <span className="font-medium text-sm">
          {t(`presetLabels.${preset.labelKey}`)}
        </span>
        <code className="text-xs font-mono text-muted-foreground">
          {preset.expression}
        </code>
      </div>
    </Button>
  );
}
