"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import { Input } from "@/shared/ui/input";
import { usePasswordStore } from "../model/usePasswordStore";

export function PasswordOptions() {
  const { config, setConfig } = usePasswordStore();
  const t = useTranslations("tools.passwordGenerator.ui");

  const hasAtLeastOneOption =
    config.uppercase || config.lowercase || config.numbers || config.symbols;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{t("length")}</Label>
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
        <Label>{t("charTypes")}</Label>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="uppercase"
            className="text-sm font-normal cursor-pointer"
          >
            {t("uppercase")}
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
            {t("lowercase")}
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
            {t("numbers")}
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
            {t("symbols")}
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
        <Label>{t("additionalOptions")}</Label>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="excludeAmbiguous"
            className="text-sm font-normal cursor-pointer"
          >
            {t("excludeAmbiguous")}
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
            {t("excludeChars")}
          </Label>
          <Input
            id="excludeChars"
            value={config.excludeChars}
            onChange={(e) => setConfig({ excludeChars: e.target.value })}
            placeholder={t("excludeCharsPlaceholder")}
          />
        </div>
      </div>
    </div>
  );
}
