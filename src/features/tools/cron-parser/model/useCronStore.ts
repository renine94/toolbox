import { create } from "zustand";
import {
  CronState,
  CronFieldType,
  CronPreset,
  DEFAULT_EXPRESSION,
  DEFAULT_BUILDER_FIELDS,
} from "./types";
import { parseCronExpression, getNextExecutions } from "../lib/cron-utils";

export const useCronStore = create<CronState>((set, get) => ({
  // 초기 상태
  expression: DEFAULT_EXPRESSION,
  parsed: null,
  nextExecutions: [],
  executionCount: 10,
  builderFields: { ...DEFAULT_BUILDER_FIELDS },

  // 표현식 설정 - 파싱 및 다음 실행 시간 계산
  setExpression: (expression: string) => {
    const parsed = parseCronExpression(expression);
    const nextExecutions = parsed.isValid
      ? getNextExecutions(expression, get().executionCount)
      : [];

    // 빌더 필드도 동기화
    const fields = expression.trim().split(/\s+/);
    const builderFields = {
      minute: fields[0] || "*",
      hour: fields[1] || "*",
      dayOfMonth: fields[2] || "*",
      month: fields[3] || "*",
      dayOfWeek: fields[4] || "*",
    };

    set({ expression, parsed, nextExecutions, builderFields });
  },

  // 실행 횟수 설정
  setExecutionCount: (count: number) => {
    const { expression, parsed } = get();
    const nextExecutions = parsed?.isValid
      ? getNextExecutions(expression, count)
      : [];
    set({ executionCount: count, nextExecutions });
  },

  // 빌더 필드 설정
  setBuilderField: (field: CronFieldType, value: string) => {
    const { builderFields } = get();
    set({
      builderFields: { ...builderFields, [field]: value },
    });
  },

  // 빌더 값을 표현식으로 적용
  applyBuilderToExpression: () => {
    const { builderFields, executionCount } = get();
    const expression = `${builderFields.minute} ${builderFields.hour} ${builderFields.dayOfMonth} ${builderFields.month} ${builderFields.dayOfWeek}`;
    const parsed = parseCronExpression(expression);
    const nextExecutions = parsed.isValid
      ? getNextExecutions(expression, executionCount)
      : [];
    set({ expression, parsed, nextExecutions });
  },

  // 프리셋 로드
  loadPreset: (preset: CronPreset) => {
    get().setExpression(preset.expression);
  },

  // 초기화
  clear: () => {
    set({
      expression: "",
      parsed: null,
      nextExecutions: [],
      builderFields: { ...DEFAULT_BUILDER_FIELDS },
    });
  },
}));

// 스토어 초기화 시 기본 표현식 파싱
if (typeof window !== "undefined") {
  // 클라이언트에서만 초기화
  setTimeout(() => {
    const state = useCronStore.getState();
    if (state.expression && !state.parsed) {
      state.setExpression(state.expression);
    }
  }, 0);
}
