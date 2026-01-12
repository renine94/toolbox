"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { CronFieldType, CRON_FIELDS } from "../model/types";

interface FieldSelectorProps {
  field: CronFieldType;
  value: string;
  onChange: (value: string) => void;
}

// 빠른 선택 옵션
const QUICK_OPTIONS: Record<CronFieldType, { value: string; labelKey: string }[]> = {
  minute: [
    { value: "*", labelKey: "every" },
    { value: "0", labelKey: "zero" },
    { value: "*/5", labelKey: "every5" },
    { value: "*/10", labelKey: "every10" },
    { value: "*/15", labelKey: "every15" },
    { value: "*/30", labelKey: "every30" },
  ],
  hour: [
    { value: "*", labelKey: "every" },
    { value: "0", labelKey: "midnight" },
    { value: "9", labelKey: "nineAM" },
    { value: "12", labelKey: "noon" },
    { value: "18", labelKey: "sixPM" },
    { value: "*/2", labelKey: "every2" },
  ],
  dayOfMonth: [
    { value: "*", labelKey: "every" },
    { value: "1", labelKey: "first" },
    { value: "15", labelKey: "fifteenth" },
    { value: "1,15", labelKey: "firstAndFifteenth" },
  ],
  month: [
    { value: "*", labelKey: "every" },
    { value: "1", labelKey: "january" },
    { value: "1,4,7,10", labelKey: "quarterly" },
  ],
  dayOfWeek: [
    { value: "*", labelKey: "every" },
    { value: "1-5", labelKey: "weekdays" },
    { value: "0,6", labelKey: "weekends" },
    { value: "1", labelKey: "monday" },
    { value: "5", labelKey: "friday" },
  ],
};

export function FieldSelector({ field, value, onChange }: FieldSelectorProps) {
  const t = useTranslations("tools.cronParser.ui");
  const meta = CRON_FIELDS.find((f) => f.name === field)!;
  const options = QUICK_OPTIONS[field];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {t(`fields.${field}`)}
        <span className="text-muted-foreground ml-2 text-xs">
          ({t(`fieldRanges.${field}`)})
        </span>
      </Label>

      <div className="flex gap-2">
        <Select
          value={options.find((o) => o.value === value)?.value || "custom"}
          onValueChange={(v) => {
            if (v !== "custom") {
              onChange(v);
            }
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("selectOption")} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(`quickOptions.${field}.${option.labelKey}`)}
              </SelectItem>
            ))}
            <SelectItem value="custom">{t("custom")}</SelectItem>
          </SelectContent>
        </Select>

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`${meta.min}-${meta.max}`}
          className="font-mono flex-1"
        />
      </div>
    </div>
  );
}
