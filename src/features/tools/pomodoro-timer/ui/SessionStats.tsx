"use client";

import { useTranslations } from "next-intl";
import { Trophy, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { DailyStats, PomodoroSettings } from "../model/types";
import { formatDuration } from "../lib/timer-utils";

interface SessionStatsProps {
  stats: DailyStats;
  currentSessionIndex: number;
  settings: PomodoroSettings;
}

export function SessionStats({
  stats,
  currentSessionIndex,
  settings,
}: SessionStatsProps) {
  const t = useTranslations("tools.pomodoroTimer.ui");

  const statItems = [
    {
      icon: Trophy,
      label: t("completedSessions"),
      value: stats.completedSessions.toString(),
      color: "text-amber-500",
    },
    {
      icon: Clock,
      label: t("totalFocusTime"),
      value: formatDuration(stats.totalFocusMinutes),
      color: "text-blue-500",
    },
    {
      icon: Target,
      label: t("currentStreak"),
      value: `${currentSessionIndex} / ${settings.sessionsUntilLongBreak}`,
      color: "text-green-500",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5" />
          {t("todayStats")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
              </div>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
