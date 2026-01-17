export interface ConversionOptions {
  rootName: string;              // 루트 타입 이름 (기본: "Root")
  useInterface: boolean;         // true: interface, false: type
  optionalProperties: boolean;   // 속성을 optional로 처리
  readonlyProperties: boolean;   // readonly 속성 추가
  exportTypes: boolean;          // export 키워드 추가
}

export const DEFAULT_OPTIONS: ConversionOptions = {
  rootName: "Root",
  useInterface: true,
  optionalProperties: false,
  readonlyProperties: false,
  exportTypes: true,
};

export interface ConversionResult {
  success: boolean;
  output: string;
  error?: string;
}
