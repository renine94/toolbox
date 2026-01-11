"use client";

import { useTranslations } from "next-intl";
import { Settings, Play, StopCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import { useConverterStore } from "../model/useConverterStore";
import {
  outputFormats,
  resizeModes,
  FORMAT_INFO,
  type OutputFormat,
  type ResizeMode,
} from "../model/types";

export function ConversionSettings() {
  const t = useTranslations("tools.imageConverter.ui.settings");
  const tFormats = useTranslations("tools.imageConverter.formats");

  const {
    images,
    options,
    isConverting,
    setOption,
    setResizeOption,
    convertAll,
    cancelConversion,
  } = useConverterStore();

  const formatInfo = FORMAT_INFO[options.outputFormat];
  const pendingCount = images.filter(
    (img) => img.status === "pending" || img.status === "error"
  ).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 출력 포맷 */}
        <div className="space-y-2">
          <Label>{t("outputFormat")}</Label>
          <Select
            value={options.outputFormat}
            onValueChange={(value: OutputFormat) =>
              setOption("outputFormat", value)
            }
            disabled={isConverting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {outputFormats.map((format) => (
                <SelectItem key={format} value={format}>
                  <div className="flex flex-col">
                    <span>{FORMAT_INFO[format].name}</span>
                    <span className="text-xs text-muted-foreground">
                      {tFormats(`${format}.description`)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 품질 (JPEG, WebP만) */}
        {formatInfo.supportsQuality && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("quality")}</Label>
              <span className="text-sm text-muted-foreground">
                {options.quality}%
              </span>
            </div>
            <Slider
              value={[options.quality]}
              onValueChange={([value]) => setOption("quality", value)}
              min={1}
              max={100}
              step={1}
              disabled={isConverting}
            />
          </div>
        )}

        {/* 배경색 */}
        <div className="space-y-2">
          <Label>{t("backgroundColor")}</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={options.backgroundColor}
              onChange={(e) => setOption("backgroundColor", e.target.value)}
              disabled={isConverting}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={options.backgroundColor}
              onChange={(e) => setOption("backgroundColor", e.target.value)}
              disabled={isConverting}
              className="flex-1 font-mono"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t("backgroundColorHint")}
          </p>
        </div>

        {/* 투명도 유지 */}
        {formatInfo.supportsTransparency && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("preserveTransparency")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("preserveTransparencyHint")}
              </p>
            </div>
            <Switch
              checked={options.preserveTransparency}
              onCheckedChange={(checked) =>
                setOption("preserveTransparency", checked)
              }
              disabled={isConverting}
            />
          </div>
        )}

        {/* 리사이즈 옵션 */}
        <div className="space-y-4 pt-4 border-t">
          <Label className="text-base">{t("resize.title")}</Label>

          {/* 리사이즈 모드 */}
          <div className="space-y-2">
            <Label>{t("resize.mode")}</Label>
            <Select
              value={options.resize.mode}
              onValueChange={(value: ResizeMode) =>
                setResizeOption("mode", value)
              }
              disabled={isConverting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resizeModes.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {t(`resize.modes.${mode}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 퍼센트 입력 */}
          {options.resize.mode === "percentage" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t("resize.percentage")}</Label>
                <span className="text-sm text-muted-foreground">
                  {options.resize.percentage}%
                </span>
              </div>
              <Slider
                value={[options.resize.percentage]}
                onValueChange={([value]) => setResizeOption("percentage", value)}
                min={1}
                max={500}
                step={1}
                disabled={isConverting}
              />
            </div>
          )}

          {/* 크기 입력 */}
          {(options.resize.mode === "dimensions" ||
            options.resize.mode === "width") && (
            <div className="space-y-2">
              <Label>{t("resize.width")}</Label>
              <Input
                type="number"
                value={options.resize.width || ""}
                onChange={(e) =>
                  setResizeOption("width", parseInt(e.target.value) || undefined)
                }
                placeholder="px"
                min={1}
                max={10000}
                disabled={isConverting}
              />
            </div>
          )}

          {(options.resize.mode === "dimensions" ||
            options.resize.mode === "height") && (
            <div className="space-y-2">
              <Label>{t("resize.height")}</Label>
              <Input
                type="number"
                value={options.resize.height || ""}
                onChange={(e) =>
                  setResizeOption("height", parseInt(e.target.value) || undefined)
                }
                placeholder="px"
                min={1}
                max={10000}
                disabled={isConverting}
              />
            </div>
          )}

          {/* 비율 유지 */}
          {options.resize.mode !== "none" && (
            <div className="flex items-center justify-between">
              <Label>{t("resize.maintainAspectRatio")}</Label>
              <Switch
                checked={options.resize.maintainAspectRatio}
                onCheckedChange={(checked) =>
                  setResizeOption("maintainAspectRatio", checked)
                }
                disabled={isConverting}
              />
            </div>
          )}
        </div>

        {/* 변환 버튼 */}
        <div className="pt-4 border-t">
          {isConverting ? (
            <Button
              variant="destructive"
              className="w-full"
              onClick={cancelConversion}
            >
              <StopCircle className="w-4 h-4 mr-2" />
              {t("cancel")}
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={convertAll}
              disabled={pendingCount === 0}
            >
              <Play className="w-4 h-4 mr-2" />
              {t("convertButton", { count: pendingCount })}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
