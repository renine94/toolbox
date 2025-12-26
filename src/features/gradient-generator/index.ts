// UI
export { GradientGenerator } from "./ui/GradientGenerator";
export { GradientPreview } from "./ui/GradientPreview";
export { GradientControls } from "./ui/GradientControls";
export { ColorStops } from "./ui/ColorStops";
export { CodeOutput } from "./ui/CodeOutput";
export { PresetGradients } from "./ui/PresetGradients";
export { SavedGradients } from "./ui/SavedGradients";

// Store
export { useGradientStore } from "./model/useGradientStore";

// Types
export type {
  GradientType,
  GradientConfig,
  ColorStop,
  SavedGradient,
  PresetGradient,
} from "./model/types";
export { GRADIENT_TYPES, PRESET_GRADIENTS, DEFAULT_GRADIENT } from "./model/types";

// Utils
export {
  generateGradientCSS,
  generateCode,
  copyToClipboard,
  EXPORT_OPTIONS,
} from "./lib/gradient-utils";
export type { ExportFormat } from "./lib/gradient-utils";
