"use client";

import { useLocale } from "next-intl";
import { cn } from "@/shared/lib/utils";
import { CountdownDisplay as CountdownDisplayType, getThemeConfig, TIME_LABELS } from "../model/types";
import { useCountdownStore } from "../model/useCountdownStore";
import { padNumber } from "../lib/countdown-utils";

interface CountdownDisplayProps {
  countdown: CountdownDisplayType;
}

export function CountdownDisplay({ countdown }: CountdownDisplayProps) {
  const locale = useLocale() as keyof typeof TIME_LABELS;
  const { config } = useCountdownStore();
  const theme = getThemeConfig(config.theme);
  const labels = TIME_LABELS[locale] || TIME_LABELS.en;

  const backgroundStyle =
    theme.gradientFrom && theme.gradientTo
      ? { background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})` }
      : { backgroundColor: theme.backgroundColor };

  const glowStyle = theme.hasGlow && theme.glowColor
    ? { textShadow: `0 0 10px ${theme.glowColor}, 0 0 20px ${theme.glowColor}, 0 0 30px ${theme.glowColor}` }
    : {};

  const boxGlowStyle = theme.hasGlow && theme.glowColor
    ? { boxShadow: `0 0 10px ${theme.glowColor}33, inset 0 0 10px ${theme.glowColor}22` }
    : {};

  const timeUnits = [
    { key: "days", value: countdown.days, label: labels.days },
    { key: "hours", value: countdown.hours, label: labels.hours },
    { key: "minutes", value: countdown.minutes, label: labels.minutes },
    { key: "seconds", value: countdown.seconds, label: labels.seconds },
  ];

  return (
    <div
      className="flex flex-col items-center justify-center p-6"
      style={{
        ...backgroundStyle,
        borderRadius: config.borderRadius,
        fontFamily: theme.fontFamily,
        minWidth: config.width,
        minHeight: config.height,
      }}
    >
      {config.title && (
        <div
          className="mb-4 font-semibold"
          style={{
            color: theme.textColor,
            fontSize: config.fontSize * 0.4,
          }}
        >
          {config.title}
        </div>
      )}
      <div className="flex gap-4 items-center">
        {timeUnits.map(({ key, value, label }) => (
          <div
            key={key}
            className={cn(
              "flex flex-col items-center border-2",
              "px-4 py-3"
            )}
            style={{
              backgroundColor: theme.boxBackgroundColor,
              borderColor: theme.boxBorderColor,
              borderRadius: config.borderRadius * 0.5,
              minWidth: config.fontSize * 1.5,
              ...boxGlowStyle,
            }}
          >
            <span
              className="font-bold leading-none"
              style={{
                color: theme.textColor,
                fontSize: config.fontSize,
                ...glowStyle,
              }}
            >
              {padNumber(value, key === "days" && countdown.days >= 100 ? 3 : 2)}
            </span>
            {config.showLabels && (
              <span
                className="mt-1 uppercase"
                style={{
                  color: theme.labelColor,
                  fontSize: config.fontSize * 0.25,
                }}
              >
                {label}
              </span>
            )}
          </div>
        ))}
      </div>
      {countdown.isExpired && (
        <div
          className="mt-4 font-medium"
          style={{ color: theme.textColor, fontSize: config.fontSize * 0.3 }}
        >
          Expired
        </div>
      )}
    </div>
  );
}
