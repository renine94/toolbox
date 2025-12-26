export type GradientType = "linear" | "radial" | "conic";

export interface ColorStop {
  id: string;
  color: string;
  position: number; // 0-100
}

export interface GradientConfig {
  type: GradientType;
  angle: number; // linear: 0-360
  centerX: number; // radial/conic: 0-100
  centerY: number; // radial/conic: 0-100
  colorStops: ColorStop[];
}

export interface SavedGradient {
  id: string;
  name: string;
  config: GradientConfig;
  createdAt: number;
}

export interface PresetGradient {
  id: string;
  name: string;
  config: GradientConfig;
}

export const GRADIENT_TYPES: { type: GradientType; name: string; nameKo: string }[] = [
  { type: "linear", name: "Linear", nameKo: "선형" },
  { type: "radial", name: "Radial", nameKo: "방사형" },
  { type: "conic", name: "Conic", nameKo: "원뿔형" },
];

export const PRESET_GRADIENTS: PresetGradient[] = [
  {
    id: "sunset",
    name: "Sunset",
    config: {
      type: "linear",
      angle: 135,
      centerX: 50,
      centerY: 50,
      colorStops: [
        { id: "1", color: "#ff6b6b", position: 0 },
        { id: "2", color: "#feca57", position: 50 },
        { id: "3", color: "#ff9ff3", position: 100 },
      ],
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    config: {
      type: "linear",
      angle: 180,
      centerX: 50,
      centerY: 50,
      colorStops: [
        { id: "1", color: "#667eea", position: 0 },
        { id: "2", color: "#764ba2", position: 100 },
      ],
    },
  },
  {
    id: "forest",
    name: "Forest",
    config: {
      type: "linear",
      angle: 45,
      centerX: 50,
      centerY: 50,
      colorStops: [
        { id: "1", color: "#11998e", position: 0 },
        { id: "2", color: "#38ef7d", position: 100 },
      ],
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    config: {
      type: "linear",
      angle: 135,
      centerX: 50,
      centerY: 50,
      colorStops: [
        { id: "1", color: "#00d2ff", position: 0 },
        { id: "2", color: "#3a7bd5", position: 50 },
        { id: "3", color: "#6a11cb", position: 100 },
      ],
    },
  },
  {
    id: "fire",
    name: "Fire",
    config: {
      type: "radial",
      angle: 0,
      centerX: 50,
      centerY: 50,
      colorStops: [
        { id: "1", color: "#f12711", position: 0 },
        { id: "2", color: "#f5af19", position: 100 },
      ],
    },
  },
  {
    id: "cosmic",
    name: "Cosmic",
    config: {
      type: "conic",
      angle: 0,
      centerX: 50,
      centerY: 50,
      colorStops: [
        { id: "1", color: "#ff0080", position: 0 },
        { id: "2", color: "#7928ca", position: 25 },
        { id: "3", color: "#4facfe", position: 50 },
        { id: "4", color: "#00f2fe", position: 75 },
        { id: "5", color: "#ff0080", position: 100 },
      ],
    },
  },
  {
    id: "rainbow",
    name: "Rainbow",
    config: {
      type: "linear",
      angle: 90,
      centerX: 50,
      centerY: 50,
      colorStops: [
        { id: "1", color: "#ff0000", position: 0 },
        { id: "2", color: "#ff8000", position: 17 },
        { id: "3", color: "#ffff00", position: 33 },
        { id: "4", color: "#00ff00", position: 50 },
        { id: "5", color: "#0080ff", position: 67 },
        { id: "6", color: "#8000ff", position: 83 },
        { id: "7", color: "#ff00ff", position: 100 },
      ],
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    config: {
      type: "linear",
      angle: 180,
      centerX: 50,
      centerY: 50,
      colorStops: [
        { id: "1", color: "#232526", position: 0 },
        { id: "2", color: "#414345", position: 100 },
      ],
    },
  },
];

export const DEFAULT_GRADIENT: GradientConfig = {
  type: "linear",
  angle: 90,
  centerX: 50,
  centerY: 50,
  colorStops: [
    { id: "default-1", color: "#667eea", position: 0 },
    { id: "default-2", color: "#764ba2", position: 100 },
  ],
};

export interface GradientState {
  config: GradientConfig;
  savedGradients: SavedGradient[];

  // Actions
  setType: (type: GradientType) => void;
  setAngle: (angle: number) => void;
  setCenter: (x: number, y: number) => void;
  addColorStop: (color: string, position: number) => void;
  updateColorStop: (id: string, color: string, position: number) => void;
  removeColorStop: (id: string) => void;
  loadPreset: (preset: PresetGradient) => void;
  loadConfig: (config: GradientConfig) => void;
  randomize: () => void;

  // Save actions
  saveGradient: (name: string) => void;
  loadSavedGradient: (gradient: SavedGradient) => void;
  deleteSavedGradient: (id: string) => void;
  clearSavedGradients: () => void;
}
