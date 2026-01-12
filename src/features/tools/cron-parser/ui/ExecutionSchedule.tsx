"use client";

import { useTranslations } from "next-intl";
import { Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useCronStore } from "../model/useCronStore";

const COUNT_OPTIONS = [5, 10, 20, 50];

export function ExecutionSchedule() {
  const t = useTranslations("tools.cronParser.ui");

  const { nextExecutions, executionCount, setExecutionCount, parsed } =
    useCronStore();

  if (!parsed?.isValid) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t("nextExecutions")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t("enterValidExpression")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t("nextExecutions")}
          </CardTitle>
          <Select
            value={String(executionCount)}
            onValueChange={(v) => setExecutionCount(Number(v))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNT_OPTIONS.map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {count} {t("count")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {nextExecutions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noExecutions")}</p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {nextExecutions.map((execution, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">
                      {execution.formatted}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {execution.relative}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
