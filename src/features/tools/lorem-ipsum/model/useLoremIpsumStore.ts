import { create } from "zustand";
import {
  LoremIpsumConfig,
  GenerateMode,
  DEFAULT_CONFIG,
  MODE_LIMITS,
} from "./types";
import { generateLoremIpsum } from "../lib/lorem-generator";

interface LoremIpsumState {
  config: LoremIpsumConfig;
  output: string;

  setConfig: (partial: Partial<LoremIpsumConfig>) => void;
  setMode: (mode: GenerateMode) => void;
  generate: () => void;
  clear: () => void;
}

export const useLoremIpsumStore = create<LoremIpsumState>((set, get) => ({
  config: DEFAULT_CONFIG,
  output: "",

  setConfig: (partial) => {
    set((state) => ({
      config: { ...state.config, ...partial },
    }));
  },

  setMode: (mode) => {
    const limits = MODE_LIMITS[mode];
    set((state) => ({
      config: {
        ...state.config,
        mode,
        count: Math.min(Math.max(state.config.count, limits.min), limits.max),
      },
    }));
  },

  generate: () => {
    const { config } = get();
    const result = generateLoremIpsum(config);
    set({ output: result });
  },

  clear: () => {
    set({ output: "" });
  },
}));
