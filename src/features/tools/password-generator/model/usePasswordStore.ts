import { create } from "zustand";
import {
  PasswordConfig,
  GeneratedPassword,
  DEFAULT_CONFIG,
} from "./types";
import {
  createGeneratedPassword,
  generateBulkPasswords,
} from "../lib/password-utils";

interface PasswordState {
  config: PasswordConfig;
  currentPassword: GeneratedPassword | null;
  bulkCount: number;
  bulkPasswords: GeneratedPassword[];
  isVisible: boolean;

  setConfig: (partial: Partial<PasswordConfig>) => void;
  setBulkCount: (count: number) => void;
  generate: () => void;
  generateBulk: () => void;
  clearBulk: () => void;
  toggleVisibility: () => void;
}

export const usePasswordStore = create<PasswordState>((set, get) => ({
  config: DEFAULT_CONFIG,
  currentPassword: null,
  bulkCount: 5,
  bulkPasswords: [],
  isVisible: true,

  setConfig: (partial) => {
    set((state) => ({
      config: { ...state.config, ...partial },
    }));
  },

  setBulkCount: (count) => {
    set({ bulkCount: Math.min(10, Math.max(1, count)) });
  },

  generate: () => {
    const { config } = get();
    const password = createGeneratedPassword(config);
    set({ currentPassword: password });
  },

  generateBulk: () => {
    const { config, bulkCount } = get();
    const passwords = generateBulkPasswords(config, bulkCount);
    set({ bulkPasswords: passwords });
  },

  clearBulk: () => {
    set({ bulkPasswords: [] });
  },

  toggleVisibility: () => {
    set((state) => ({ isVisible: !state.isVisible }));
  },
}));
