export type HarmonyType =
  | "complementary" // 보색
  | "analogous" // 유사색
  | "triadic" // 삼원색
  | "split-complementary" // 분할보색
  | "tetradic" // 사각형
  | "custom"; // 커스텀

export interface HarmonyInfo {
  type: HarmonyType;
  name: string;
  nameKo: string;
  description: string;
  colorCount: number;
}

export const HARMONY_TYPES: HarmonyInfo[] = [
  {
    type: "complementary",
    name: "Complementary",
    nameKo: "보색",
    description: "색상환 반대편 색상",
    colorCount: 2,
  },
  {
    type: "analogous",
    name: "Analogous",
    nameKo: "유사색",
    description: "인접한 색상들",
    colorCount: 3,
  },
  {
    type: "triadic",
    name: "Triadic",
    nameKo: "삼원색",
    description: "120도 간격 색상",
    colorCount: 3,
  },
  {
    type: "split-complementary",
    name: "Split Complementary",
    nameKo: "분할보색",
    description: "보색 양옆 색상",
    colorCount: 3,
  },
  {
    type: "tetradic",
    name: "Tetradic",
    nameKo: "사각형",
    description: "90도 간격 색상",
    colorCount: 4,
  },
  {
    type: "custom",
    name: "Custom",
    nameKo: "커스텀",
    description: "직접 색상 추가",
    colorCount: 0,
  },
];

export interface PaletteColor {
  id: string;
  hex: string;
  name?: string;
}

export interface SavedPalette {
  id: string;
  name: string;
  colors: PaletteColor[];
  harmonyType: HarmonyType;
  baseColor: string;
  createdAt: number;
}

export type ExportFormat = "css" | "tailwind" | "scss";

export interface PaletteState {
  // Current state
  baseColor: string;
  harmonyType: HarmonyType;
  customColors: PaletteColor[];

  // Saved palettes
  savedPalettes: SavedPalette[];

  // Actions
  setBaseColor: (color: string) => void;
  setHarmonyType: (type: HarmonyType) => void;
  addCustomColor: (hex: string) => void;
  removeCustomColor: (id: string) => void;
  clearCustomColors: () => void;

  // Palette actions
  savePalette: (name: string, colors: PaletteColor[]) => void;
  loadPalette: (palette: SavedPalette) => void;
  deletePalette: (id: string) => void;
  clearAllPalettes: () => void;
}

export const DEFAULT_BASE_COLOR = "#3b82f6";
