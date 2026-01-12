"use client";

import { useTranslations, useLocale } from "next-intl";
import { Info, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useCronStore } from "../model/useCronStore";
import { describeCronExpression, describeFieldValue } from "../lib/cron-utils";
import { CronFieldType, CRON_FIELDS } from "../model/types";

const FIELD_ORDER: CronFieldType[] = [
  "minute",
  "hour",
  "dayOfMonth",
  "month",
  "dayOfWeek",
];

export function ExpressionExplain() {
  const t = useTranslations("tools.cronParser.ui");
  const locale = useLocale() as "ko" | "en";

  const { expression, parsed } = useCronStore();

  if (!expression.trim()) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t("explanation")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("enterExpression")}</p>
        </CardContent>
      </Card>
    );
  }

  if (!parsed?.isValid) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            {t("explanation")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{t("invalidExpression")}</p>
        </CardContent>
      </Card>
    );
  }

  const description = describeCronExpression(expression, locale);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5" />
          {t("explanation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 자연어 설명 */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-sm font-medium">{description}</p>
        </div>

        {/* 필드별 상세 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium">
                  {t("fieldName")}
                </th>
                <th className="text-left py-2 pr-4 font-medium">
                  {t("value")}
                </th>
                <th className="text-left py-2 font-medium">
                  {t("meaning")}
                </th>
              </tr>
            </thead>
            <tbody>
              {FIELD_ORDER.map((field) => {
                const fieldValue = parsed[field];
                const meta = CRON_FIELDS.find((f) => f.name === field)!;

                return (
                  <tr key={field} className="border-b last:border-0">
                    <td className="py-2 pr-4">
                      <span className="font-medium">{t(`fields.${field}`)}</span>
                      <span className="text-muted-foreground ml-1 text-xs">
                        ({meta.min}-{meta.max})
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                        {fieldValue.value}
                      </code>
                    </td>
                    <td className="py-2">
                      {fieldValue.isValid ? (
                        describeFieldValue(fieldValue, field, locale)
                      ) : (
                        <span className="text-destructive">
                          {fieldValue.error}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
