import {
  TimezoneInfo,
  ConvertedTime,
  TimezoneSettings,
  TIMEZONE_NAMES,
} from "../model/types"

/**
 * 사용자의 로컬 시간대 ID 반환
 */
export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * 브라우저에서 지원하는 모든 시간대 목록 반환
 */
export function getAllTimezones(): string[] {
  try {
    return Intl.supportedValuesOf("timeZone")
  } catch {
    // 폴백: 주요 시간대만 반환
    return Object.keys(TIMEZONE_NAMES)
  }
}

/**
 * UTC 오프셋(분) 계산
 */
export function getTimezoneOffsetMinutes(
  timezoneId: string,
  date: Date = new Date()
): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezoneId,
    timeZoneName: "longOffset",
  })

  const parts = formatter.formatToParts(date)
  const offsetPart = parts.find((p) => p.type === "timeZoneName")

  if (!offsetPart) return 0

  // "GMT+09:00" 형식에서 분 추출
  const match = offsetPart.value.match(/GMT([+-])(\d{1,2}):?(\d{2})?/)
  if (!match) return 0

  const sign = match[1] === "+" ? 1 : -1
  const hours = parseInt(match[2], 10)
  const minutes = parseInt(match[3] || "0", 10)

  return sign * (hours * 60 + minutes)
}

/**
 * UTC 오프셋 문자열 생성
 */
export function formatOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? "+" : "-"
  const absMinutes = Math.abs(offsetMinutes)
  const hours = Math.floor(absMinutes / 60)
  const minutes = absMinutes % 60
  return `${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

/**
 * 시간대 약어 반환
 */
export function getTimezoneAbbreviation(
  timezoneId: string,
  date: Date = new Date()
): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezoneId,
    timeZoneName: "short",
  })

  const parts = formatter.formatToParts(date)
  const tzPart = parts.find((p) => p.type === "timeZoneName")
  return tzPart?.value || ""
}

/**
 * 시간대 표시 이름 반환 (한국어)
 */
export function getTimezoneName(timezoneId: string): string {
  if (TIMEZONE_NAMES[timezoneId]) {
    return TIMEZONE_NAMES[timezoneId]
  }

  // IANA ID에서 도시 이름 추출
  const parts = timezoneId.split("/")
  const city = parts[parts.length - 1].replace(/_/g, " ")
  return city
}

/**
 * 시간대 ID로 TimezoneInfo 객체 생성
 */
export function getTimezoneInfo(
  timezoneId: string,
  referenceDate: Date = new Date()
): TimezoneInfo {
  const offsetMinutes = getTimezoneOffsetMinutes(timezoneId, referenceDate)

  return {
    id: timezoneId,
    name: getTimezoneName(timezoneId),
    offset: formatOffset(offsetMinutes),
    offsetMinutes,
    abbreviation: getTimezoneAbbreviation(timezoneId, referenceDate),
  }
}

/**
 * 시간 포맷팅
 */
export function formatTime(
  date: Date,
  timezoneId: string,
  format: "12h" | "24h",
  showSeconds: boolean
): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezoneId,
    hour: "2-digit",
    minute: "2-digit",
    hour12: format === "12h",
  }

  if (showSeconds) {
    options.second = "2-digit"
  }

  return new Intl.DateTimeFormat("ko-KR", options).format(date)
}

/**
 * 날짜 포맷팅
 */
export function formatDate(
  date: Date,
  timezoneId: string,
  format: "short" | "long" | "iso"
): string {
  if (format === "iso") {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezoneId,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
    const formatted = new Intl.DateTimeFormat("sv-SE", options).format(date)
    return formatted
  }

  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezoneId,
    year: "numeric",
    month: format === "long" ? "long" : "numeric",
    day: "numeric",
    weekday: format === "long" ? "short" : undefined,
  }

  return new Intl.DateTimeFormat("ko-KR", options).format(date)
}

/**
 * 두 날짜가 다른 날인지 확인
 */
export function compareDates(
  sourceDate: Date,
  sourceTimezone: string,
  targetTimezone: string
): { isNextDay: boolean; isPrevDay: boolean } {
  const sourceDay = new Intl.DateTimeFormat("en-US", {
    timeZone: sourceTimezone,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(sourceDate)

  const targetDay = new Intl.DateTimeFormat("en-US", {
    timeZone: targetTimezone,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(sourceDate)

  if (sourceDay === targetDay) {
    return { isNextDay: false, isPrevDay: false }
  }

  // 날짜 비교
  const [sourceMonth, sourceDayNum, sourceYear] = sourceDay.split("/").map(Number)
  const [targetMonth, targetDayNum, targetYear] = targetDay.split("/").map(Number)

  const sourceDateTime = new Date(sourceYear, sourceMonth - 1, sourceDayNum)
  const targetDateTime = new Date(targetYear, targetMonth - 1, targetDayNum)

  if (targetDateTime > sourceDateTime) {
    return { isNextDay: true, isPrevDay: false }
  } else {
    return { isNextDay: false, isPrevDay: true }
  }
}

/**
 * 시간대 간 시간 변환
 */
export function convertToTimezone(
  date: Date,
  fromTimezone: string,
  toTimezone: string,
  settings: TimezoneSettings
): ConvertedTime {
  const timezone = getTimezoneInfo(toTimezone, date)
  const { isNextDay, isPrevDay } = compareDates(date, fromTimezone, toTimezone)

  return {
    id: `${toTimezone}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timezone,
    dateTime: date,
    formattedTime: formatTime(
      date,
      toTimezone,
      settings.timeFormat,
      settings.showSeconds
    ),
    formattedDate: formatDate(date, toTimezone, settings.dateFormat),
    isNextDay,
    isPrevDay,
  }
}

/**
 * 여러 시간대로 일괄 변환
 */
export function convertToMultipleTimezones(
  date: Date,
  fromTimezone: string,
  toTimezones: string[],
  settings: TimezoneSettings
): ConvertedTime[] {
  return toTimezones.map((tz) =>
    convertToTimezone(date, fromTimezone, tz, settings)
  )
}

/**
 * 시간대 검색/필터링
 */
export function searchTimezones(query: string, timezones?: string[]): string[] {
  const allTimezones = timezones || getAllTimezones()
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) return allTimezones

  return allTimezones.filter((tz) => {
    const tzLower = tz.toLowerCase()
    const name = getTimezoneName(tz).toLowerCase()

    return tzLower.includes(lowerQuery) || name.includes(lowerQuery)
  })
}

/**
 * 클립보드에 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * 시간대별 현재 시간 포맷 문자열 생성 (공유용)
 */
export function generateShareText(convertedTimes: ConvertedTime[]): string {
  return convertedTimes
    .map(
      (ct) =>
        `${ct.timezone.name} (${ct.timezone.abbreviation}): ${ct.formattedTime} ${ct.formattedDate}`
    )
    .join("\n")
}
