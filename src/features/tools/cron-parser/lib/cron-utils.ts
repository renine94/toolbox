import {
  ParsedCronExpression,
  CronFieldValue,
  CronFieldType,
  NextExecution,
  CRON_FIELDS,
  MONTH_NAMES,
  DAY_NAMES,
} from "../model/types";

/**
 * 고유 ID 생성
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 개별 필드 파싱
 */
export function parseField(
  value: string,
  fieldType: CronFieldType
): CronFieldValue {
  const meta = CRON_FIELDS.find((f) => f.name === fieldType)!;
  const result: CronFieldValue = {
    type: "any",
    value,
    parsed: [],
    isValid: true,
  };

  try {
    const trimmed = value.trim();

    if (!trimmed) {
      return { ...result, isValid: false, error: "Empty value" };
    }

    // * (any)
    if (trimmed === "*") {
      result.type = "any";
      result.parsed = Array.from(
        { length: meta.max - meta.min + 1 },
        (_, i) => meta.min + i
      );
      return result;
    }

    // 리스트 (콤마)
    if (trimmed.includes(",")) {
      result.type = "list";
      const parts = trimmed.split(",");
      const values: number[] = [];

      for (const part of parts) {
        const subResult = parseField(part.trim(), fieldType);
        if (!subResult.isValid) {
          return { ...result, isValid: false, error: subResult.error };
        }
        values.push(...subResult.parsed);
      }

      result.parsed = [...new Set(values)].sort((a, b) => a - b);
      return result;
    }

    // 스텝 (/)
    if (trimmed.includes("/")) {
      result.type = "step";
      const [range, stepStr] = trimmed.split("/");
      const step = parseInt(stepStr, 10);

      if (isNaN(step) || step <= 0) {
        return { ...result, isValid: false, error: "Invalid step value" };
      }

      let start = meta.min;
      let end = meta.max;

      if (range !== "*") {
        if (range.includes("-")) {
          const [rangeStart, rangeEnd] = range.split("-").map(Number);
          start = rangeStart;
          end = rangeEnd;
        } else {
          start = parseInt(range, 10);
        }
      }

      if (isNaN(start) || isNaN(end)) {
        return { ...result, isValid: false, error: "Invalid range" };
      }

      const values: number[] = [];
      for (let i = start; i <= end; i += step) {
        values.push(i);
      }
      result.parsed = values;
      return result;
    }

    // 범위 (-)
    if (trimmed.includes("-")) {
      result.type = "range";
      const parts = trimmed.split("-");

      if (parts.length !== 2) {
        return { ...result, isValid: false, error: "Invalid range format" };
      }

      const start = parseFieldValue(parts[0], fieldType, meta.min, meta.max);
      const end = parseFieldValue(parts[1], fieldType, meta.min, meta.max);

      if (start === null || end === null) {
        return { ...result, isValid: false, error: "Invalid range values" };
      }

      if (start > end) {
        return {
          ...result,
          isValid: false,
          error: "Start must be less than end",
        };
      }

      result.parsed = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );
      return result;
    }

    // 단일 값
    const num = parseFieldValue(trimmed, fieldType, meta.min, meta.max);

    if (num === null) {
      return { ...result, isValid: false, error: "Invalid value" };
    }

    if (num < meta.min || num > meta.max) {
      return {
        ...result,
        isValid: false,
        error: `Value out of range (${meta.min}-${meta.max})`,
      };
    }

    result.type = "specific";
    result.parsed = [num];
    return result;
  } catch {
    return { ...result, isValid: false, error: "Parse error" };
  }
}

/**
 * 필드 값 파싱 (숫자 또는 이름)
 */
function parseFieldValue(
  value: string,
  fieldType: CronFieldType,
  min: number,
  max: number
): number | null {
  const trimmed = value.trim().toUpperCase();

  // 숫자인 경우
  const num = parseInt(trimmed, 10);
  if (!isNaN(num)) {
    if (num >= min && num <= max) {
      return num;
    }
    return null;
  }

  // 월 이름 처리
  if (fieldType === "month") {
    const idx = MONTH_NAMES.indexOf(trimmed);
    if (idx !== -1) {
      return idx + 1;
    }
  }

  // 요일 이름 처리
  if (fieldType === "dayOfWeek") {
    const idx = DAY_NAMES.indexOf(trimmed);
    if (idx !== -1) {
      return idx;
    }
  }

  return null;
}

/**
 * 전체 Cron 표현식 파싱
 */
