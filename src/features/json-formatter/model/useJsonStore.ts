import { create } from 'zustand';
import { formatJson, minifyJson } from '../lib/formatter';

interface JsonState {
    input: string;
    output: string;
    error: string | null;
    setInput: (value: string) => void;
    format: () => void;
    minify: () => void;
    clear: () => void;
}

export const useJsonStore = create<JsonState>((set, get) => ({
    input: '',
    output: '',
    error: null,
    setInput: (value: string) => {
        set({ input: value });
        try {
            if (!value.trim()) {
                set({ output: '', error: null });
                return;
            }
            const formatted = formatJson(value);
            set({ output: formatted, error: null }); // 실시간 포맷팅 성공
        } catch (err: unknown) {
            if (err instanceof Error) {
                set({ error: err.message });
                // 에러 발생 시 기존 output 유지 (깜빡임 방지)
            }
        }
    },
    format: () => {
        const { input } = get();
        try {
            const formatted = formatJson(input);
            set({ output: formatted, error: null });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            set({ error: err.message, output: '' });
        }
    },
    minify: () => {
        const { input } = get();
        try {
            const minified = minifyJson(input);
            set({ output: minified, error: null });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            set({ error: err.message, output: '' });
        }
    },
    clear: () => set({ input: '', output: '', error: null }),
}));
