"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import { useLoremIpsumStore } from "../model/useLoremIpsumStore";
import { MODE_LABELS, MODE_LIMITS, GenerateMode } from "../model/types";

export function GeneratorOptions() {
  const { config, setConfig, setMode, generate } = useLoremIpsumStore();
  const limits = MODE_LIMITS[config.mode];

  return (
    <div className="space-y-6">
      {/* 모드 선택 */}
      <div className="space-y-2">
        <Label>생성 단위</Label>
        <div className="flex gap-2">
          {(["paragraphs", "sentences", "words"] as GenerateMode[]).map(
            (mode) => (
              <Button
                key={mode}
                variant={config.mode === mode ? "default" : "outline"}
                onClick={() => setMode(mode)}
                className="flex-1"
              >
                {MODE_LABELS[mode]}
              </Button>
            )
          )}
        </div>
      </div>

      {/* 개수 슬라이더 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{MODE_LABELS[config.mode]} 수</Label>
          <span className="text-sm font-medium tabular-nums">
            {config.count}
          </span>
        </div>
        <Slider
          value={[config.count]}
          onValueChange={([value]) => setConfig({ count: value })}
          min={limits.min}
          max={limits.max}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{limits.min}</span>
          <span>{limits.max}</span>
        </div>
      </div>

      {/* 옵션 스위치들 */}
      <div className="space-y-4">
        <Label>옵션</Label>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="startWithLorem"
            className="text-sm font-normal cursor-pointer"
          >
            &quot;Lorem ipsum dolor sit amet...&quot;으로 시작
          </Label>
          <Switch
            id="startWithLorem"
            checked={config.startWithLoremIpsum}
            onCheckedChange={(checked) =>
              setConfig({ startWithLoremIpsum: checked })
            }
          />
        </div>

        {config.mode === "paragraphs" && (
          <div className="flex items-center justify-between">
            <Label
              htmlFor="includeHtml"
              className="text-sm font-normal cursor-pointer"
            >
              HTML &lt;p&gt; 태그 포함
            </Label>
            <Switch
              id="includeHtml"
              checked={config.includeHtml}
              onCheckedChange={(checked) => setConfig({ includeHtml: checked })}
            />
          </div>
        )}
      </div>

      {/* 생성 버튼 */}
      <Button onClick={generate} className="w-full">
        <Sparkles className="w-4 h-4 mr-2" />
        텍스트 생성
      </Button>
    </div>
  );
}