export function parseCronExpression(expression: string): ParsedCronExpression {
  const defaultField: CronFieldValue = {
    type: "any",
    value: "",
    parsed: [],
    isValid: false,
  };

  const fields = expression.trim().split(/\s+/);
  const errors: string[] = [];

  // 5필드 표준 cron 형식 검증
  if (fields.length !== 5) {
    return {
      minute: { ...defaultField, error: "Invalid" },
      hour: { ...defaultField, error: "Invalid" },
      dayOfMonth: { ...defaultField, error: "Invalid" },
      month: { ...defaultField, error: "Invalid" },
      dayOfWeek: { ...defaultField, error: "Invalid" },
      isValid: false,
      errors: ["Expression must have exactly 5 fields"],
    };
  }

  const minute = parseField(fields[0], "minute");
  const hour = parseField(fields[1], "hour");
  const dayOfMonth = parseField(fields[2], "dayOfMonth");
  const month = parseField(fields[3], "month");
  const dayOfWeek = parseField(fields[4], "dayOfWeek");

  if (!minute.isValid) errors.push(`Minute: ${minute.error}`);
  if (!hour.isValid) errors.push(`Hour: ${hour.error}`);
  if (!dayOfMonth.isValid) errors.push(`Day of Month: ${dayOfMonth.error}`);
  if (!month.isValid) errors.push(`Month: ${month.error}`);
  if (!dayOfWeek.isValid) errors.push(`Day of Week: ${dayOfWeek.error}`);

  return {
    minute,
    hour,
    dayOfMonth,
    month,
    dayOfWeek,
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 다음 N개 실행 시간 계산
 */
export function getNextExecutions(
  expression: string,
  count: number = 10,
  locale: string = "ko"
): NextExecution[] {
  const parsed = parseCronExpression(expression);
  if (!parsed.isValid) return [];

  const executions: NextExecution[] = [];
  const now = new Date();
  let current = new Date(now);

  // 초와 밀리초를 0으로 설정
  current.setSeconds(0, 0);

  const maxIterations = 525600; // 1년치 분
  let iterations = 0;

  while (executions.length < count && iterations < maxIterations) {
    iterations++;
    current = new Date(current.getTime() + 60000); // 1분 증가

    const minute = current.getMinutes();
    const hour = current.getHours();
    const dayOfMonth = current.getDate();
    const month = current.getMonth() + 1;
    const dayOfWeek = current.getDay();

    // 모든 필드가 매칭되는지 확인
    const minuteMatch = parsed.minute.parsed.includes(minute);
    const hourMatch = parsed.hour.parsed.includes(hour);
    const monthMatch = parsed.month.parsed.includes(month);

    // dayOfMonth와 dayOfWeek 중 하나만 매칭되면 됨 (둘 다 *가 아닌 경우)
    const dayOfMonthAny = parsed.dayOfMonth.type === "any";
    const dayOfWeekAny = parsed.dayOfWeek.type === "any";

    let dayMatch = false;
    if (dayOfMonthAny && dayOfWeekAny) {
      dayMatch = true;
    } else if (dayOfMonthAny) {
      dayMatch = parsed.dayOfWeek.parsed.includes(dayOfWeek);
    } else if (dayOfWeekAny) {
      dayMatch = parsed.dayOfMonth.parsed.includes(dayOfMonth);
    } else {
      // 둘 다 지정된 경우, OR 조건
      dayMatch =
        parsed.dayOfMonth.parsed.includes(dayOfMonth) ||
        parsed.dayOfWeek.parsed.includes(dayOfWeek);
    }

    if (minuteMatch && hourMatch && monthMatch && dayMatch) {
      executions.push({
        date: new Date(current),
        formatted: formatDate(current, locale),
        relative: getRelativeTime(current, now, locale),
      });
    }
  }

  return executions;
}

/**
 * 날짜 포맷팅
 */
function formatDate(date: Date, locale: string = "ko"): string {
  const localeStr = locale === "ko" ? "ko-KR" : "en-US";
  return date.toLocaleString(localeStr, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  });
}

/**
 * 상대 시간 계산
 */
function getRelativeTime(
  target: Date,
  now: Date,
  locale: string = "ko"
): string {
  const diffMs = target.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (locale === "ko") {
    if (diffDays > 0) {
      return `${diffDays}일 후`;
    } else if (diffHours > 0) {
      return `${diffHours}시간 후`;
    } else {
      return `${diffMins}분 후`;
    }
  } else {
    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      return `in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    } else {
      return `in ${diffMins} minute${diffMins > 1 ? "s" : ""}`;
    }
  }
}

/**
 * 표현식을 사람이 읽을 수 있는 설명으로 변환
 */
export function describeCronExpression(
  expression: string,
  locale: "ko" | "en" = "ko"
): string {
  const parsed = parseCronExpression(expression);
  if (!parsed.isValid) {
    return locale === "ko" ? "유효하지 않은 표현식" : "Invalid expression";
  }

  const parts: string[] = [];
  const dayNamesKo = ["일", "월", "화", "수", "목", "금", "토"];
  const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // 분
  if (parsed.minute.type === "any") {
    parts.push(locale === "ko" ? "매 분" : "every minute");
  } else if (
    parsed.minute.type === "specific" &&
    parsed.minute.parsed.length === 1
  ) {
    parts.push(
      locale === "ko"
        ? `${parsed.minute.parsed[0]}분`
        : `minute ${parsed.minute.parsed[0]}`
    );
  } else if (parsed.minute.type === "step") {
    const step = parsed.minute.value.split("/")[1];
    parts.push(locale === "ko" ? `${step}분마다` : `every ${step} minutes`);
  }

  // 시
  if (parsed.hour.type === "any" && parsed.minute.type !== "any") {
    parts.push(locale === "ko" ? "매 시간" : "every hour");
  } else if (
    parsed.hour.type === "specific" &&
    parsed.hour.parsed.length === 1
  ) {
    const hour = parsed.hour.parsed[0];
    if (locale === "ko") {
      parts.push(hour >= 12 ? `오후 ${hour === 12 ? 12 : hour - 12}시` : `오전 ${hour}시`);
    } else {
      parts.push(`at ${hour}:${String(parsed.minute.parsed[0] || 0).padStart(2, "0")}`);
    }
  } else if (parsed.hour.type === "step") {
    const step = parsed.hour.value.split("/")[1];
    parts.push(locale === "ko" ? `${step}시간마다` : `every ${step} hours`);
  }

  // 일
  if (
    parsed.dayOfMonth.type === "specific" &&
    parsed.dayOfMonth.parsed.length === 1
  ) {
    parts.push(
      locale === "ko"
        ? `${parsed.dayOfMonth.parsed[0]}일`
        : `on day ${parsed.dayOfMonth.parsed[0]}`
    );
  }

  // 월
  if (
    parsed.month.type === "specific" &&
    parsed.month.parsed.length === 1
  ) {
    parts.push(
      locale === "ko"
        ? `${parsed.month.parsed[0]}월`
        : `in ${MONTH_NAMES[parsed.month.parsed[0] - 1]}`
    );
  }

  // 요일
  if (parsed.dayOfWeek.type !== "any") {
    const days = parsed.dayOfWeek.parsed;
    const dayNames = locale === "ko" ? dayNamesKo : dayNamesEn;

    if (days.length === 5 && !days.includes(0) && !days.includes(6)) {
      parts.push(locale === "ko" ? "평일" : "weekdays");
    } else if (days.length === 2 && days.includes(0) && days.includes(6)) {
      parts.push(locale === "ko" ? "주말" : "weekends");
    } else {
      const dayStr = days.map((d) => dayNames[d]).join(", ");
      parts.push(locale === "ko" ? `${dayStr}요일` : `on ${dayStr}`);
    }
  }

  if (parts.length === 0) {
    return locale === "ko" ? "매 분 실행" : "runs every minute";
  }

  return parts.join(" ");
}

/**
 * 필드 값을 사람이 읽을 수 있는 설명으로 변환
 */
export function describeFieldValue(
  field: CronFieldValue,
  fieldType: CronFieldType,
  locale: "ko" | "en" = "ko"
): string {
  if (!field.isValid) {
    return locale === "ko" ? "오류" : "Error";
  }

  if (field.type === "any") {
    return locale === "ko" ? "모든 값" : "Any";
  }

  if (field.type === "step") {
    const step = field.value.split("/")[1];
    return locale === "ko" ? `${step} 간격` : `Every ${step}`;
  }

  if (field.type === "range") {
    const [start, end] = field.value.split("-");
    return `${start}-${end}`;
  }

  if (field.type === "list") {
    return field.parsed.join(", ");
  }

  // specific
  if (fieldType === "dayOfWeek") {
    const dayNames =
      locale === "ko"
        ? ["일", "월", "화", "수", "목", "금", "토"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return field.parsed.map((d) => dayNames[d]).join(", ");
  }

  if (fieldType === "month" && field.parsed.length === 1) {
    return locale === "ko"
      ? `${field.parsed[0]}월`
      : MONTH_NAMES[field.parsed[0] - 1];
  }

  return field.parsed.join(", ");
}
