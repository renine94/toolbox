import { create } from "zustand";
import type { UuidConfig, GeneratedUuid, UuidVersion } from "./types";
import { DEFAULT_CONFIG } from "./types";
import {
  generateFormattedUuid,
  generateBulkUuids,
} from "../lib/uuid-utils";

interface UuidState {
  config: UuidConfig;
  currentUuid: string;
  history: GeneratedUuid[];
  bulkUuids: GeneratedUuid[];

  // Actions
  setVersion: (version: UuidVersion) => void;
  setUppercase: (uppercase: boolean) => void;
  setHyphens: (hyphens: boolean) => void;
  setBraces: (braces: boolean) => void;
  setQuantity: (quantity: number) => void;
  generate: () => void;
  generateBulk: () => void;
  clearHistory: () => void;
  clearBulk: () => void;
  removeFromHistory: (id: string) => void;
}

export const useUuidStore = create<UuidState>((set, get) => ({
  config: DEFAULT_CONFIG,
  currentUuid: "",
  history: [],
  bulkUuids: [],

  setVersion: (version) =>
    set((state) => ({
      config: { ...state.config, version },
    })),

  setUppercase: (uppercase) =>
    set((state) => ({
      config: { ...state.config, uppercase },
    })),

  setHyphens: (hyphens) =>
    set((state) => ({
      config: { ...state.config, hyphens },
    })),

  setBraces: (braces) =>
    set((state) => ({
      config: { ...state.config, braces },
    })),

  setQuantity: (quantity) =>
    set((state) => ({
      config: { ...state.config, quantity: Math.max(1, Math.min(100, quantity)) },
    })),

  generate: () => {
    const { config } = get();
    const uuid = generateFormattedUuid(config);
    const newEntry: GeneratedUuid = {
      id: crypto.randomUUID(),
      uuid,
      version: config.version,
      createdAt: new Date(),
    };

    set((state) => ({
      currentUuid: uuid,
      history: [newEntry, ...state.history].slice(0, 50),
    }));
  },

  generateBulk: () => {
    const { config } = get();
    const uuids = generateBulkUuids(config, config.quantity);

    set((state) => ({
      bulkUuids: uuids,
      history: [...uuids, ...state.history].slice(0, 50),
    }));
  },

  clearHistory: () => set({ history: [] }),

  clearBulk: () => set({ bulkUuids: [] }),

  removeFromHistory: (id) =>
    set((state) => ({
      history: state.history.filter((item) => item.id !== id),
    })),
}));
