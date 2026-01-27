"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { Slider } from "@/shared/ui/slider";
import { cn } from "@/shared/lib/utils";
import { useCountdownStore } from "../model/useCountdownStore";
import { THEME_PRESETS, ThemePreset, getThemeConfig } from "../model/types";

export function StyleCustomizer() {
  const t = useTranslations("tools.countdownTimerGenerator.ui");
  const {
    config,
    setTheme,
    setShowLabels,
    setFontSize,
    setBorderRadius,
    setWidth,
    setHeight,
  } = useCountdownStore();

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="space-y-3">
        <Label>{t("themePreset")}</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {THEME_PRESETS.map((theme) => {
            const isSelected = config.theme === theme.id;
            const themeConfig = getThemeConfig(theme.id);
            const backgroundStyle =
              themeConfig.gradientFrom && themeConfig.gradientTo
                ? { background: `linear-gradient(135deg, ${themeConfig.gradientFrom}, ${themeConfig.gradientTo})` }
                : { backgroundColor: themeConfig.backgroundColor };

            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id as ThemePreset)}
                className={cn(
                  "relative p-3 rounded-lg border-2 transition-all text-left",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div
                  className="w-full h-8 rounded mb-2"
                  style={backgroundStyle}
                />
                <span className="text-sm font-medium">{t(`themes.${theme.id}`)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Show Labels Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="showLabels">{t("showLabels")}</Label>
          <p className="text-xs text-muted-foreground">{t("showLabelsHint")}</p>
        </div>
        <Switch
          id="showLabels"
          checked={config.showLabels}
          onCheckedChange={setShowLabels}
        />
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{t("fontSize")}</Label>
          <span className="text-sm text-muted-foreground">{config.fontSize}px</span>
        </div>
        <Slider
          value={[config.fontSize]}
          onValueChange={([value]) => setFontSize(value)}
          min={24}
          max={96}
          step={4}
        />
      </div>

      {/* Border Radius */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{t("borderRadius")}</Label>
          <span className="text-sm text-muted-foreground">{config.borderRadius}px</span>
        </div>
        <Slider
          value={[config.borderRadius]}
          onValueChange={([value]) => setBorderRadius(value)}
          min={0}
          max={32}
          step={2}
        />
      </div>

      {/* Width */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{t("width")}</Label>
          <span className="text-sm text-muted-foreground">{config.width}px</span>
        </div>
        <Slider
          value={[config.width]}
          onValueChange={([value]) => setWidth(value)}
          min={400}
          max={1000}
          step={50}
        />
      </div>

      {/* Height */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{t("height")}</Label>
          <span className="text-sm text-muted-foreground">{config.height}px</span>
        </div>
        <Slider
          value={[config.height]}
          onValueChange={([value]) => setHeight(value)}
          min={150}
          max={400}
          step={25}
        />
      </div>
    </div>
  );
}
