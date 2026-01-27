import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isValidToolId } from "@/shared/lib/tool-registry";

export interface ToolUsage {
  toolId: string;
  lastUsed: number; // Unix timestamp (ms)
  useCount: number;
}

interface QuickAccessState {
  // 도구 사용 기록
  toolUsages: ToolUsage[];

  // UI 상태
  isOpen: boolean;

  // Actions
  recordUsage: (toolId: string) => void;
  getRecentTools: (limit?: number) => ToolUsage[];
  hasUsageHistory: () => boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useQuickAccessStore = create<QuickAccessState>()(
  persist(
    (set, get) => ({
      toolUsages: [],
      isOpen: false,

      recordUsage: (toolId: string) => {
        // 유효한 도구 ID인지 확인
        if (!isValidToolId(toolId)) {
          return;
        }

        set((state) => {
          const existingIndex = state.toolUsages.findIndex(
            (usage) => usage.toolId === toolId
          );
          const now = Date.now();

          if (existingIndex !== -1) {
            // 기존 기록 업데이트
            const updatedUsages = [...state.toolUsages];
            updatedUsages[existingIndex] = {
              ...updatedUsages[existingIndex],
              lastUsed: now,
              useCount: updatedUsages[existingIndex].useCount + 1,
            };
            return { toolUsages: updatedUsages };
          } else {
            // 새 기록 추가
            return {
              toolUsages: [
                ...state.toolUsages,
                { toolId, lastUsed: now, useCount: 1 },
              ],
            };
          }
        });
      },

      getRecentTools: (limit = 5) => {
        const { toolUsages } = get();
        // 최근 사용 순으로 정렬
        return [...toolUsages]
          .sort((a, b) => b.lastUsed - a.lastUsed)
          .slice(0, limit);
      },

      hasUsageHistory: () => {
        return get().toolUsages.length > 0;
      },

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "quick-access-storage",
      // toolUsages만 localStorage에 저장 (isOpen은 저장하지 않음)
      partialize: (state) => ({ toolUsages: state.toolUsages }),
    }
  )
);
