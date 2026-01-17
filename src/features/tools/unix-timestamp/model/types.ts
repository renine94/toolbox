export type TimestampUnit = 'seconds' | 'milliseconds';

export type DateFormat = 'iso8601' | 'rfc2822' | 'locale' | 'utc';

export interface TimestampState {
  timestamp: string;
  dateTime: string;
  unit: TimestampUnit;
  format: DateFormat;
  timezone: string;
}

export const COMMON_TIMEZONES = [
  { value: 'Asia/Seoul', label: '서울 (KST)', labelEn: 'Seoul (KST)' },
  { value: 'Asia/Tokyo', label: '도쿄 (JST)', labelEn: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: '상하이 (CST)', labelEn: 'Shanghai (CST)' },
  { value: 'America/New_York', label: '뉴욕 (EST/EDT)', labelEn: 'New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: '로스앤젤레스 (PST/PDT)', labelEn: 'Los Angeles (PST/PDT)' },
  { value: 'Europe/London', label: '런던 (GMT/BST)', labelEn: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: '파리 (CET/CEST)', labelEn: 'Paris (CET/CEST)' },
  { value: 'UTC', label: 'UTC', labelEn: 'UTC' },
] as const;

export const DATE_FORMATS: { value: DateFormat; label: string; labelEn: string }[] = [
  { value: 'iso8601', label: 'ISO 8601', labelEn: 'ISO 8601' },
  { value: 'rfc2822', label: 'RFC 2822', labelEn: 'RFC 2822' },
  { value: 'locale', label: '로컬 형식', labelEn: 'Local Format' },
  { value: 'utc', label: 'UTC', labelEn: 'UTC' },
];

export const DEFAULT_STATE: TimestampState = {
  timestamp: '',
  dateTime: '',
  unit: 'seconds',
  format: 'iso8601',
  timezone: 'Asia/Seoul',
};
