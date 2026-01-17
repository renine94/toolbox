import { TimestampUnit, DateFormat } from '../model/types';

/**
 * 타임스탬프를 Date 객체로 변환합니다.
 */
export function timestampToDate(ts: number, unit: TimestampUnit): Date {
  const milliseconds = unit === 'seconds' ? ts * 1000 : ts;
  return new Date(milliseconds);
}

/**
 * Date 객체를 타임스탬프로 변환합니다.
 */
export function dateToTimestamp(date: Date, unit: TimestampUnit): number {
  const ms = date.getTime();
  return unit === 'seconds' ? Math.floor(ms / 1000) : ms;
}

/**
 * 날짜를 지정된 포맷으로 변환합니다.
 */
export function formatDate(date: Date, format: DateFormat, timezone: string): string {
  if (isNaN(date.getTime())) {
    return '';
  }

  try {
    switch (format) {
      case 'iso8601':
        return formatISO8601(date, timezone);
      case 'rfc2822':
        return formatRFC2822(date, timezone);
      case 'locale':
        return formatLocale(date, timezone);
      case 'utc':
        return date.toISOString();
      default:
        return date.toISOString();
    }
  } catch {
    return date.toISOString();
  }
}

/**
 * ISO 8601 형식으로 포맷팅합니다.
 */
function formatISO8601(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value || '';

  const offset = getTimezoneOffset(date, timezone);
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}${offset}`;
}

/**
 * RFC 2822 형식으로 포맷팅합니다.
 */
function formatRFC2822(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value || '';

  const offset = getTimezoneOffset(date, timezone);
  return `${get('weekday')}, ${get('day')} ${get('month')} ${get('year')} ${get('hour')}:${get('minute')}:${get('second')} ${offset.replace(':', '')}`;
}

/**
 * 로컬 형식으로 포맷팅합니다.
 */
function formatLocale(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * 타임존 오프셋을 계산합니다.
 */
function getTimezoneOffset(date: Date, timezone: string): string {
  if (timezone === 'UTC') return '+00:00';

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });

    const parts = formatter.formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName')?.value || '';

    // GMT+9 -> +09:00
    const match = tzPart.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (match) {
      const sign = match[1];
      const hours = match[2].padStart(2, '0');
      const minutes = match[3] || '00';
      return `${sign}${hours}:${minutes}`;
    }

    return '+00:00';
  } catch {
    return '+00:00';
  }
}

/**
 * 날짜 문자열을 파싱합니다.
 */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr.trim()) return null;

  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * 상대 시간을 계산합니다.
 */
export function getRelativeTime(date: Date, locale: string = 'ko'): string {
  const now = Date.now();
  const diff = now - date.getTime();

  const seconds = Math.floor(Math.abs(diff) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const isPast = diff > 0;

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (years > 0) {
    return formatter.format(isPast ? -years : years, 'year');
  }
  if (months > 0) {
    return formatter.format(isPast ? -months : months, 'month');
  }
  if (days > 0) {
    return formatter.format(isPast ? -days : days, 'day');
  }
  if (hours > 0) {
    return formatter.format(isPast ? -hours : hours, 'hour');
  }
  if (minutes > 0) {
    return formatter.format(isPast ? -minutes : minutes, 'minute');
  }
  return formatter.format(isPast ? -seconds : seconds, 'second');
}

/**
 * 현재 타임스탬프를 반환합니다.
 */
export function getCurrentTimestamp(unit: TimestampUnit): number {
  const now = Date.now();
  return unit === 'seconds' ? Math.floor(now / 1000) : now;
}

/**
 * 타임스탬프가 유효한지 확인합니다.
 */
export function isValidTimestamp(ts: string): boolean {
  const num = parseInt(ts, 10);
  if (isNaN(num)) return false;

  // 음수 타임스탬프도 허용 (1970년 이전)
  // 합리적인 범위: 1900년 ~ 3000년
  const minSeconds = -2208988800; // 1900-01-01
  const maxSeconds = 32503680000; // 3000-01-01

  // 13자리 이상이면 밀리초로 가정
  if (ts.length >= 13) {
    const seconds = num / 1000;
    return seconds >= minSeconds && seconds <= maxSeconds;
  }

  return num >= minSeconds && num <= maxSeconds;
}

/**
 * 타임스탬프 단위를 자동 감지합니다.
 */
export function detectTimestampUnit(ts: string): TimestampUnit {
  const num = Math.abs(parseInt(ts, 10));
  // 13자리 이상이면 밀리초
  return ts.replace('-', '').length >= 13 ? 'milliseconds' : 'seconds';
}
