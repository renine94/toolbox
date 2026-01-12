import {
  CronPreset,
  CheatsheetField,
  CheatsheetSpecialChar,
} from "../model/types";

/**
 * Cron 프리셋 예제
 */
export const CRON_PRESETS: CronPreset[] = [
  // 일반적인 예제
  {
    expression: "* * * * *",
    labelKey: "everyMinute",
    descriptionKey: "everyMinuteDesc",
    category: "common",
  },
  {
    expression: "0 * * * *",
    labelKey: "everyHour",
    descriptionKey: "everyHourDesc",
    category: "common",
  },
  {
    expression: "0 0 * * *",
    labelKey: "everyDayMidnight",
    descriptionKey: "everyDayMidnightDesc",
    category: "common",
  },
  {
    expression: "0 9 * * 1-5",
    labelKey: "weekdaysNineAM",
    descriptionKey: "weekdaysNineAMDesc",
    category: "common",
  },
  {
    expression: "0 0 1 * *",
    labelKey: "firstDayOfMonth",
    descriptionKey: "firstDayOfMonthDesc",
    category: "common",
  },
  {
    expression: "0 0 * * 0",
    labelKey: "everySundayMidnight",
    descriptionKey: "everySundayMidnightDesc",
    category: "common",
  },
  // 고급 예제
  {
    expression: "*/15 * * * *",
    labelKey: "every15Minutes",
    descriptionKey: "every15MinutesDesc",
    category: "advanced",
  },
  {
    expression: "0 */2 * * *",
    labelKey: "every2Hours",
    descriptionKey: "every2HoursDesc",
    category: "advanced",
  },
  {
    expression: "30 4 1,15 * *",
    labelKey: "firstAndFifteenth",
    descriptionKey: "firstAndFifteenthDesc",
    category: "advanced",
  },
  {
    expression: "0 22 * * 1-5",
    labelKey: "weekdaysTenPM",
    descriptionKey: "weekdaysTenPMDesc",
    category: "advanced",
  },
];

/**
 * 치트시트 필드 정보
 */
export const CHEATSHEET_FIELDS: CheatsheetField[] = [
  { field: "minute", range: "0-59" },
  { field: "hour", range: "0-23" },
  { field: "dayOfMonth", range: "1-31" },
  { field: "month", range: "1-12" },
  { field: "dayOfWeek", range: "0-6 (Sun=0)" },
];

/**
 * 치트시트 특수 문자 정보
 */
export const CHEATSHEET_SPECIAL_CHARS: CheatsheetSpecialChar[] = [
  { char: "*", meaningKey: "anyValue" },
  { char: ",", meaningKey: "listValues" },
  { char: "-", meaningKey: "rangeValues" },
  { char: "/", meaningKey: "stepValues" },
];

/**
 * 프리셋을 카테고리별로 그룹화
 */
export function getPresetsByCategory(): {
  common: CronPreset[];
  advanced: CronPreset[];
} {
  return {
    common: CRON_PRESETS.filter((p) => p.category === "common"),
    advanced: CRON_PRESETS.filter((p) => p.category === "advanced"),
  };
}
