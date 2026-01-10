// 시간대 정보
export interface TimezoneInfo {
  id: string // IANA timezone ID (예: "Asia/Seoul")
  name: string // 표시 이름 (예: "서울")
  offset: string // UTC 오프셋 (예: "+09:00")
  offsetMinutes: number // 분 단위 오프셋 (예: 540)
  abbreviation: string // 약어 (예: "KST")
}

// 변환된 시간 정보
export interface ConvertedTime {
  id: string // 고유 ID
  timezone: TimezoneInfo
  dateTime: Date
  formattedTime: string
  formattedDate: string
  isNextDay: boolean
  isPrevDay: boolean
}

// 입력 시간 모드
export type TimeInputMode = "current" | "custom"

// 시간 포맷 옵션
export type TimeFormat = "12h" | "24h"

// 날짜 포맷 옵션
export type DateFormat = "short" | "long" | "iso"

// 스토어 설정
export interface TimezoneSettings {
  timeFormat: TimeFormat
  dateFormat: DateFormat
  showSeconds: boolean
}

export const DEFAULT_SETTINGS: TimezoneSettings = {
  timeFormat: "24h",
  dateFormat: "long",
  showSeconds: false,
}

// 인기 시간대 목록
export const POPULAR_TIMEZONES: string[] = [
  "Asia/Seoul",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Australia/Sydney",
  "Pacific/Auckland",
  "UTC",
]

// 시간대 이름 매핑 (한국어)
export const TIMEZONE_NAMES: Record<string, string> = {
  "Asia/Seoul": "서울",
  "Asia/Tokyo": "도쿄",
  "Asia/Shanghai": "상하이",
  "Asia/Singapore": "싱가포르",
  "Asia/Dubai": "두바이",
  "Asia/Hong_Kong": "홍콩",
  "Asia/Bangkok": "방콕",
  "Asia/Kolkata": "뭄바이",
  "America/New_York": "뉴욕",
  "America/Los_Angeles": "로스앤젤레스",
  "America/Chicago": "시카고",
  "America/Toronto": "토론토",
  "America/Vancouver": "밴쿠버",
  "America/Sao_Paulo": "상파울루",
  "Europe/London": "런던",
  "Europe/Paris": "파리",
  "Europe/Berlin": "베를린",
  "Europe/Moscow": "모스크바",
  "Europe/Rome": "로마",
  "Europe/Madrid": "마드리드",
  "Australia/Sydney": "시드니",
  "Australia/Melbourne": "멜버른",
  "Pacific/Auckland": "오클랜드",
  "Pacific/Honolulu": "호놀룰루",
  UTC: "UTC",
}
