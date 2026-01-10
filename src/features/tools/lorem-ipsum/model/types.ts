// 생성 모드
export type GenerateMode = "paragraphs" | "sentences" | "words";

// 설정 인터페이스
export interface LoremIpsumConfig {
  mode: GenerateMode;
  count: number;
  startWithLoremIpsum: boolean;
  includeHtml: boolean;
}

// 기본 설정
export const DEFAULT_CONFIG: LoremIpsumConfig = {
  mode: "paragraphs",
  count: 3,
  startWithLoremIpsum: true,
  includeHtml: false,
};

// 모드별 범위 제한
export const MODE_LIMITS: Record<GenerateMode, { min: number; max: number }> = {
  paragraphs: { min: 1, max: 20 },
  sentences: { min: 1, max: 100 },
  words: { min: 1, max: 500 },
};

// 모드별 라벨 (한글)
export const MODE_LABELS: Record<GenerateMode, string> = {
  paragraphs: "문단",
  sentences: "문장",
  words: "단어",
};
