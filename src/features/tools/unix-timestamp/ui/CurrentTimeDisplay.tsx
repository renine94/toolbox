"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/shared/ui/card";
import { Clock } from "lucide-react";

export function CurrentTimeDisplay() {
  const t = useTranslations("tools.unixTimestamp.ui");
  const [currentTime, setCurrentTime] = useState<{
    seconds: number;
    milliseconds: number;
    date: string;
  } | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      setCurrentTime({
        seconds: Math.floor(now / 1000),
        milliseconds: now,
        date: new Date(now).toISOString(),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!currentTime) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="py-4">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="font-semibold text-primary">{t("currentTime")}</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 text-sm">
          <div className="bg-background/80 rounded-md p-2">
            <span className="text-muted-foreground text-xs block mb-1">{t("seconds")} (s)</span>
            <span className="font-mono font-medium">{currentTime.seconds}</span>
          </div>
          <div className="bg-background/80 rounded-md p-2">
            <span className="text-muted-foreground text-xs block mb-1">{t("milliseconds")} (ms)</span>
            <span className="font-mono font-medium">{currentTime.milliseconds}</span>
          </div>
          <div className="bg-background/80 rounded-md p-2">
            <span className="text-muted-foreground text-xs block mb-1">ISO 8601</span>
            <span className="font-mono font-medium text-xs">{currentTime.date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
