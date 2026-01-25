import { faker as fakerKO } from "@faker-js/faker/locale/ko";
import { faker as fakerEN } from "@faker-js/faker";
import { faker as fakerJA } from "@faker-js/faker/locale/ja";
import { faker as fakerZH } from "@faker-js/faker/locale/zh_CN";
import type {
  FakeDataConfig,
  FakeDataLocale,
  FieldConfig,
  FieldType,
  GeneratedRecord,
} from "../model/types";

// locale에 따른 faker 인스턴스 반환
function getFaker(locale: FakeDataLocale) {
  switch (locale) {
    case "ko":
      return fakerKO;
    case "ja":
      return fakerJA;
    case "zh":
      return fakerZH;
    default:
      return fakerEN;
  }
}

// 필드 타입에 따른 데이터 생성
function generateFieldValue(
  type: FieldType,
  locale: FakeDataLocale
): string | number | boolean {
  const faker = getFaker(locale);

  switch (type) {
    case "name":
      return faker.person.fullName();
    case "email":
      return faker.internet.email();
    case "phone":
      return faker.phone.number();
    case "address":
      return faker.location.streetAddress({ useFullAddress: true });
    case "company":
      return faker.company.name();
    case "job":
      return faker.person.jobTitle();
    case "uuid":
      return faker.string.uuid();
    case "date":
      return faker.date.recent({ days: 365 }).toISOString().split("T")[0];
    case "lorem":
      return faker.lorem.sentence();
    case "number":
      return faker.number.int({ min: 1, max: 10000 });
    case "boolean":
      return faker.datatype.boolean();
    default:
      return "";
  }
}

// 설정에 따라 가짜 데이터 생성
export function generateFakeData(config: FakeDataConfig): GeneratedRecord[] {
  const { locale, count, fields } = config;
  const enabledFields = fields.filter((f) => f.enabled);

  if (enabledFields.length === 0) {
    return [];
  }

  const result: GeneratedRecord[] = [];

  for (let i = 0; i < count; i++) {
    const record: GeneratedRecord = {};
    for (const field of enabledFields) {
      record[field.label] = generateFieldValue(field.type, locale);
    }
    result.push(record);
  }

  return result;
}

// JSON 데이터를 CSV로 변환
export function convertToCSV(
  data: GeneratedRecord[],
  fields: FieldConfig[]
): string {
  if (data.length === 0) return "";

  const enabledFields = fields.filter((f) => f.enabled);
  const headers = enabledFields.map((f) => f.label);

  // CSV 헤더
  const csvRows: string[] = [headers.join(",")];

  // CSV 데이터 행
  for (const record of data) {
    const values = enabledFields.map((field) => {
      const value = record[field.label];
      // 문자열 값은 이스케이프 처리
      if (typeof value === "string") {
        // 쉼표, 따옴표, 줄바꿈이 포함된 경우 따옴표로 감싸기
        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }
      return String(value);
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

// 파일 다운로드 유틸리티
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// JSON 문자열로 변환
export function formatToJSON(data: GeneratedRecord[]): string {
  return JSON.stringify(data, null, 2);
}
