export interface RegexMatch {
  fullMatch: string;
  groups: string[];
  index: number;
  length: number;
}

export interface RegexResult {
  matches: RegexMatch[];
  totalMatches: number;
  error: string | null;
}

export type RegexFlag = "g" | "i" | "m" | "s" | "u" | "y";

export interface RegexFlagInfo {
  flag: RegexFlag;
  name: string;
  description: string;
}

export const REGEX_FLAGS: RegexFlagInfo[] = [
  { flag: "g", name: "Global", description: "모든 매칭 찾기" },
  { flag: "i", name: "Case-insensitive", description: "대소문자 구분 안함" },
  { flag: "m", name: "Multiline", description: "^와 $가 줄 단위로 매칭" },
  { flag: "s", name: "Dotall", description: ".이 줄바꿈도 매칭" },
  { flag: "u", name: "Unicode", description: "유니코드 지원" },
  { flag: "y", name: "Sticky", description: "lastIndex부터 매칭" },
];

export interface HistoryItem {
  id: string;
  pattern: string;
  flags: RegexFlag[];
  testText: string;
  createdAt: number;
}

export interface RegexState {
  // Current state
  pattern: string;
  testText: string;
  flags: RegexFlag[];
  result: RegexResult | null;

  // History
  history: HistoryItem[];

  // Actions
  setPattern: (pattern: string) => void;
  setTestText: (text: string) => void;
  toggleFlag: (flag: RegexFlag) => void;
  clear: () => void;

  // History actions
  saveToHistory: () => void;
  loadFromHistory: (item: HistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const DEFAULT_PATTERN = "\\w+";
export const DEFAULT_TEST_TEXT = `Hello, World!
This is a test string.
Email: test@example.com
Phone: 010-1234-5678`;
