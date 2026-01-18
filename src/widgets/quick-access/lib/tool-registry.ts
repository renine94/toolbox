// 도구 레지스트리 - 28개 도구의 메타데이터를 중앙 관리
// Quick Access, 검색, 통계 등 다양한 기능에서 재사용

export interface ToolMetadata {
  id: string;
  icon: string;
  categoryId: string;
  gradient: string;
}

export interface CategoryMetadata {
  id: string;
  icon: string;
  gradient: string;
}

// 카테고리 메타데이터
export const CATEGORIES: Record<string, CategoryMetadata> = {
  developer: {
    id: "developer",
    icon: "💻",
    gradient: "from-violet-500 to-purple-600",
  },
  designer: {
    id: "designer",
    icon: "🎨",
    gradient: "from-pink-500 to-rose-600",
  },
  marketer: {
    id: "marketer",
    icon: "📊",
    gradient: "from-emerald-500 to-teal-600",
  },
  writer: {
    id: "writer",
    icon: "✍️",
    gradient: "from-amber-500 to-orange-600",
  },
  productivity: {
    id: "productivity",
    icon: "⚡",
    gradient: "from-blue-500 to-cyan-600",
  },
};

// 28개 도구 메타데이터
export const TOOLS: ToolMetadata[] = [
  // Developer Tools (14)
  { id: "json-formatter", icon: "{ }", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "base64-encoder", icon: "🔤", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "color-picker", icon: "🎨", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "code-runner", icon: "▶️", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "regex-tester", icon: ".*", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "uuid-generator", icon: "🔑", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "jwt-decoder", icon: "🎫", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "diff-checker", icon: "⇆", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "url-encoder", icon: "🔗", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "cron-parser", icon: "⏰", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "json-yaml-converter", icon: "🔄", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "json-to-typescript", icon: "TS", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "unix-timestamp", icon: "🕐", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },
  { id: "sql-formatter", icon: "🗄️", categoryId: "developer", gradient: "from-violet-500 to-purple-600" },

  // Designer Tools (5)
  { id: "color-palette", icon: "🌈", categoryId: "designer", gradient: "from-pink-500 to-rose-600" },
  { id: "image-editor", icon: "🖼️", categoryId: "designer", gradient: "from-pink-500 to-rose-600" },
  { id: "gradient-generator", icon: "🌅", categoryId: "designer", gradient: "from-pink-500 to-rose-600" },
  { id: "image-upscaler", icon: "⬆️", categoryId: "designer", gradient: "from-pink-500 to-rose-600" },
  { id: "image-converter", icon: "🔄", categoryId: "designer", gradient: "from-pink-500 to-rose-600" },

  // Marketer Tools (2)
  { id: "qr-generator", icon: "📱", categoryId: "marketer", gradient: "from-emerald-500 to-teal-600" },
  { id: "link-shortener", icon: "🔗", categoryId: "marketer", gradient: "from-emerald-500 to-teal-600" },

  // Writer Tools (3)
  { id: "markdown-editor", icon: "📝", categoryId: "writer", gradient: "from-amber-500 to-orange-600" },
  { id: "word-counter", icon: "🔢", categoryId: "writer", gradient: "from-amber-500 to-orange-600" },
  { id: "lorem-ipsum", icon: "📄", categoryId: "writer", gradient: "from-amber-500 to-orange-600" },

  // Productivity Tools (4)
  { id: "unit-converter", icon: "📐", categoryId: "productivity", gradient: "from-blue-500 to-cyan-600" },
  { id: "timezone-converter", icon: "🌍", categoryId: "productivity", gradient: "from-blue-500 to-cyan-600" },
  { id: "password-generator", icon: "🔐", categoryId: "productivity", gradient: "from-blue-500 to-cyan-600" },
  { id: "pomodoro-timer", icon: "🍅", categoryId: "productivity", gradient: "from-blue-500 to-cyan-600" },
];

// 도구 ID를 키로 하는 맵 (빠른 조회용)
export const TOOL_MAP = new Map<string, ToolMetadata>(
  TOOLS.map((tool) => [tool.id, tool])
);

// 도구 ID가 유효한지 확인
export function isValidToolId(id: string): boolean {
  return TOOL_MAP.has(id);
}

// 도구 메타데이터 조회
export function getToolMetadata(id: string): ToolMetadata | undefined {
  return TOOL_MAP.get(id);
}

// 카테고리 메타데이터 조회
export function getCategoryMetadata(categoryId: string): CategoryMetadata | undefined {
  return CATEGORIES[categoryId];
}

// tool id를 camelCase 번역 키로 변환 (예: json-formatter -> jsonFormatter)
export function toolIdToTranslationKey(id: string): string {
  return id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
