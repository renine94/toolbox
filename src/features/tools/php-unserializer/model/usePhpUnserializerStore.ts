import { create } from 'zustand';
import { unserialize, formatOutput, ParseResult } from '../lib/php-unserializer';

interface PhpUnserializerState {
  input: string;
  output: string;
  error: string | null;
  indentSize: number;
  parseResult: ParseResult | null;

  setInput: (value: string) => void;
  setIndentSize: (size: number) => void;
  loadExample: () => void;
  clear: () => void;
}

const EXAMPLE_INPUT = 'a:3:{s:4:"name";s:4:"John";s:3:"age";i:30;s:5:"email";s:16:"john@example.com";}';

export const usePhpUnserializerStore = create<PhpUnserializerState>((set, get) => ({
  input: '',
  output: '',
  error: null,
  indentSize: 2,
  parseResult: null,

  setInput: (value: string) => {
    if (!value.trim()) {
      set({ input: value, output: '', error: null, parseResult: null });
      return;
    }

    const result = unserialize(value);
    if (result.success) {
      set({
        input: value,
        output: formatOutput(result.data, get().indentSize),
        error: null,
        parseResult: result,
      });
    } else {
      set({
        input: value,
        output: '',
        error: result.error || 'Parsing error',
        parseResult: result,
      });
    }
  },

  setIndentSize: (size: number) => {
    const { parseResult } = get();
    set({ indentSize: size });
    if (parseResult?.success) {
      set({ output: formatOutput(parseResult.data, size) });
    }
  },

  loadExample: () => {
    const result = unserialize(EXAMPLE_INPUT);
    set({
      input: EXAMPLE_INPUT,
      output: result.success ? formatOutput(result.data, get().indentSize) : '',
      error: result.success ? null : result.error || 'Parsing error',
      parseResult: result,
    });
  },

  clear: () => {
    set({
      input: '',
      output: '',
      error: null,
      parseResult: null,
    });
  },
}));
