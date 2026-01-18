"use client";

import { useTranslations } from "next-intl";
import { Settings, Bell, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { PomodoroSettings, SETTINGS_LIMITS, TimerStatus } from "../model/types";
import { isNotificationSupported } from "../lib/notification-utils";
import { isAudioSupported } from "../lib/sound-utils";

interface SettingsPanelProps {
  settings: PomodoroSettings;
  timerStatus: TimerStatus;
  onUpdateSettings: (settings: Partial<PomodoroSettings>) => void;
  onEnableNotifications: () => Promise<boolean>;
}

export function SettingsPanel({
  settings,
  timerStatus,
  onUpdateSettings,
  onEnableNotifications,
}: SettingsPanelProps) {
  const t = useTranslations("tools.pomodoroTimer.ui");

  const isTimerActive = timerStatus !== "idle";
  const notificationSupported = isNotificationSupported();
  const audioSupported = isAudioSupported();

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await onEnableNotifications();
      if (!granted) {
        return; // 권한 거부됨
      }
    }
    onUpdateSettings({ notificationEnabled: enabled });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          {t("settings")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 시간 설정 */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t("timeSettings")}
          </h4>

          {/* 작업 시간 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="work-duration">{t("workDuration")}</Label>
              <span className="text-sm text-muted-foreground">
                {settings.workDuration} {t("minutes")}
              </span>
            </div>
            <Slider
              id="work-duration"
              value={[settings.workDuration]}
              min={SETTINGS_LIMITS.workDuration.min}
              max={SETTINGS_LIMITS.workDuration.max}
              step={SETTINGS_LIMITS.workDuration.step}
              onValueChange={([value]) =>
                onUpdateSettings({ workDuration: value })
              }
              disabled={isTimerActive}
            />
          </div>

          {/* 휴식 시간 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="break-duration">{t("breakDuration")}</Label>
              <span className="text-sm text-muted-foreground">
                {settings.breakDuration} {t("minutes")}
              </span>
            </div>
            <Slider
              id="break-duration"
              value={[settings.breakDuration]}
              min={SETTINGS_LIMITS.breakDuration.min}
              max={SETTINGS_LIMITS.breakDuration.max}
              step={SETTINGS_LIMITS.breakDuration.step}
              onValueChange={([value]) =>
                onUpdateSettings({ breakDuration: value })
              }
              disabled={isTimerActive}
            />
          </div>

          {/* 긴 휴식 시간 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="long-break-duration">{t("longBreakDuration")}</Label>
              <span className="text-sm text-muted-foreground">
                {settings.longBreakDuration} {t("minutes")}
              </span>
            </div>
            <Slider
              id="long-break-duration"
              value={[settings.longBreakDuration]}
              min={SETTINGS_LIMITS.longBreakDuration.min}
              max={SETTINGS_LIMITS.longBreakDuration.max}
              step={SETTINGS_LIMITS.longBreakDuration.step}
              onValueChange={([value]) =>
                onUpdateSettings({ longBreakDuration: value })
              }
              disabled={isTimerActive}
            />
          </div>

          {/* 긴 휴식까지 세션 수 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sessions-until-long-break">
                {t("sessionsUntilLongBreak")}
              </Label>
              <span className="text-sm text-muted-foreground">
                {settings.sessionsUntilLongBreak} {t("sessions")}
              </span>
            </div>
            <Slider
              id="sessions-until-long-break"
              value={[settings.sessionsUntilLongBreak]}
              min={SETTINGS_LIMITS.sessionsUntilLongBreak.min}
              max={SETTINGS_LIMITS.sessionsUntilLongBreak.max}
              step={SETTINGS_LIMITS.sessionsUntilLongBreak.step}
              onValueChange={([value]) =>
                onUpdateSettings({ sessionsUntilLongBreak: value })
              }
              disabled={isTimerActive}
            />
          </div>
        </div>

        <Separator />

        {/* 자동 시작 설정 */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t("autoStart")}
          </h4>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-start-break" className="cursor-pointer">
              {t("autoStartBreak")}
            </Label>
            <Switch
              id="auto-start-break"
              checked={settings.autoStartBreak}
              onCheckedChange={(checked) =>
                onUpdateSettings({ autoStartBreak: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-start-work" className="cursor-pointer">
              {t("autoStartWork")}
            </Label>
            <Switch
              id="auto-start-work"
              checked={settings.autoStartWork}
              onCheckedChange={(checked) =>
                onUpdateSettings({ autoStartWork: checked })
              }
            />
          </div>
        </div>

        <Separator />

        {/* 알림 설정 */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t("notifications")}
          </h4>

          {/* 사운드 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="sound-enabled" className="cursor-pointer">
                {t("soundEnabled")}
              </Label>
            </div>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) =>
                onUpdateSettings({ soundEnabled: checked })
              }
              disabled={!audioSupported}
            />
          </div>

          {/* 브라우저 알림 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="notification-enabled" className="cursor-pointer">
                {t("notificationEnabled")}
              </Label>
            </div>
            <Switch
              id="notification-enabled"
              checked={settings.notificationEnabled}
              onCheckedChange={handleNotificationToggle}
              disabled={!notificationSupported}
            />
          </div>
        </div>

        {/* 타이머 활성 상태 안내 */}
        {isTimerActive && (
          <p className="text-xs text-muted-foreground text-center">
            {t("settingsDisabledHint")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
