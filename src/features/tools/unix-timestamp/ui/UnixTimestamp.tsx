"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { toast } from "sonner";
import { Copy, Trash2, ArrowRight, Clock, Calendar, RefreshCw } from "lucide-react";
import { CurrentTimeDisplay } from "./CurrentTimeDisplay";
import {
  timestampToDate,
  dateToTimestamp,
  formatDate,
  parseDate,
  getRelativeTime,
  getCurrentTimestamp,
  isValidTimestamp,
  detectTimestampUnit,
} from "../lib/timestamp-utils";
import {
  TimestampUnit,
  DateFormat,
  COMMON_TIMEZONES,
  DATE_FORMATS,
} from "../model/types";

export function UnixTimestamp() {
  const t = useTranslations("tools.unixTimestamp.ui");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  // Timestamp to Date
  const [timestampInput, setTimestampInput] = useState("");
  const [timestampUnit, setTimestampUnit] = useState<TimestampUnit>("seconds");
  const [dateOutput, setDateOutput] = useState("");
  const [relativeTime, setRelativeTime] = useState("");
  const [timestampError, setTimestampError] = useState<string | null>(null);

  // Date to Timestamp
  const [dateInput, setDateInput] = useState("");
  const [dateUnit, setDateUnit] = useState<TimestampUnit>("seconds");
  const [timestampOutput, setTimestampOutput] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  // 공통 옵션
  const [dateFormat, setDateFormat] = useState<DateFormat>("iso8601");
  const [timezone, setTimezone] = useState("Asia/Seoul");

  // Timestamp -> Date 변환
  const convertTimestampToDate = useCallback(() => {
    if (!timestampInput.trim()) {
      setDateOutput("");
      setRelativeTime("");
      setTimestampError(null);
      return;
    }

    if (!isValidTimestamp(timestampInput)) {
      setDateOutput("");
      setRelativeTime("");
      setTimestampError(t("invalidTimestamp"));
      return;
    }

    const ts = parseInt(timestampInput, 10);
    const detectedUnit = detectTimestampUnit(timestampInput);

    // 자동 감지된 단위로 업데이트
    if (detectedUnit !== timestampUnit) {
      setTimestampUnit(detectedUnit);
    }

    const date = timestampToDate(ts, detectedUnit);
    const formatted = formatDate(date, dateFormat, timezone);
    const relative = getRelativeTime(date, locale);

    setDateOutput(formatted);
    setRelativeTime(relative);
    setTimestampError(null);
  }, [timestampInput, timestampUnit, dateFormat, timezone, locale, t]);

  // Date -> Timestamp 변환
  const convertDateToTimestamp = useCallback(() => {
    if (!dateInput.trim()) {
      setTimestampOutput("");
      setDateError(null);
      return;
    }

    const date = parseDate(dateInput);
    if (!date) {
      setTimestampOutput("");
      setDateError(t("invalidDate"));
      return;
    }

    const ts = dateToTimestamp(date, dateUnit);
    setTimestampOutput(ts.toString());
    setDateError(null);
  }, [dateInput, dateUnit, t]);

  // 실시간 변환
  useEffect(() => {
    const timeoutId = setTimeout(convertTimestampToDate, 200);
    return () => clearTimeout(timeoutId);
  }, [convertTimestampToDate]);

  useEffect(() => {
    const timeoutId = setTimeout(convertDateToTimestamp, 200);
    return () => clearTimeout(timeoutId);
  }, [convertDateToTimestamp]);

  const handleCopy = async (text: string) => {
    if (!text) {
      toast.error(t("nothingToCopy"));
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success(tCommon("toast.copied"));
    } catch {
      toast.error(tCommon("toast.copyError"));
    }
  };

  const handleNowTimestamp = () => {
    const ts = getCurrentTimestamp(timestampUnit);
    setTimestampInput(ts.toString());
  };

  const handleNowDate = () => {
    const now = new Date().toISOString().slice(0, 19);
    setDateInput(now);
  };

  const handleClearTimestamp = () => {
    setTimestampInput("");
    setDateOutput("");
    setRelativeTime("");
    setTimestampError(null);
  };

  const handleClearDate = () => {
    setDateInput("");
    setTimestampOutput("");
    setDateError(null);
  };

  return (
    <div className="space-y-6">
      {/* 현재 시간 표시 */}
      <CurrentTimeDisplay />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timestamp -> Date */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("timestampToDate")}
            </CardTitle>
            <CardDescription>{t("timestampToDateDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("timestamp")}</label>
              <div className="flex gap-2">
                <Input
                  value={timestampInput}
                  onChange={(e) => setTimestampInput(e.target.value.replace(/[^0-9-]/g, ''))}
                  placeholder={t("timestampPlaceholder")}
                  className="font-mono flex-1"
                />
                <Button variant="outline" size="icon" onClick={handleNowTimestamp} title={t("now")}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              {timestampError && (
                <p className="text-sm text-destructive">{timestampError}</p>
              )}
            </div>

            {/* 단위 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("unit")}</label>
              <Select value={timestampUnit} onValueChange={(v) => setTimestampUnit(v as TimestampUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">{t("seconds")} (s)</SelectItem>
                  <SelectItem value="milliseconds">{t("milliseconds")} (ms)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 결과 */}
            {dateOutput && (
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-sm font-medium">{t("result")}</span>
                </div>
                <div className="bg-muted/50 rounded-md p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono break-all">{dateOutput}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(dateOutput)}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {relativeTime && (
                    <p className="text-sm text-muted-foreground">
                      {t("relativeTime")}: {relativeTime}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button variant="outline" size="sm" onClick={handleClearTimestamp} className="w-full">
              <Trash2 className="h-4 w-4 mr-1" />
              {t("clear")}
            </Button>
          </CardContent>
        </Card>

        {/* Date -> Timestamp */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t("dateToTimestamp")}
            </CardTitle>
            <CardDescription>{t("dateToTimestampDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("dateTime")}</label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="font-mono flex-1"
                />
                <Button variant="outline" size="icon" onClick={handleNowDate} title={t("now")}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              {dateError && (
                <p className="text-sm text-destructive">{dateError}</p>
              )}
            </div>

            {/* 단위 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("unit")}</label>
              <Select value={dateUnit} onValueChange={(v) => setDateUnit(v as TimestampUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">{t("seconds")} (s)</SelectItem>
                  <SelectItem value="milliseconds">{t("milliseconds")} (ms)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 결과 */}
            {timestampOutput && (
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-sm font-medium">{t("result")}</span>
                </div>
                <div className="bg-muted/50 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <code className="text-lg font-mono font-bold">{timestampOutput}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(timestampOutput)}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Button variant="outline" size="sm" onClick={handleClearDate} className="w-full">
              <Trash2 className="h-4 w-4 mr-1" />
              {t("clear")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 옵션 카드 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("options")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* 날짜 포맷 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("format")}</label>
              <Select value={dateFormat} onValueChange={(v) => setDateFormat(v as DateFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_FORMATS.map((fmt) => (
                    <SelectItem key={fmt.value} value={fmt.value}>
                      {locale === 'ko' ? fmt.label : fmt.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 타임존 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("timezone")}</label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {locale === 'ko' ? tz.label : tz.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
