"use client";

import { useTranslations } from "next-intl";
import { Gauge, Target, ImageIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Slider } from "@/shared/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { useCompressorStore } from "../model/useCompressorStore";
import {
  compressionPresets,
  outputFormats,
  PRESET_CONFIG,
  TARGET_SIZE_LIMITS,
  type CompressionPreset,
  type OutputFormat,
} from "../model/types";

export function CompressionModeSelector() {
  const t = useTranslations("tools.imageCompressor.ui.settings");
  const tPresets = useTranslations("tools.imageCompressor.presets");
  const tFormats = useTranslations("tools.imageCompressor.formats");

  const options = useCompressorStore((state) => state.options);
  const setOption = useCompressorStore((state) => state.setOption);
  const isCompressing = useCompressorStore((state) => state.isCompressing);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 압축 모드 선택 */}
        <Tabs
          value={options.mode}
          onValueChange={(value) =>
            setOption("mode", value as "preset" | "target")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset" disabled={isCompressing}>
              <Gauge className="h-4 w-4 mr-2" />
              {t("presetMode")}
            </TabsTrigger>
            <TabsTrigger value="target" disabled={isCompressing}>
              <Target className="h-4 w-4 mr-2" />
              {t("targetMode")}
            </TabsTrigger>
          </TabsList>

          {/* 프리셋 모드 */}
          <TabsContent value="preset" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>{t("presetLabel")}</Label>
              <Select
                value={options.preset}
                onValueChange={(value) =>
                  setOption("preset", value as CompressionPreset)
                }
                disabled={isCompressing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {compressionPresets.map((preset) => (
                    <SelectItem key={preset} value={preset}>
                      <div className="flex flex-col">
                        <span>{tPresets(PRESET_CONFIG[preset].labelKey)}</span>
                        <span className="text-xs text-muted-foreground">
                          {tPresets(PRESET_CONFIG[preset].descriptionKey)} (
                          {PRESET_CONFIG[preset].quality}%)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 프리셋 품질 표시 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("quality")}</span>
                <span className="font-medium">
                  {PRESET_CONFIG[options.preset].quality}%
                </span>
              </div>
              <Slider
                value={[PRESET_CONFIG[options.preset].quality]}
                min={10}
                max={100}
                step={1}
                disabled
                className="opacity-50"
              />
            </div>
          </TabsContent>

          {/* 타겟 용량 모드 */}
          <TabsContent value="target" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>{t("targetSize")}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={options.targetSizeKB}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    // 빈 값이면 최소값으로 설정 (사용자가 지우고 다시 입력 가능)
                    if (rawValue === "") {
                      setOption("targetSizeKB", TARGET_SIZE_LIMITS.minKB);
                      return;
                    }
                    const value = parseInt(rawValue);
                    if (!isNaN(value)) {
                      setOption("targetSizeKB", value);
                    }
                  }}
                  onBlur={(e) => {
                    // blur 시에만 범위 제한 적용
                    const value = parseInt(e.target.value) || TARGET_SIZE_LIMITS.defaultKB;
                    const clamped = Math.max(
                      TARGET_SIZE_LIMITS.minKB,
                      Math.min(TARGET_SIZE_LIMITS.maxKB, value)
                    );
                    setOption("targetSizeKB", clamped);
                  }}
                  min={TARGET_SIZE_LIMITS.minKB}
                  max={TARGET_SIZE_LIMITS.maxKB}
                  disabled={isCompressing}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">KB</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("targetSizeHint", {
                  min: TARGET_SIZE_LIMITS.minKB,
                  max: TARGET_SIZE_LIMITS.maxKB,
                })}
              </p>
            </div>

            {/* 타겟 슬라이더 */}
            <div className="space-y-2">
              <Slider
                value={[options.targetSizeKB]}
                min={TARGET_SIZE_LIMITS.minKB}
                max={1000}
                step={10}
                onValueChange={([value]) => setOption("targetSizeKB", value)}
                disabled={isCompressing}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{TARGET_SIZE_LIMITS.minKB}KB</span>
                <span>1000KB</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 출력 포맷 */}
        <div className="space-y-2 pt-4 border-t">
          <Label className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            {t("outputFormat")}
          </Label>
          <Select
            value={options.outputFormat}
            onValueChange={(value) =>
              setOption("outputFormat", value as OutputFormat)
            }
            disabled={isCompressing}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {outputFormats.map((format) => (
                <SelectItem key={format} value={format}>
                  <div className="flex flex-col">
                    <span>{tFormats(`${format}.name`)}</span>
                    <span className="text-xs text-muted-foreground">
                      {tFormats(`${format}.description`)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
