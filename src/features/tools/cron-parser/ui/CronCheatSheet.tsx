"use client";

import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";
import {
  CHEATSHEET_FIELDS,
  CHEATSHEET_SPECIAL_CHARS,
} from "../lib/cron-presets";

export function CronCheatSheet() {
  const t = useTranslations("tools.cronParser.ui");

  return (
    <div className="space-y-6">
      {/* Cron 형식 */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          {t("cronFormat")}
        </h3>
        <div className="p-3 bg-muted rounded-lg font-mono text-sm text-center">
          <div className="flex justify-center gap-2 flex-wrap">
            {["minute", "hour", "dayOfMonth", "month", "dayOfWeek"].map(
              (field) => (
                <span key={field} className="flex flex-col items-center">
                  <span className="text-primary">*</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {t(`fields.${field}`)}
                  </span>
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* 필드 범위 */}
      <div>
        <h3 className="text-sm font-medium mb-2">{t("fieldRangesTitle")}</h3>
        <div className="space-y-1">
          {CHEATSHEET_FIELDS.map((field) => (
            <div
              key={field.field}
              className="flex justify-between text-sm py-1 border-b last:border-0"
            >
              <span>{t(`fields.${field.field}`)}</span>
              <code className="font-mono text-muted-foreground">
                {field.range}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* 특수 문자 */}
      <div>
        <h3 className="text-sm font-medium mb-2">{t("specialCharsTitle")}</h3>
        <div className="space-y-2">
          {CHEATSHEET_SPECIAL_CHARS.map((char) => (
            <div
              key={char.char}
              className="flex items-start gap-3 text-sm py-1 border-b last:border-0"
            >
              <code className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
                {char.char}
              </code>
              <span className="text-muted-foreground">
                {t(`specialChars.${char.meaningKey}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 예시 */}
      <div>
        <h3 className="text-sm font-medium mb-2">{t("examples")}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex flex-col gap-1">
            <code className="font-mono bg-muted px-2 py-1 rounded">
              */15 * * * *
            </code>
            <span className="text-muted-foreground text-xs">
              {t("exampleEvery15Min")}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <code className="font-mono bg-muted px-2 py-1 rounded">
              0 9-17 * * 1-5
            </code>
            <span className="text-muted-foreground text-xs">
              {t("exampleBusinessHours")}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <code className="font-mono bg-muted px-2 py-1 rounded">
              0 0 1,15 * *
            </code>
            <span className="text-muted-foreground text-xs">
              {t("exampleBiMonthly")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
