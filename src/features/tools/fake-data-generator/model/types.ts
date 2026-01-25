// 11가지 필드 타입 정의
export type FieldType =
  | "name"
  | "email"
  | "phone"
  | "address"
  | "company"
  | "job"
  | "uuid"
  | "date"
  | "lorem"
  | "number"
  | "boolean";

// 지원 언어 (faker locale)
export type FakeDataLocale = "ko" | "en" | "ja" | "zh";

// 출력 형식
export type OutputFormat = "json" | "csv";

// 필드 설정
export interface FieldConfig {
  id: string;
  type: FieldType;
  label: string; // JSON 키로 사용될 커스텀 라벨
  enabled: boolean;
}

// 전체 설정
export interface FakeDataConfig {
  locale: FakeDataLocale;
  count: number;
  outputFormat: OutputFormat;
  fields: FieldConfig[];
}

// 생성된 데이터 레코드 타입
export type GeneratedRecord = Record<string, string | number | boolean>;

// 기본 필드 설정
export const DEFAULT_FIELDS: FieldConfig[] = [
  { id: "1", type: "name", label: "name", enabled: true },
  { id: "2", type: "email", label: "email", enabled: true },
  { id: "3", type: "phone", label: "phone", enabled: false },
  { id: "4", type: "address", label: "address", enabled: false },
  { id: "5", type: "company", label: "company", enabled: false },
  { id: "6", type: "job", label: "job", enabled: false },
  { id: "7", type: "uuid", label: "uuid", enabled: false },
  { id: "8", type: "date", label: "date", enabled: false },
  { id: "9", type: "lorem", label: "lorem", enabled: false },
  { id: "10", type: "number", label: "number", enabled: false },
  { id: "11", type: "boolean", label: "boolean", enabled: false },
];

// 기본 설정
export const DEFAULT_CONFIG: FakeDataConfig = {
  locale: "ko",
  count: 10,
  outputFormat: "json",
  fields: DEFAULT_FIELDS,
};

// 필드 타입 정보 (번역 키용)
export const FIELD_TYPE_INFO: Record<FieldType, { translationKey: string }> = {
  name: { translationKey: "name" },
  email: { translationKey: "email" },
  phone: { translationKey: "phone" },
  address: { translationKey: "address" },
  company: { translationKey: "company" },
  job: { translationKey: "job" },
  uuid: { translationKey: "uuid" },
  date: { translationKey: "date" },
  lorem: { translationKey: "lorem" },
  number: { translationKey: "number" },
  boolean: { translationKey: "boolean" },
};
