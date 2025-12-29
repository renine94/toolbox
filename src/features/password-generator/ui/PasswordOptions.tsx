"use client";

import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import { Input } from "@/shared/ui/input";
import { usePasswordStore } from "../model/usePasswordStore";

export function PasswordOptions() {
  const { config, setConfig } = usePasswordStore();

  const hasAtLeastOneOption =
    config.uppercase || config.lowercase || config.numbers || config.symbols;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>비밀번호 길이</Label>
          <span className="text-sm font-medium">{config.length}</span>
        </div>
        <Slider
          value={[config.length]}
          onValueChange={([value]) => setConfig({ length: value })}
          min={8}
          max={128}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>8</span>
          <span>128</span>
        </div>
      </div>

      <div className="space-y-4">
        <Label>문자 유형</Label>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="uppercase"
            className="text-sm font-normal cursor-pointer"
          >
            대문자 (A-Z)
          </Label>
          <Switch
            id="uppercase"
            checked={config.uppercase}
            onCheckedChange={(checked) => {
              if (!checked && !config.lowercase && !config.numbers && !config.symbols) return;
              setConfig({ uppercase: checked });
            }}
            disabled={config.uppercase && !hasAtLeastOneOption}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="lowercase"
            className="text-sm font-normal cursor-pointer"
          >
            소문자 (a-z)
          </Label>
          <Switch
            id="lowercase"
            checked={config.lowercase}
            onCheckedChange={(checked) => {
              if (!checked && !config.uppercase && !config.numbers && !config.symbols) return;
              setConfig({ lowercase: checked });
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="numbers"
            className="text-sm font-normal cursor-pointer"
          >
            숫자 (0-9)
          </Label>
          <Switch
            id="numbers"
            checked={config.numbers}
            onCheckedChange={(checked) => {
              if (!checked && !config.uppercase && !config.lowercase && !config.symbols) return;
              setConfig({ numbers: checked });
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="symbols"
            className="text-sm font-normal cursor-pointer"
          >
            특수문자 (!@#$%...)
          </Label>
          <Switch
            id="symbols"
            checked={config.symbols}
            onCheckedChange={(checked) => {
              if (!checked && !config.uppercase && !config.lowercase && !config.numbers) return;
              setConfig({ symbols: checked });
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>추가 옵션</Label>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="excludeAmbiguous"
            className="text-sm font-normal cursor-pointer"
          >
            모호한 문자 제외 (l, 1, I, O, 0)
          </Label>
          <Switch
            id="excludeAmbiguous"
            checked={config.excludeAmbiguous}
            onCheckedChange={(checked) =>
              setConfig({ excludeAmbiguous: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excludeChars" className="text-sm font-normal">
            제외할 문자
          </Label>
          <Input
            id="excludeChars"
            value={config.excludeChars}
            onChange={(e) => setConfig({ excludeChars: e.target.value })}
            placeholder="제외할 문자를 입력하세요"
          />
        </div>
      </div>
    </div>
  );
}
