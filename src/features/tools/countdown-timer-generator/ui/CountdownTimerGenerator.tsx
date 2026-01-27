"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Timer, Settings, Palette, Download, RotateCcw } from "lucide-react";
import { DateTimePicker } from "./DateTimePicker";
import { StyleCustomizer } from "./StyleCustomizer";
import { TimerPreview } from "./TimerPreview";
import { ExportOptions } from "./ExportOptions";
import { useCountdownStore } from "../model/useCountdownStore";

export function CountdownTimerGenerator() {
  const t = useTranslations("tools.countdownTimerGenerator.ui");
  const { resetConfig } = useCountdownStore();

  return (
    <div className="space-y-6">
      {/* Main Section */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Panel - Preview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Timer className="h-5 w-5" />
                {t("preview")}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={resetConfig}>
                <RotateCcw className="h-4 w-4 mr-1" />
                {t("reset")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <TimerPreview />
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t("dateTimeSettings")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DateTimePicker />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t("styleSettings")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StyleCustomizer />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t("export")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExportOptions />
        </CardContent>
      </Card>
    </div>
  );
}
