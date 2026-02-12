// Image Editor Feature - Public API

// UI Components
export { ImageEditor } from "./ui/ImageEditor";
export { ImageUploader } from "./ui/ImageUploader";
export { ImageCanvas } from "./ui/ImageCanvas";
export { FilterControls } from "./ui/FilterControls";
export { TransformControls } from "./ui/TransformControls";
export { ResizeControls } from "./ui/ResizeControls";
export { CropControls } from "./ui/CropControls";
export { CropOverlay } from "./ui/CropOverlay";
export { TextControls } from "./ui/TextControls";
export { TextLayerOverlay } from "./ui/TextLayerOverlay";
export { BrushControls } from "./ui/BrushControls";
export { DrawingCanvas } from "./ui/DrawingCanvas";
export { MosaicControls } from "./ui/MosaicControls";
export { MosaicCanvas } from "./ui/MosaicCanvas";
export { ExportPanel } from "./ui/ExportPanel";
export { Toolbar } from "./ui/Toolbar";

// Store
export { useImageStore } from "./model/useImageStore";

// Types
export type {
  ImageFilters,
  ImageTransform,
  ImageSize,
  CropArea,
  ExportFormat,
  ExportOptions,
  HistoryEntry,
  ImageEditorState,
  FilterPreset,
  AspectRatioPreset,
  CropSettings,
  TextLayer,
  TextAlignment,
  WatermarkPreset,
  BrushMode,
  BrushSettings,
  DrawPath,
  MosaicMode,
  MosaicSettings,
  MosaicArea,
} from "./model/types";

export {
  FILTER_PRESETS,
  DEFAULT_FILTERS,
  DEFAULT_TRANSFORM,
  DEFAULT_CROP_SETTINGS,
  DEFAULT_TEXT_LAYER,
  DEFAULT_BRUSH_SETTINGS,
  FONT_FAMILIES,
  WATERMARK_PRESETS,
  aspectRatioPresets,
  brushModes,
  mosaicModes,
  DEFAULT_MOSAIC_SETTINGS,
  exportFormats,
} from "./model/types";

// Utilities
export {
  loadImageAsDataURL,
  getFilterString,
  getTransformString,
  applyFiltersToCanvas,
  applyTransformToCanvas,
  formatFileSize,
  dataURLtoBlob,
  downloadImage,
  calculateAspectRatioSize,
} from "./lib/image-utils";

export {
  getAspectRatioValue,
  screenToImageCoords,
  imageToScreenCoords,
  constrainCropAreaToAspectRatio,
  clampCropArea,
  createDefaultCropArea,
} from "./lib/crop-utils";

export {
  renderTextToCanvas,
  renderAllTextLayers,
  measureText,
} from "./lib/text-utils";

export {
  renderDrawPath,
  renderAllDrawPaths,
  createBrushCursor,
} from "./lib/draw-utils";

export {
  renderMosaicArea,
  renderAllMosaicAreas,
  screenToMosaicCoords,
  createMosaicCursor,
} from "./lib/mosaic-utils";
