import { create } from 'zustand';
import { formatJson, minifyJson } from '../lib/formatter';

interface JsonState {
    input: string;
    output: string;
    error: string | null;
    setInput: (value: string) => void;
    formatInput: (value: string) => void;
    format: () => void;
    minify: () => void;
    clear: () => void;
}

export const useJsonStore = create<JsonState>((set, get) => ({
    input: '',
    output: '',
    error: null,

    // 입력값만 업데이트 (즉시 반영)
    setInput: (value: string) => {
        set({ input: value });
    },

    // 입력값을 포맷팅하여 output 업데이트 (컴포넌트에서 debounce로 호출)
    formatInput: (value: string) => {
        try {
            if (!value.trim()) {
                set({ output: '', error: null });
                return;
            }
            const formatted = formatJson(value);
            set({ output: formatted, error: null });
        } catch (err: unknown) {
            if (err instanceof Error) {
                set({ error: err.message });
            }
        }
    },

    // 현재 input을 포맷팅 (버튼 클릭 시)
    format: () => {
        const { input } = get();
        try {
            const formatted = formatJson(input);
            set({ output: formatted, error: null });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'JSON 포맷팅 오류';
            set({ error: message, output: '' });
        }
    },

    // 현재 input을 압축 (버튼 클릭 시)
    minify: () => {
        const { input } = get();
        try {
            const minified = minifyJson(input);
            set({ output: minified, error: null });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'JSON 압축 오류';
            set({ error: message, output: '' });
        }
    },

    clear: () => set({ input: '', output: '', error: null }),
}));
