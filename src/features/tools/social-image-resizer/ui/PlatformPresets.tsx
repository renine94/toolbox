"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Check, CheckCheck, X } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Badge } from "@/shared/ui/badge";
import { useResizerStore } from "../model/useResizerStore";
import { PLATFORM_INFO, platforms, type Platform } from "../model/types";
import { getPresetsByPlatform, formatPresetSize } from "../lib/platform-presets";

export function PlatformPresets() {
  const t = useTranslations("tools.socialImageResizer.ui.presets");
  const tPlatforms = useTranslations("tools.socialImageResizer.platforms");
  const tPresetNames = useTranslations("tools.socialImageResizer.presetNames");

  const selectedPresets = useResizerStore((state) => state.selectedPresets);
  const togglePreset = useResizerStore((state) => state.togglePreset);
  const selectAllPresets = useResizerStore((state) => state.selectAllPresets);
  const deselectAllPresets = useResizerStore((state) => state.deselectAllPresets);
  const selectPlatformPresets = useResizerStore((state) => state.selectPlatformPresets);
  const isResizing = useResizerStore((state) => state.isResizing);

  const presetsByPlatform = useMemo(() => getPresetsByPlatform(), []);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("title")}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {t("selectedCount", { count: selectedPresets.size })}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllPresets}
              disabled={isResizing}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              {t("selectAll")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={deselectAllPresets}
              disabled={isResizing}
            >
              <X className="h-4 w-4 mr-1" />
              {t("deselectAll")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {platforms.map((platform) => {
          const platformInfo = PLATFORM_INFO[platform];
          const platformPresets = presetsByPlatform.get(platform) || [];
          const selectedCount = platformPresets.filter((p) =>
            selectedPresets.has(p.id)
          ).length;
          const allSelected =
            platformPresets.length > 0 &&
            selectedCount === platformPresets.length;

          return (
            <div key={platform} className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  onClick={() => selectPlatformPresets(platform)}
                  disabled={isResizing}
                  type="button"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platformInfo.color }}
                  />
                  <span className="font-medium">{tPlatforms(platformInfo.nameKey)}</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedCount}/{platformPresets.length}
                  </Badge>
                </button>
                {allSelected && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-5">
                {platformPresets.map((preset) => {
                  const isSelected = selectedPresets.has(preset.id);

                  return (
                    <label
                      key={preset.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      } ${isResizing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => togglePreset(preset.id)}
                        disabled={isResizing}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {tPresetNames(preset.nameKey)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPresetSize(preset)} ({preset.aspectRatio})
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
