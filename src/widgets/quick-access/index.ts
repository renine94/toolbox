// Quick Access Widget - Public API
// 최근 사용한 도구에 빠르게 접근하는 플로팅 버튼

// UI Components
export { QuickAccessButton } from "./ui/QuickAccessButton";
export { QuickAccessToolItem } from "./ui/QuickAccessToolItem";
export { ToolUsageTracker } from "./ui/ToolUsageTracker";

// Store
export { useQuickAccessStore } from "./model/useQuickAccessStore";
export type { ToolUsage } from "./model/useQuickAccessStore";

// Utils
export {
  TOOLS,
  CATEGORIES,
  TOOL_MAP,
  isValidToolId,
  getToolMetadata,
  getCategoryMetadata,
  toolIdToTranslationKey,
} from "./lib/tool-registry";
export type { ToolMetadata, CategoryMetadata } from "./lib/tool-registry";
