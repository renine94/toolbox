import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  RegexState,
  RegexFlag,
  HistoryItem,
  DEFAULT_PATTERN,
  DEFAULT_TEST_TEXT,
} from "./types";
import { testRegex, generateId } from "../lib/regex-utils";

const MAX_HISTORY_ITEMS = 20;

export const useRegexStore = create<RegexState>()(
  persist(
    (set, get) => ({
      // Initial state
      pattern: DEFAULT_PATTERN,
      testText: DEFAULT_TEST_TEXT,
      flags: ["g"] as RegexFlag[],
      result: null,
      history: [],

      // Pattern setter - also updates result
      setPattern: (pattern: string) => {
        const { testText, flags } = get();
        const result = testRegex(pattern, testText, flags);
        set({ pattern, result });
      },

      // Test text setter - also updates result
      setTestText: (testText: string) => {
        const { pattern, flags } = get();
        const result = testRegex(pattern, testText, flags);
        set({ testText, result });
      },

      // Toggle flag - also updates result
      toggleFlag: (flag: RegexFlag) => {
        const { pattern, testText, flags } = get();
        const newFlags = flags.includes(flag)
          ? flags.filter((f) => f !== flag)
          : [...flags, flag];
        const result = testRegex(pattern, testText, newFlags);
        set({ flags: newFlags, result });
      },

      // Clear all inputs
      clear: () => {
        set({
          pattern: "",
          testText: "",
          flags: ["g"],
          result: null,
        });
      },

      // Save current state to history
      saveToHistory: () => {
        const { pattern, flags, testText, history } = get();
        if (!pattern.trim()) return;

        const newItem: HistoryItem = {
          id: generateId(),
          pattern,
          flags: [...flags],
          testText,
          createdAt: Date.now(),
        };

        // Add to beginning, limit to MAX_HISTORY_ITEMS
        const newHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
        set({ history: newHistory });
      },

      // Load from history item
      loadFromHistory: (item: HistoryItem) => {
        const result = testRegex(item.pattern, item.testText, item.flags);
        set({
          pattern: item.pattern,
          flags: [...item.flags],
          testText: item.testText,
          result,
        });
      },

      // Remove item from history
      removeFromHistory: (id: string) => {
        const { history } = get();
        set({ history: history.filter((item) => item.id !== id) });
      },

      // Clear all history
      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: "regex-tester-storage",
      partialize: (state) => ({
        history: state.history,
      }),
    }
  )
);

// Initialize result on store creation
if (typeof window !== "undefined") {
  const state = useRegexStore.getState();
  const result = testRegex(state.pattern, state.testText, state.flags);
  useRegexStore.setState({ result });
}
