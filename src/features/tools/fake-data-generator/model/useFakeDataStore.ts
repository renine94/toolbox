import { create } from "zustand";
import type {
  FakeDataConfig,
  FakeDataLocale,
  GeneratedRecord,
  OutputFormat,
} from "./types";
import { DEFAULT_CONFIG, DEFAULT_FIELDS } from "./types";
import {
  generateFakeData,
  convertToCSV,
  formatToJSON,
} from "../lib/fake-data-utils";

interface FakeDataState {
  config: FakeDataConfig;
  data: GeneratedRecord[];
  output: string;
  isGenerating: boolean;

  // Actions
  setLocale: (locale: FakeDataLocale) => void;
  setCount: (count: number) => void;
  setOutputFormat: (format: OutputFormat) => void;
  toggleField: (fieldId: string) => void;
  updateFieldLabel: (fieldId: string, label: string) => void;
  selectAllFields: () => void;
  deselectAllFields: () => void;
  generate: () => void;
  clear: () => void;
  reset: () => void;
}

export const useFakeDataStore = create<FakeDataState>((set, get) => ({
  config: DEFAULT_CONFIG,
  data: [],
  output: "",
  isGenerating: false,

  setLocale: (locale) =>
    set((state) => ({
      config: { ...state.config, locale },
    })),

  setCount: (count) =>
    set((state) => ({
      config: { ...state.config, count: Math.max(1, Math.min(100, count)) },
    })),

  setOutputFormat: (outputFormat) => {
    const { data, config } = get();
    let output = "";

    if (data.length > 0) {
      if (outputFormat === "json") {
        output = formatToJSON(data);
      } else {
        output = convertToCSV(data, config.fields);
      }
    }

    set((state) => ({
      config: { ...state.config, outputFormat },
      output,
    }));
  },

  toggleField: (fieldId) =>
    set((state) => ({
      config: {
        ...state.config,
        fields: state.config.fields.map((field) =>
          field.id === fieldId ? { ...field, enabled: !field.enabled } : field
        ),
      },
    })),

  updateFieldLabel: (fieldId, label) =>
    set((state) => ({
      config: {
        ...state.config,
        fields: state.config.fields.map((field) =>
          field.id === fieldId ? { ...field, label } : field
        ),
      },
    })),

  selectAllFields: () =>
    set((state) => ({
      config: {
        ...state.config,
        fields: state.config.fields.map((field) => ({
          ...field,
          enabled: true,
        })),
      },
    })),

  deselectAllFields: () =>
    set((state) => ({
      config: {
        ...state.config,
        fields: state.config.fields.map((field) => ({
          ...field,
          enabled: false,
        })),
      },
    })),

  generate: () => {
    const { config } = get();

    set({ isGenerating: true });

    // 비동기적으로 생성 (UI 블로킹 방지)
    setTimeout(() => {
      const data = generateFakeData(config);
      let output = "";

      if (data.length > 0) {
        if (config.outputFormat === "json") {
          output = formatToJSON(data);
        } else {
          output = convertToCSV(data, config.fields);
        }
      }

      set({ data, output, isGenerating: false });
    }, 0);
  },

  clear: () =>
    set({
      data: [],
      output: "",
    }),

  reset: () =>
    set({
      config: {
        ...DEFAULT_CONFIG,
        fields: DEFAULT_FIELDS.map((f) => ({ ...f })),
      },
      data: [],
      output: "",
    }),
}));
