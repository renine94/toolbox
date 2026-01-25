"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Slider } from "@/shared/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { useFakeDataStore } from "../model/useFakeDataStore";
import type { FakeDataLocale, OutputFormat } from "../model/types";

export function GeneratorOptions() {
  const t = useTranslations("tools.fakeDataGenerator.ui");

  const config = useFakeDataStore((state) => state.config);
  const setLocale = useFakeDataStore((state) => state.setLocale);
  const setCount = useFakeDataStore((state) => state.setCount);
  const setOutputFormat = useFakeDataStore((state) => state.setOutputFormat);

  return (
    <div className="space-y-6">
      {/* 언어 선택 */}
      <div className="space-y-2">
        <Label>{t("locale")}</Label>
        <Select
          value={config.locale}
          onValueChange={(value: FakeDataLocale) => setLocale(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ko">{t("locales.ko")}</SelectItem>
            <SelectItem value="en">{t("locales.en")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 생성 개수 */}
      <div className="space-y-2">
        <Label>
          {t("count")} ({config.count}{t("countUnit")})
        </Label>
        <Slider
          value={[config.count]}
          onValueChange={([value]) => setCount(value)}
          min={1}
          max={100}
          step={1}
        />
      </div>

      {/* 출력 형식 */}
      <div className="space-y-2">
        <Label>{t("outputFormat")}</Label>
        <RadioGroup
          value={config.outputFormat}
          onValueChange={(value: OutputFormat) => setOutputFormat(value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="json" id="json" />
            <Label htmlFor="json" className="cursor-pointer font-normal">
              JSON
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="csv" id="csv" />
            <Label htmlFor="csv" className="cursor-pointer font-normal">
              CSV
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
