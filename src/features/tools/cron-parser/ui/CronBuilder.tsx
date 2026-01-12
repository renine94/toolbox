"use client";

import { useTranslations } from "next-intl";
import { Wand2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useCronStore } from "../model/useCronStore";
import { FieldSelector } from "./FieldSelector";
import { CronFieldType } from "../model/types";

const FIELD_ORDER: CronFieldType[] = [
  "minute",
  "hour",
  "dayOfMonth",
  "month",
  "dayOfWeek",
];

export function CronBuilder() {
  const t = useTranslations("tools.cronParser.ui");

  const { builderFields, setBuilderField, applyBuilderToExpression } =
    useCronStore();

  const handleApply = () => {
    applyBuilderToExpression();
  };

  // 현재 빌더 값으로 생성될 표현식 미리보기
  const previewExpression = `${builderFields.minute} ${builderFields.hour} ${builderFields.dayOfMonth} ${builderFields.month} ${builderFields.dayOfWeek}`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          {t("builder")}
        </CardTitle>
        <CardDescription>{t("builderDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FIELD_ORDER.map((field) => (
            <FieldSelector
              key={field}
              field={field}
              value={builderFields[field]}
              onChange={(value) => setBuilderField(field, value)}
            />
          ))}
        </div>

        {/* 미리보기 */}
        <div className="flex items-center gap-4 pt-2 border-t">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{t("preview")}</p>
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {previewExpression}
            </code>
          </div>
          <Button onClick={handleApply}>
            <Wand2 className="h-4 w-4 mr-2" />
            {t("apply")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
