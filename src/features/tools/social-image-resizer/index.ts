// UI
export { SocialImageResizer } from "./ui/SocialImageResizer";
export { ImageUploader } from "./ui/ImageUploader";
export { PlatformPresets } from "./ui/PlatformPresets";
export { ResizePreview } from "./ui/ResizePreview";
export { DownloadSection } from "./ui/DownloadSection";

// Store
export { useResizerStore } from "./model/useResizerStore";

// Types
export type {
  Platform,
  PlatformPreset,
  PresetId,
  ImageSize,
  ImageStatus,
  ResizedImage,
  UploadedImage,
  SelectedPresets,
  ResizerState,
} from "./model/types";
export {
  platforms,
  PLATFORM_PRESETS,
  PLATFORM_INFO,
  FILE_LIMITS,
} from "./model/types";

// Utils
export {
  resizeImage,
  downloadImage,
  downloadAllAsZip,
  formatFileSize,
  generateId,
} from "./lib/resize-utils";
export {
  getPresetsByPlatform,
  getPresetsForPlatform,
  getPresetById,
  getPlatformInfo,
  getAllPlatforms,
  getAllPresetIds,
  getPlatformPresetIds,
  formatPresetName,
  formatPresetSize,
} from "./lib/platform-presets";
