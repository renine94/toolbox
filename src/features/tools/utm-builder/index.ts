// UI
export { UTMBuilder } from "./ui/UTMBuilder";
export { URLInput } from "./ui/URLInput";
export { UTMFields } from "./ui/UTMFields";
export { GeneratedURL } from "./ui/GeneratedURL";
export { UTMPresets } from "./ui/UTMPresets";
export { UTMHistory } from "./ui/UTMHistory";

// Store
export { useUTMStore } from "./model/useUTMStore";

// Types
export type { UTMParams, UTMPreset, UTMHistoryItem } from "./model/types";
export { DEFAULT_PRESETS, UTM_FIELD_INFO, utmParamsSchema } from "./model/types";

// Utils
export {
  generateId,
  buildUTMUrl,
  extractUTMParams,
  isValidUrl,
  isValidUTMParams,
  getBaseUrl,
  formatShortDate,
} from "./lib/utm-utils";
