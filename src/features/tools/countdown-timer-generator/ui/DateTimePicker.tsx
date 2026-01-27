"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useCountdownStore } from "../model/useCountdownStore";

export function DateTimePicker() {
  const t = useTranslations("tools.countdownTimerGenerator.ui");
  const { config, setTargetDate, setTitle } = useCountdownStore();

  // ISO string을 datetime-local 형식으로 변환
  const formatDateTimeLocal = (isoString: string) => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };

  // datetime-local 값을 ISO string으로 변환
  const handleDateChange = (value: string) => {
    const date = new Date(value);
    setTargetDate(date.toISOString());
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t("title")}</Label>
        <Input
          id="title"
          type="text"
          placeholder={t("titlePlaceholder")}
          value={config.title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="targetDate">{t("targetDate")}</Label>
        <Input
          id="targetDate"
          type="datetime-local"
          value={formatDateTimeLocal(config.targetDate)}
          onChange={(e) => handleDateChange(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
        />
        <p className="text-xs text-muted-foreground">{t("targetDateHint")}</p>
      </div>
    </div>
  );
}
